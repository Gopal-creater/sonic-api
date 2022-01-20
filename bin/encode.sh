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

#BIN_PATH=/home/arun/Work/Sonic/Core/sonic-core-modular/testing/linux/build/
#BIN_WATERMARK=encode
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

      MEDIA_SPECIFIC_FFMMPEG_PARAMS=" -c:a libmp3lame -b:a 320k "
      AVOID_SG_HACK_05DB="yes"
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

    rm -f $in_tmpfile_path $out_tmpfile_path
fi

exit 0

