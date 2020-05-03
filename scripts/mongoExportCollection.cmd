: # https://stackoverflow.com/a/17623721/1526048
:<<"::CMDLITERAL"
@ECHO OFF
GOTO :CMDSCRIPT
::CMDLITERAL

if [ "$#" -eq 2 ]; then
  mongoexport --db $1 --collection $2 -o "$1~$2.json"
else
  mongoexport --db $1 --collection $2 -o "$3"
fi

exit
:CMDSCRIPT

if "%~3"=="" (
  mongoexport --db %1 --collection %2 -o "%1~%2.json"
) else (
  mongoexport --db %1 --collection %2 -o "%3"
)
