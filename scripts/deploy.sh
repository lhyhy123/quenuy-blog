#!/bin/bash
# 一键部署脚本——构建并推送到 GitHub Pages
set -e
cd "$(dirname "$0")/.."

echo "🚀 构建..."
npm run build

cd out
rm -rf .git
git init && git checkout -b main
git remote add origin https://github.com/lhyhy123/lhyhy123.github.io.git
git add -A
git commit -m "🚀 部署 $(date '+%m-%d %H:%M')" --quiet
git -c http.version=HTTP/1.1 -c http.sslVerify=false push --force origin main:main
cd ..
rm -rf out/.git
echo "✅ 部署完成 → https://quenuy.top"
