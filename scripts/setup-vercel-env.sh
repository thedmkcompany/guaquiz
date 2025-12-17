#!/bin/bash

# ==================================================
# Vercel Environment Variables Setup Script
# ==================================================
# This script adds quiz welcome campaign variables to Vercel
# Run this AFTER creating campaigns in AISensy dashboard
# ==================================================

echo "🚀 Setting up Vercel Environment Variables for Quiz Welcome Messages"
echo ""
echo "Prerequisites:"
echo "  ✅ AISensy campaigns created and LIVE"
echo "  ✅ Vercel CLI installed (npm i -g vercel)"
echo "  ✅ Logged in to Vercel (vercel login)"
echo ""
read -p "Have you completed the prerequisites? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Please complete prerequisites first"
    exit 1
fi

echo ""
echo "📝 Adding environment variables to Vercel (Production)..."
echo ""

# Quiz Results Campaign Variables
echo "Adding AISENSY_CAMPAIGN_QUIZ_RESULTS_CIRCLE..."
echo "quiz_results_circle" | vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_CIRCLE production

echo "Adding AISENSY_CAMPAIGN_QUIZ_RESULTS_TRANSFORM..."
echo "quiz_results_transform" | vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_TRANSFORM production

echo "Adding AISENSY_CAMPAIGN_QUIZ_RESULTS_ESSENTIALS..."
echo "quiz_results_essentials" | vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_ESSENTIALS production

echo "Adding AISENSY_CAMPAIGN_QUIZ_RESULTS_WEBINAR..."
echo "quiz_results_webinar" | vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_WEBINAR production

echo "Adding AISENSY_CAMPAIGN_QUIZ_RESULTS_STRATEGY..."
echo "quiz_results_strategy" | vercel env add AISENSY_CAMPAIGN_QUIZ_RESULTS_STRATEGY production

echo ""
echo "✅ Environment variables added successfully!"
echo ""
echo "📋 Next Steps:"
echo "  1. Verify variables in Vercel dashboard:"
echo "     https://vercel.com/team_0pMdgIeCJDof8w0szAXp4xQq/dmk-quiz/settings/environment-variables"
echo ""
echo "  2. Redeploy your application:"
echo "     vercel --prod"
echo ""
echo "  3. Test quiz submission to verify WhatsApp messages"
echo ""
echo "🎉 Setup complete!"
