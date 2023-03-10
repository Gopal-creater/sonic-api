#/bin/bash

# This script is specifically designed to work with WEB_BUILD enabled version of binaries.
# This script is only to be used with the sonic portal backend - with the execSync() 
# Javascript API idiosyncracies.  Original script is in sonic-core repo: arun@arbadev.com
# ------------------------------------------------------------------------------------------
# When WEB_BUILD is snabled, both binaries takes one additional argument - the output file.
# Only decode binary needs to use it as the web backend in Javascript takes the decode output 
# in this logfile by parsing it.
# -----------------------------------------------------------------------------------------
# $1 : input file full path
# $2 : output log file full path
# -----------------------------------------------------------------------------------------
# !!! IMPORANT: Change BIN_PATH according to the installation folder. 
# -----------------------------------------------------------------------------------------

#BIN_PATH=/home/arun/Work/Sonic/Core/sonic-core-modular/testing/linux/build/
#BIN_DETECT=decode
BIN_PATH="$BINARY_PATH"
BIN_DETECT="$BINARY_DETECT"

DETECT=$BIN_PATH/$BIN_DETECT
if [[ -f "$DETECT" && -x "$DETECT" ]]
then
  echo "Detect executable present"
else
  echo "Could not find the detect executable"
  exit 1
fi

infilename=$(basename -- "$1")
inext="${infilename##*.}"
infilename="${infilename%.*}"

echo "Input: filename: $infilename. Extension: $inext"

in_tmpfile_path=$1-in-tmp.wav

# The wavx stuff is a hack added for the mobile app to send WAV files for direct processing.
# This hack can be removed now by modifying app code. 
if [[ $inext == "wavx" || $inext == "WAVX" || $inext == "wav" || $inext == "WAV" ]]; then
    echo "Wave file processing"
    echo "Detecting..."

    $DETECT $1 $2
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
      echo "Detect binary succeeded"
    else
      echo "Detect binary reported error: $RESULT"
      exit $RESULT
    fi
else
    echo "NON WAV file processing"
    echo "Input temp file path: $in_tmpfile_path"

    echo "Transcoding $inext to wav using ffmpeg..."
    ffmpeg -hide_banner -loglevel error -y -i $1 -vn -acodec pcm_s16le -ar 44100 -ac 2 $in_tmpfile_path
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
      echo "Transcoding: ffmpeg succeeded"
    else
      echo "Transcoding: ffmpeg reported error: $RESULT"
      exit $RESULT
    fi

    echo "Detecting..."
    $DETECT $in_tmpfile_path $2
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
      echo "Detect binary succeeded"
    else
      echo "Detect binary reported error: $RESULT"
      exit $RESULT
    fi

    rm $in_tmpfile_path
fi

exit 0
