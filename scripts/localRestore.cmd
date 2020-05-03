: # https://stackoverflow.com/a/17623721/1526048
:<<"::CMDLITERAL"
@ECHO OFF
GOTO :CMDSCRIPT
::CMDLITERAL

TARGET=${1:-backup}

rm -rf $DIR/../client/uploads/
unzip $TARGET/uploads.zip $DIR/../client/uploads/
mongorestore $TARGET --drop

exit
:CMDSCRIPT

set TARGET=%1
IF "%~1"=="" set TARGET=backup

del %~dp0\..\client\uploads\
mongorestore %TARGET% --drop
powershell Expand-Archive %TARGET%\uploads.zip %~dp0\..\client\uploads\
