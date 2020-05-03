#Requires -RunAsAdministrator

$NodeJSurl = "https://nodejs.org/dist/v12.16.0/node-v12.16.0-x64.msi"
$MongoDBurl = "https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.3-signed.msi"

Import-Module BitsTransfer

$dir = Split-Path $MyInvocation.MyCommand.Path

Write-Host "Downloading NodeJS..." -ForegroundColor Yellow
Start-BitsTransfer -Source $NodeJSurl -Destination $dir\nodejs.msi

Write-Host "Downloading MongoDB..." -ForegroundColor Yellow
Start-BitsTransfer -Source $MongoDBurl -Destination $dir\mongo.msi

Write-Host "For both installs, use the default values." -ForegroundColor Green
Write-Host "In other words, smash the next button until installation is complete." -ForegroundColor Green
Write-Host "You do not need to install MongoDB Compass." -ForegroundColor Green

Write-Host "Installing NodeJS..." -ForegroundColor Green
Start-Process $dir\nodejs.msi -Wait

Write-Host "Installing MongoDB..." -ForegroundColor Green
Start-Process $dir\mongo.msi -Wait

Pause
