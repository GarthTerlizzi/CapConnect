: # https://stackoverflow.com/a/17623721/1526048
:<<"::CMDLITERAL"
@ECHO OFF
GOTO :CMDSCRIPT
::CMDLITERAL

DIR="$(dirname "${BASH_SOURCE[0]}")"
TARGET=${1:-backup}
PREFIX=$2

rm -rf $DIR/../docker/${PREFIX}capconnect/uploads/
unzip $TARGET/uploads.zip $DIR/../docker/${PREFIX}capconnect/uploads/

docker exec ${PREFIX}capconnect-db mkdir /tmp/dump/
docker cp ${TARGET}/capconnect/. ${PREFIX}capconnect-db:/tmp/dump/capconnect/
docker exec ${PREFIX}capconnect-db mongorestore /tmp/dump/ --drop
docker exec ${PREFIX}capconnect-db rm -rf /tmp/dump/

exit
:CMDSCRIPT

set DIR=%~dp0
set TARGET=%1
IF [%~1]==[] set TARGET=backup
set PREFIX=%2

del %DIR%\..\docker\%PREFIX%capconnect\uploads\

docker exec %PREFIX%capconnect-db mkdir /tmp/dump/
docker cp %TARGET%/capconnect/. %PREFIX%capconnect-db:/tmp/dump/capconnect/
docker exec %PREFIX%capconnect-db mongorestore /tmp/dump/ --drop
docker exec %PREFIX%capconnect-db rm -rf /tmp/dump/

powershell Expand-Archive %TARGET%\uploads.zip %DIR%\..\docker\%PREFIX%capconnect\uploads\
