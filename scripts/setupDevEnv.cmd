: # https://stackoverflow.com/a/17623721/1526048
:<<"::BASHSKIP"
@ECHO OFF
GOTO :WINDOWS
::BASHSKIP

if [ ! -x "$(command -v npm)" ]; then
  echo You seem to be missing NPM
  echo Please install NodeJS from https://nodejs.org/en/download/ or your package manager
  echo This project was developed using 13.9.0, but other versions may work.
fi

if [ ! -x "$(command -v mongo)" ]; then
  echo You seem to be missing MongoDB
  echo Please install MongoDB from https://www.mongodb.com/download-center/community
  echo This project was developed using 13.9.0, but other versions may work.
fi

function pause(){
   read -p "Press any key to continue . . ."
}

:<<"::BASHSKIP"
:DONE
::BASHSKIP

echo Strapi can now be started with 'npm start' from the project root.
echo If you plan to make changes to Strapi, use 'npm run develop' from the project root.
echo If you plan to make changes to the website, use 'npm start' from the 'client' folder.

pause
exit
:WINDOWS

%SystemRoot%\system32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -Command "& {Start-Process PowerShell.exe -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File ""%~dp0/installWindowsDeps.ps1""' -Verb RunAs}"
pause

: # Build Strapi
PUSHD %~dp0\..
ECHO Installing Strapi...
call "C:\Program Files\nodejs\npm" install --silent
call "C:\Program Files\nodejs\npm" run build --silent

: # Build Production
cd client
ECHO Building Production Website...
call "C:\Program Files\nodejs\npm" install --silent
call "C:\Program Files\nodejs\npm" run build --silent

POPD

ECHO You might need to run the PowerShell command 'Set-ExecutionPolicy RemoteSigned' to be able to run remote scripts.
GOTO :DONE
