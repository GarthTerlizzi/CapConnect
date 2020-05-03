: # https://stackoverflow.com/a/17623721/1526048
:<<"::CMDLITERAL"
@ECHO OFF
GOTO :CMDSCRIPT
::CMDLITERAL

DIR="$(dirname "${BASH_SOURCE[0]}")"
TARGET=${1:-backup}
PREFIX=$2

rm -rf $TARGET
mkdir $TARGET

docker exec ${PREFIX}capconnect-db mongodump -d capconnect -o /tmp/dump/
docker cp ${PREFIX}capconnect-db:/tmp/dump/capconnect/ $TARGET
docker exec ${PREFIX}capconnect-db rm -rf /tmp/dump/


dest=$(pwd)
(
  cd $DIR/../docker/${PREFIX}capconnect/uploads/
  zip -r -9 $dest/$TARGET/uploads.zip ./
)

exit
:CMDSCRIPT

set DIR=%~dp0
set TARGET=%1
IF [%~1]==[] set TARGET=backup
set PREFIX=%2

del %TARGET%
mkdir %TARGET%

docker exec %PREFIX%capconnect-db mongodump -d capconnect -o /tmp/dump/
docker cp %PREFIX%capconnect-db:/tmp/dump/capconnect/ %TARGET%
docker exec %PREFIX%capconnect-db rm -rf /tmp/dump/

powershell Compress-Archive %DIR%\..\docker\%PREFIX%capconnect\uploads\* %TARGET%\uploads.zip
