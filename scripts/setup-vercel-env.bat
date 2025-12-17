@echo off
REM ==================================================
REM Vercel Environment Variables Setup Script (Windows)
REM ==================================================
REM This script adds quiz welcome campaign variables to Vercel
REM Run this AFTER creating campaigns in AISensy dashboard
REM ==================================================

echo.
echo 🚀 Setting up Vercel Environment Variables for Quiz Welcome Messages
echo.
echo Prerequisites:
echo   ✅ AISensy campaigns created and LIVE
echo   ✅ Vercel CLI installed (npm i -g vercel)
echo   ✅ Logged in to Vercel (vercel login)
echo.
set /p continue="Have you completed the prerequisites? (y/n): "
if /i not "%continue%"=="y" (
    echo ❌ Please complete prerequisites first
    exit /b 1
)

echo.
echo 📝 Adding environment variables to Vercel (Production)...
echo.

REM Quiz Results Campaign Variables
echo Adding AISENSY_CAMPAIGN_QUIZ_RESULTS_CIRCLE...
echo quiz_results_circle | vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_CIRCLE production

echo Adding AISENSY_CAMPAIGN_QUIZ_RESULTS_TRANSFORM...
echo quiz_results_transform | vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_TRANSFORM production

echo Adding AISENSY_CAMPAIGN_QUIZ_RESULTS_ESSENTIALS...
echo quiz_results_essentials | vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_ESSENTIALS production

echo Adding AISENSY_CAMPAIGN_QUIZ_RESULTS_WEBINAR...
echo quiz_results_webinar | vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_WEBINAR production

echo Adding AISENSY_CAMPAIGN_QUIZ_RESULTS_STRATEGY...
echo quiz_results_strategy | vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_STRATEGY production

echo.
echo ✅ Environment variables added successfully!
echo.
echo 📋 Next Steps:
echo   1. Verify variables in Vercel dashboard:
echo      https://vercel.com/team_0pMdgIeCJDof8w0szAXp4xQq/dmk-quiz/settings/environment-variables
echo.
echo   2. Redeploy your application:
echo      vercel --prod
echo.
echo   3. Test quiz submission to verify WhatsApp messages
echo.
echo 🎉 Setup complete!
pause
