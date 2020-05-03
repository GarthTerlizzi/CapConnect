: # https://stackoverflow.com/a/17623721/1526048
:<<"::CMDLITERAL"
@ECHO OFF
GOTO :CMDSCRIPT
::CMDLITERAL

./mongoExportCollection.cmd capconnect users-permissions_role $1role.json
./mongoExportCollection.cmd capconnect users-permissions_permission $1permission.json

exit
:CMDSCRIPT

call ./mongoExportCollection.cmd capconnect users-permissions_role %1role.json
call ./mongoExportCollection.cmd capconnect users-permissions_permission %1permission.json
