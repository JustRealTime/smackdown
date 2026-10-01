@echo off
title Typebite server
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Get it from https://nodejs.org and run this file again.
  pause
  exit /b 1
)
node "%~dp0server\server.js"
pause
