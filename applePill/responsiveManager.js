// animation_applePill.html/scripts/responsiveManager.js - 반응형 pin-spacer 높이 관리

/**
 * 현재 뷰포트 크기에 따라 pin-spacer 높이를 계산하는 함수
 * 모바일과 데스크톱 환경에 맞는 최적의 높이값을 반환
 *
 * @returns {string} CSS 높이값 (예: '90vh', '125vh')
 */
export const calculateResponsivePinSpacerHeightByViewport = () => {
  // 현재 브라우저 창의 가로 크기를 가져옴
  const currentViewportWidth = window.innerWidth;
  // 모바일 디바이스 여부 판단 (360px 이상 768px 미만)
  // 이 범위는 대부분의 스마트폰 화면 크기에 해당
  const isMobileDevice =
    currentViewportWidth >= 360 && currentViewportWidth < 768;
  // 모바일에서는 pinSpacer의 높이를 90vh, 데스크톱에서는 125vh 사용
  // vh는 뷰포트 높이의 백분율 단위
  const responsivePinSpacerHeight = isMobileDevice ? '90vh' : '125vh';
  return responsivePinSpacerHeight;
};

/**
 * pin-spacer 요소에 높이값을 적용하는 함수
 * CSS 우선순위 강제 적용 및 min/max 높이도 함께 설정
 *
 * @param {string|null} customHeight - 사용자 정의 높이값 (없으면 자동 계산)
 */
// 커스텀 높이(customHeight)가 주어지지 않으면 반응형 계산 함수 사용
export const applyFianlPinSpacerHeight = (customHeight = null) => {
  const targetHeightValue =
    customHeight || calculateResponsivePinSpacerHeightByViewport();

  // GSAP ScrollTrigger가 생성하는 pin-spacer 요소를 찾음
  const pinSpacerElement = document.querySelector('.pin-spacer');

  if (pinSpacerElement) {
    // CSS 높이 속성을 최고 우선순위(!important)로 설정
    pinSpacerElement.style.setProperty(
      'height',
      targetHeightValue,
      'important'
    );

    // 최소/최대 높이도 동일하게 설정하여 높이 고정
    pinSpacerElement.style.minHeight = targetHeightValue;
    pinSpacerElement.style.maxHeight = targetHeightValue;
  }
};

/**
 * 브라우저 창 크기 변경 시 pin-spacer 높이를 재계산하는 이벤트 핸들러
 * 디바운스 기법을 사용하여 과도한 재계산 방지
 */
export const initializeResponsiveResizeHandler = () => {
  // 디바운스 타이머 - 연속된 resize 이벤트를 제어
  let resizeDebounceTimer;

  /**
   * 뷰포트 크기 변경 처리 함수
   * 100ms 디바운스를 적용하여 성능 최적화
   */
  const handleViewportResize = () => {
    // 이전 타이머가 있으면 취소
    clearTimeout(resizeDebounceTimer);

    // 100ms 후에 실제 처리 실행
    resizeDebounceTimer = setTimeout(() => {
      applyFianlPinSpacerHeight();
    }, 100);
  };

  // 브라우저 resize 이벤트에 핸들러 등록
  window.addEventListener('resize', handleViewportResize);
};
