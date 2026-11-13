#!/bin/bash
# 모바일 청첩장 GitHub Pages 자동 배포 스크립트 (deploy.sh)

set -e

# 1. 본인 GitHub 정보 입력 (아래 두 줄만 본인 계정 정보로 수정하세요)
GITHUB_USERNAME="lilatas"
REPO_NAME="wedding-invitation"

echo "=========================================="
echo "💍 모바일 청첩장 GitHub 배포를 시작합니다."
echo "=========================================="

# 2. 이미지 폴더가 없으면 자동 생성
mkdir -p images

# 3. Git 초기화 및 브랜치 설정
if [ ! -d ".git" ]; then
  git init
  git branch -M main
  echo "✅ Git 저장소가 초기화되었습니다."
fi

# 4. 원격 저장소(origin) 연결 확인 및 설정
REMOTE_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
if git remote | grep -q "^origin$"; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

# 5. 변경 파일 스테이징 및 커밋
git add .
COMMIT_MSG="Update wedding invitation ($(date '+%Y-%m-%d %H:%M:%S'))"
git commit -m "$COMMIT_MSG" || echo "ℹ️ 변경된 사항이 없습니다."

# 6. GitHub main 브랜치로 푸시
echo "🚀 GitHub로 파일을 업로드합니다..."
git push -u origin main

echo "=========================================="
echo "🎉 업로드가 완료되었습니다!"
echo "👉 GitHub 저장소 Settings > Pages 에서 Branch를 'main'으로 설정하면"
echo "   약 1~2분 뒤 아래 주소로 모바일 청첩장이 열립니다:"
echo "   https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo "=========================================="