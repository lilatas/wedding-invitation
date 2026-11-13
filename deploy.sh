#!/bin/bash
# 에러가 발생해도 창이 바로 꺼지지 않도록 설정

GITHUB_USERNAME="lilatas"
REPO_NAME="wedding-invitation"

echo "=========================================="
echo "💍 모바일 청첩장 GitHub 배포를 시작합니다."
echo "=========================================="

# 1. 윈도우 PC에 Git 사용자 정보가 없을 경우 임시 설정 (커밋 에러 방지)
if [ -z "$(git config user.name)" ]; then
  git config user.name "$GITHUB_USERNAME"
fi
if [ -z "$(git config user.email)" ]; then
  git config user.email "${GITHUB_USERNAME}@users.noreply.github.com"
fi

# 2. 이미지 폴더 생성 및 Git 초기화
mkdir -p images
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

# 3. 원격 저장소 연결
REMOTE_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
if git remote | grep -q "^origin$"; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

# 4. 스테이징 및 커밋
git add .
git commit -m "Update wedding invitation"

# 5. GitHub로 푸시 (README 파일 충돌 방지를 위해 강제 푸시 옵션 포함)
echo "🚀 GitHub로 파일을 업로드합니다..."
git push -u origin main --force

echo "=========================================="
echo "✅ 실행이 완료되었습니다. 위 로그에 빨간색 에러가 없는지 확인하세요."
echo "🌐 배포 주소: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo "=========================================="
read -p "창을 닫으려면 Enter 키를 누르세요..."