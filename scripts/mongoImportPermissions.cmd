: # https://stackoverflow.com/a/17623721/1526048
:<<"::CMDLITERAL"
@ECHO OFF
GOTO :CMDSCRIPT
::CMDLITERAL

./mongoImportCollection.cmd capconnect users-permissions_role $1role.json
./mongoImportCollection.cmd capconnect users-permissions_permission $1permission.json

exit
:CMDSCRIPT

call ./mongoImportCollection.cmd capconnect users-permissions_role %1role.json
call ./mongoImportCollection.cmd capconnect users-permissions_permission %1permission.json
