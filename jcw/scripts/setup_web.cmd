@echo off
echo Setting up Next.js Web App...
cd /d "%~dp0..\apps\web"

echo Creating Next.js app...
if not exist "package.json" (
    echo Creating Next.js app with TypeScript and Tailwind...
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
)

echo Installing additional dependencies...
npm install @types/node@latest

echo Creating .env.local.example...
if not exist ".env.local.example" (
    echo NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api > .env.local.example
    echo NEXT_PUBLIC_DEV_DOMAIN=.lvh.me >> .env.local.example
    echo NEXT_PUBLIC_APP_NAME=Just Code Works >> .env.local.example
)

echo Next.js setup complete!
echo Next steps:
echo 1. Copy .env.local.example to .env.local
echo 2. Run: npm run dev
pause