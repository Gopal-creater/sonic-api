#/bin/bash

# This script is specifically designed to work with WEB_BUILD enabled version of binaries.
# This script is only to be used with the sonic portal backend - with the execSync() 
# Javascript API idiosyncracies.  Original script is in sonic-core repo: arun@arbadev.com
# ------------------------------------------------------------------------------------------
# When WEB_BUILD is snabled, both binaries takes one additional argument - the output file.
# Only decode binary needs to use it as the web backend in Javascript takes the decode output 
# in this logfile by parsing it. In encoder.sh script (this script), you can see that this 
# additional argument is hardcoded as /dev/null.
# -----------------------------------------------------------------------------------------
# $1 : -h
# $2 : Encoding_strength parameter (integer 1-100)
# $3 : input file full path
# $4 : output file full path
# $5 : the sonic key
# Last argument is hardcoded as /dev/null here.
# -----------------------------------------------------------------------------------------
# !!! IMPORANT: Change BIN_PATH according to the installation folder.
# -----------------------------------------------------------------------------------------

BIN_PATH=/home/ubuntu/code/Sonic-API/bin/
# BIN_PATH=/home/ubuntu/sonic-staging/Sonic-API/bin/
# BIN_PATH=/home/arun/Work/Sonic/Phase-2/src/github/sonic-core/
BIN_WATERMARK=watermark

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

if [[ $inext == "wavx" || $inext == "WAVX" ]]; then
    echo "Wave file processing"
    echo "Watermarking..."

    $WATERMARK $1 $2 $3 $4 $5 /dev/null
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
      echo "Watermark binary succeeded"
    else
      echo "Watermark binary reported error: $RESULT"
      exit $RESULT
    fi
else
    echo "NON WAV file processing"

    echo "Transcoding input $inext to wav using ffmpeg..."
    ffmpeg -hide_banner -loglevel error -y -i $3 -vn -acodec pcm_s16le -ar 44100 -ac 2 $in_tmpfile_path
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
      echo "Transcoding input: ffmpeg succeeded"
    else
      echo "Transcoding input: ffmpeg reported error: $RESULT"
      exit $RESULT
    fi

    echo "Watermarking..."
    $WATERMARK $1 $2 $in_tmpfile_path $out_tmpfile_path $5 /dev/null
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
      echo "Watermark binary succeeded"
    else
      echo "Watermark binary reported error: $RESULT"
      exit $RESULT
    fi    

    echo "Transcoding output to $outext using ffmpeg..."
    ffmpeg -hide_banner -loglevel error -y -i $out_tmpfile_path $4 
        RESULT=$?
    if [ $RESULT -eq 0 ]; then
      echo "Transcoding output: ffmpeg succeeded"
    else
      echo "Transcoding output: ffmpeg reported error: $RESULT"
      exit $RESULT
    fi

    rm $in_tmpfile_path $out_tmpfile_path
fi

exit 0
