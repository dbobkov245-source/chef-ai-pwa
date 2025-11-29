<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Chef AI PWA 👨‍🍳

[![CI](https://github.com/dbobkov245-source/chef-ai-pwa/actions/workflows/ci.yml/badge.svg)](https://github.com/dbobkov245-source/chef-ai-pwa/actions/workflows/ci.yml)
[![PWA Check](https://github.com/dbobkov245-source/chef-ai-pwa/actions/workflows/pwa-check.yml/badge.svg)](https://github.com/dbobkov245-source/chef-ai-pwa/actions/workflows/pwa-check.yml)

AI-powered recipe generator with Progressive Web App capabilities.

View your app in AI Studio: https://ai.studio/apps/drive/1ZVRzvhhGf7nWSH6KjCz_gwQsjun1CPvI

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 🤖 GitHub Actions Automation

This project uses GitHub Actions for CI/CD automation:
- ✅ **Automated testing** on every push
- ✅ **PWA validation** for manifest and service worker
- ✅ **Auto-deployment** to Vercel on main branch
- ✅ **Version management** with automatic releases

📖 See [GitHub Actions Setup Guide](.github/ACTIONS_SETUP.md) for configuration details.
