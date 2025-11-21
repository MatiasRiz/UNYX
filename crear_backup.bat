@echo off
setlocal enabledelayedexpansion

:: Obtener la ruta del directorio donde está el script
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

:: Crear carpeta de backups si no existe
if not exist "backups" mkdir "backups"

:: Obtener fecha y hora en formato YYYYMMDD_HHMMSS
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set FECHA=%datetime:~0,4%%datetime:~4,2%%datetime:~6,2%_%datetime:~8,2%%datetime:~10,2%%datetime:~12,2%

:: Nombre del archivo de backup
set "BACKUP_NAME=UNYX_backup_%FECHA%.zip"
set "BACKUP_PATH=backups\%BACKUP_NAME%"

echo ========================================
echo   CREANDO BACKUP DE UNYX
echo ========================================
echo.
echo Fecha y hora: %FECHA%
echo Destino: %BACKUP_PATH%
echo.

:: Usar PowerShell para crear el ZIP excluyendo la carpeta backups
powershell -Command "$files = Get-ChildItem -Path '.' -Exclude 'backups' | Where-Object { $_.Name -ne 'backups' }; Compress-Archive -Path $files.FullName -DestinationPath '.\%BACKUP_PATH%' -Force -CompressionLevel Optimal"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   BACKUP CREADO EXITOSAMENTE
    echo ========================================
    echo.
    echo Archivo: %BACKUP_PATH%
    echo.
    dir "backups\%BACKUP_NAME%"
) else (
    echo.
    echo ========================================
    echo   ERROR AL CREAR BACKUP
    echo ========================================
    echo.
)

echo.
pause
