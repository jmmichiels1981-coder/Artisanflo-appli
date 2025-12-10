@echo off
echo ==========================================
echo  Synchronisation du Code (Frontend + Backend)
echo ==========================================

git add .
set /p commitMsg="Entrez le message de commit (Entree pour defaut 'Mise a jour'): "
if "%commitMsg%"=="" set commitMsg=Mise a jour

git commit -m "%commitMsg%"
git push

echo.
echo ==========================================
echo  Tout est a jour !
echo ==========================================
pause
