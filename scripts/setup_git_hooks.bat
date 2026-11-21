@echo off
echo ======================================================================
echo   Configuring Nandankanan Project Git Safety Hooks
echo ======================================================================

git config core.hooksPath .githooks

echo.
echo [SUCCESS] Git hooks configured to .githooks directory!
echo Commits and pushes containing database migration files will now be blocked automatically.
echo ======================================================================
pause
