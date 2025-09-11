@echo off
echo Actualizando repositorio...

git add .
git commit -m "Actualización automática - %date% %time%"
git push origin main

echo ¡Actualización completada!
pause
