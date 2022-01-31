#/bin/bash

# This script is specifically designed to work with WEB_BUILD enabled version of binaries.
# This script is only to be used with the sonic portal backend - with the execSync() 
# Javascript API idiosyncracies.  Original script is in sonic-core repo: arun@arbadev.com
# ------------------------------------------------------------------------------------------
# When WEB_BUILD is snabled, decode binary takes one additional argument - the output file.
# Only decode binary needs to use it as the web backend in Javascript takes the decode output 
# in this logfile by parsing it. 
# -----------------------------------------------------------------------------------------
# $1 : -h
# $2 : Encoding_strength parameter (integer 1-100)
# $3 : input file full path
# $4 : output file full path
# $5 : the sonic key
# -----------------------------------------------------------------------------------------
# !!! IMPORANT: Change BIN_PATH according to the installation folder.
# -----------------------------------------------------------------------------------------

# BIN_PATH=/home/arun/Work/Sonic/Core/sonic-core-modular/web/linux/build/
# BIN_WATERMARK=encode
BIN_PATH="$BINARY_PATH"
BIN_WATERMARK="$BINARY_WATERMARK"

WATERMARK=$BIN_PATH/$BIN_WATERMARK
if [[ -f "$WATERMARK" && -x "$WATERMARK" ]]
then
  echo "Watermark executable present"
else
  echo "Could not find watermark executable"
  exit 1
fi

infilename=$(basename -- "$3")
inext="${infilename##*.}"
infilename="${infilename%.*}"

outfilename=$(basename -- "$4")
outext="${outfilename##*.}"
outfilename="${outfilename%.*}"

in_tmpfile_path=$3-in-tmp.wav
out_tmpfile_path=$3-out-tmp.wav

out_tmpfile_path4albart=$3-out-tmp2.$outext

mp3albumartfilename=$3-albumart.png
processalbumart="no"

echo "Encoding strength: $2"
echo "Input: filename: $infilename. Extension: $inext"
echo "Input temp file path: $in_tmpfile_path"
echo "Otput temp file path: $out_tmpfile_path"

# The wavx stuff is a hack added for the mobile app to send WAV files for direct processing.
# This hack can be removed now by modifying app code. 
if [[ $inext == "wavx" || $inext == "WAVX" || $inext == "wav" || $inext == "WAV" ]]; then
    echo "Wave file processing"

    ACODEC="pcm_s16le"
    BITDEPTH=`mediainfo $3 | grep "Bit depth" | cut -d ":" -f 2 | cut -d " " -f 2`
    case $BITDEPTH in
        24)
            ACODEC="pcm_s24le"
            ;;    
        16)
            ACODEC="pcm_s16le"
            ;;
        *)
            echo "Warning: Unknown bit depth $BITDEPTH. ACODEC wil be forced to be 16bit"
            ;;
    esac
    echo "ACODEC is set as: $ACODEC"

    # this is an unnecessary hack forced to put here by Simon Gogerly in 2021 December.
    echo "0.5db reduction"
    ffmpeg -hide_banner -loglevel error -y -i $3 -filter:a "volume=-0.5dB" -acodec $ACODEC $in_tmpfile_path

    echo "Watermarking..."

    $WATERMARK $1 $2 $in_tmpfile_path $4 $5
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
      echo "Watermark binary succeeded"
    else
      echo "Watermark binary reported error: $RESULT"
      exit $RESULT
    fi

    rm -f $in_tmpfile_path
else
    echo "NON WAV file processing"

    ENC_STRENGTH=$2
    MEDIA_SPECIFIC_PARAMS=""
    AVOID_SG_HACK_05DB="no"

    if test $inext = "mp3"; then       
      ENC_STRENGTH=20
      echo "MP3 processing using encoding strength: $ENC_STRENGTH"

      BITRATE=`mediainfo $3 | grep "Bit rate" | grep "kb/s" | cut -d ":" -f 2 | cut -d " " -f 2`
      if [ -z $BITRATE ]; then
        echo "Could not fnd bit rate. forcing 128"
        BITRATE="128"
      else
        echo "Got bit rate: $BITRATE"
      fi

      BITRATE+='k'

      if test $BITRATE = "128k"; then
        echo "Increasing encoding strength to 25 for 128k mp3"
        ENC_STRENGTH=25
      fi
    
      MEDIA_SPECIFIC_FFMMPEG_PARAMS=" -c:a libmp3lame -b:a $BITRATE "
      AVOID_SG_HACK_05DB="yes"

      # album art      
      rm -f $mp3albumartfilename
      ffmpeg -hide_banner -loglevel error -i $3 -an -vcodec copy $mp3albumartfilename     
      if [ -f $mp3albumartfilename ]; then
        echo "mp3 album art found and saved to: $mp3albumartfilename"
        processalbumart="yes"
      else 
        echo "No album art file found."
      fi
    fi

    echo "Media specific conversion params: $MEDIA_SPECIFIC_FFMMPEG_PARAMS"

    # the 0.5db reduction is an unnecessary hack forced to put here by Simon Gogerly in 2021 December.
    if [ $AVOID_SG_HACK_05DB == "no" ]; then
      echo "Transcoding input $inext to wav using ffmpeg (with 0.5db reduction)..."
      ffmpeg -hide_banner -loglevel error -y -i $3 -filter:a "volume=-0.5dB" -vn -acodec pcm_s16le -ar 44100 -ac 2 $in_tmpfile_path
    else
      echo "Transcoding input $inext to wav using ffmpeg (without 0.5db reduction)..."
      ffmpeg -hide_banner -loglevel error -y -i $3 -vn -acodec pcm_s16le -ar 44100 -ac 2 $in_tmpfile_path
    fi

    RESULT=$?
    if [ $RESULT -eq 0 ]; then
      echo "Transcoding input: ffmpeg succeeded"
    else
      echo "Transcoding input: ffmpeg reported error: $RESULT"
      exit $RESULT
    fi

    echo "Watermarking..."
    $WATERMARK $1 $ENC_STRENGTH $in_tmpfile_path $out_tmpfile_path $5 /dev/null
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
      echo "Watermark binary succeeded"
    else
      echo "Watermark binary reported error: $RESULT"
      exit $RESULT
    fi    

    echo "Transcoding output to $outext using ffmpeg..."
    ffmpeg -hide_banner -loglevel error -y -i $out_tmpfile_path $MEDIA_SPECIFIC_FFMMPEG_PARAMS $4 
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
      echo "Transcoding output: ffmpeg succeeded"
    else
      echo "Transcoding output: ffmpeg reported error: $RESULT"
      exit $RESULT
    fi

    # Mux album art if needed
    if [ $processalbumart == "yes" ]; then
      ffmpeg -hide_banner -loglevel error -i $4 -i $mp3albumartfilename -map 0:0 -map 1:0 -c copy -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" $out_tmpfile_path4albart
      RESULT=$?

      if [ $RESULT -eq 0 ]; then
        echo "Muxing album art: ffmpeg succeeded"
        rm -f $4
        mv $out_tmpfile_path4albart $4
      else
        echo "Muxing album art: ffmpeg reported error: $RESULT"
        rm -f $mp3albumartfilename $out_tmpfile_path4albart
        exit $RESULT
      fi
    fi

    rm -f $in_tmpfile_path $out_tmpfile_path $out_tmpfile_path4albart $mp3albumartfilename
fi

exit 0

