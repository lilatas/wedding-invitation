// 1. 사진 파일 선택 시 즉시 액자에 반영 + 브라우저 LocalStorage에 저장
function bindImageUploader(inputId, imgId, placeholderId, storageKey) {
  const fileInput = document.getElementById(inputId);
  const imgEl = document.getElementById(imgId);
  const placeholderEl = document.getElementById(placeholderId);

  if (!fileInput || !imgEl || !placeholderEl) return;

  // 페이지 로드 시 이미 고정 이미지(src)가 있거나 저장된 사진이 있으면 표시
  const savedDataUrl = localStorage.getItem(storageKey);
  if (savedDataUrl) {
    imgEl.src = savedDataUrl;
    imgEl.classList.remove('hidden');
    placeholderEl.classList.add('hidden');
  } else if (imgEl.getAttribute('src') && imgEl.getAttribute('src').trim() !== '') {
    imgEl.classList.remove('hidden');
    placeholderEl.classList.add('hidden');
  }

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target.result;
      imgEl.src = resultUrl;
      imgEl.classList.remove('hidden');
      placeholderEl.classList.add('hidden');

      try {
        localStorage.setItem(storageKey, resultUrl);
      } catch (err) {
        console.warn('이미지 용량이 커서 브라우저 임시저장은 생략되었습니다.');
      }
    };
    reader.readAsDataURL(file);
  });
}

// 기본 액자 바인딩
document.addEventListener('DOMContentLoaded', () => {
  bindImageUploader('upload-bride', 'img-bride', 'placeholder-bride', 'wedding_bride_img');
  bindImageUploader('upload-groom', 'img-groom', 'placeholder-groom', 'wedding_groom_img');
  bindImageUploader('gallery-upload-1', 'gallery-img-1', 'gallery-placeholder-1', 'wedding_gal_1');
  bindImageUploader('gallery-upload-2', 'gallery-img-2', 'gallery-placeholder-2', 'wedding_gal_2');
  bindImageUploader('gallery-upload-3', 'gallery-img-3', 'gallery-placeholder-3', 'wedding_gal_3');
  bindImageUploader('upload-map', 'img-map', 'placeholder-map', 'wedding_map_img');

  // 갤러리 중앙 프레임으로 초기 스크롤 정렬
  const carousel = document.getElementById('galleryCarousel');
  if (carousel && carousel.children.length >= 2) {
    const secondCard = carousel.children[1];
    carousel.scrollLeft = secondCard.offsetLeft - (carousel.clientWidth - secondCard.clientWidth) / 2;
  }

  // 편지봉투 클릭 시 편지지로 부드럽게 스크롤 및 강조 효과
  const envelopeBtn = document.getElementById('envelopeBtn');
  const letterPaper = document.getElementById('letterPaper');
  if (envelopeBtn && letterPaper) {
    envelopeBtn.addEventListener('click', () => {
      letterPaper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      letterPaper.style.transform = 'scale(1.02)';
      setTimeout(() => {
        letterPaper.style.transform = 'scale(1)';
      }, 400);
    });
  }

  // 갤러리 슬롯 추가 버튼
  let slotCount = 3;
  const addGallerySlotBtn = document.getElementById('addGallerySlotBtn');
  if (addGallerySlotBtn && carousel) {
    addGallerySlotBtn.addEventListener('click', () => {
      slotCount += 1;
      const frame = document.createElement('div');
      frame.className = 'polaroid-frame';
      frame.innerHTML = `
        <label class="polaroid-photo-slot" for="gallery-upload-${slotCount}">
          <input type="file" id="gallery-upload-${slotCount}" accept="image/*" hidden />
          <img id="gallery-img-${slotCount}" src="" alt="웨딩 사진 ${slotCount}" class="uploaded-photo hidden" />
          <div class="upload-placeholder" id="gallery-placeholder-${slotCount}">
            <span>+ 사진 ${slotCount} 추가</span>
          </div>
        </label>
      `;
      carousel.appendChild(frame);
      bindImageUploader(
        `gallery-upload-${slotCount}`,
        `gallery-img-${slotCount}`,
        `gallery-placeholder-${slotCount}`,
        `wedding_gal_${slotCount}`
      );
      frame.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    });
  }

  // 미리보기 모드 전환 버튼
  const toggleEditBtn = document.getElementById('toggleEditBtn');
  if (toggleEditBtn) {
    toggleEditBtn.addEventListener('click', () => {
      document.body.classList.toggle('preview-mode');
      const isPreview = document.body.classList.contains('preview-mode');
      toggleEditBtn.textContent = isPreview ? '편집 모드로 돌아가기' : '미리보기 모드';
    });
  }

  // 주소 복사 버튼
  const copyAddrBtn = document.getElementById('copyAddrBtn');
  if (copyAddrBtn) {
    copyAddrBtn.addEventListener('click', () => {
      const addr = document.querySelector('.venue-address')?.innerText || '';
      navigator.clipboard.writeText(addr).then(() => {
        alert('웨딩홀 주소가 복사되었습니다.');
      });
    });
  }
});