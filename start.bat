@echo off
title Wedding Planner Pro - Local Server
cd /d "%~dp0"
echo ========================================================
echo  💍 WEDDING PLANNER PRO - PORTAL SYSTEM
echo ========================================================
echo  [1] Portal Customer : http://localhost:5500
echo  [2] Portal Admin    : http://localhost:5500/admin.html
echo ========================================================
echo Membuka server lokal...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
