: # https://stackoverflow.com/a/17623721/1526048
:<<"::CMDLITERAL"
@ECHO OFF
GOTO :CMDSCRIPT
::CMDLITERAL

DIR="$(dirname "${BASH_SOURCE[0]}")"
TARGET=${1:-backup}
rm -rf $TARGET
mkdir $TARGET
mongodump -d capconnect -o $TARGET
dest=$(pwd)
(
  cd $DIR/../client/uploads/
  zip -r -9 $dest/$TARGET/uploads.zip ./
)

exit
:CMDSCRIPT

set TARGET=%1
IF "%~1"=="" set TARGET=backup

del %target%
mongodump -d capconnect -o %TARGET%
powershell Compress-Archive %~dp0\..\client\uploads\* %TARGET%\uploads.zip
