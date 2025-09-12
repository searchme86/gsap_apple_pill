// animation_applePill.html/scripts/gsapAnimations.js - GSAP 스케일 및 높이 애니메이션 관리

import { domElementsConfig, debugLog } from './config.js';
import { applyFianlPinSpacerHeight } from './responsiveManager.js';

/**
 * 높이 축소 애니메이션 함수
 * 스케일 애니메이션 완료 후 onComplete에서 실행됨
 * 디바이스 섹션의 높이를 100vh에서 60vh로 축소
 */
export const adaptingReduceHeight = () => {
  // 0.5초 지연 후 높이 애니메이션 시작
  gsap.delayedCall(0.5, () => {
    // 높이 축소 트윈 애니메이션 생성
    const heightReductionTween = gsap.to(domElementsConfig.deviceImageSection, {
      // 디바이스 섹션 높이를 60vh로 축소
      height: '60vh',

      // 애니메이션 지속시간 2초
      duration: 2,

      // 부드러운 가속-감속 이징
      ease: 'power2.inOut',

      /**
       * 높이 애니메이션 완료 콜백
       */
      onComplete: () => {
        // 최종 반응형 pin-spacer 높이 설정
        applyFianlPinSpacerHeight();
        // debugLog('최종 pin-spacer 반응형 height로 고정');
      },
    });

    /**
     * pin-spacer 실시간 동기화 함수
     * 높이 애니메이션 중 pin-spacer도 함께 변경되도록 처리
     */
    const synchronizePinSpacerHeightWhileScrolling = () => {
      const pinSpacerElement = document.querySelector('.pin-spacer');

      // 애니메이션이 아직 진행 중인 경우만 동기화
      if (pinSpacerElement && heightReductionTween.progress() < 1) {
        // 현재 섹션의 실제 높이값 가져오기
        const currentSectionHeight =
          domElementsConfig.deviceImageSection.getBoundingClientRect().height;

        // pin-spacer 높이를 섹션 높이와 동일하게 설정
        pinSpacerElement.style.setProperty(
          'height',
          `${currentSectionHeight}px`,
          'important'
        );
        pinSpacerElement.style.minHeight = 'auto';
        pinSpacerElement.style.maxHeight = 'none';

        // 다음 프레임에서 재귀 호출 (60fps로 동기화)
        requestAnimationFrame(synchronizePinSpacerHeightWhileScrolling);
      }
    };

    // pin-spacer 동기화 시작
    synchronizePinSpacerHeightWhileScrolling();
  });
};

/**
 * 순차 스케일 애니메이션을 초기화하는 함수
 * 디바이스 목업을 스크롤에 따라 축소시키는 애니메이션
 * onComplete에서 높이 애니메이션을 연계 실행
 */
export const scalingDomAnimation = () => {
  // GSAP ScrollTrigger를 사용한 스케일 애니메이션
  // 스크롤에 따라서 div돔이 줄어드는 애니메이션
  gsap.to(domElementsConfig.scalableDeviceMockup, {
    // 목업 요소를 66.67% 크기로 축소
    // 최종 축소 비율
    scale: 0.6667,

    scrollTrigger: {
      // scaling될 요소
      trigger: '.main-animation-section .device-image-section',

      // 해당 섹션을 화면에 고정 (sticky 효과)
      // 어떤 요소를 스크롤함에 따라서 고정할지를 결정
      pin: '.main-animation-section .device-image-section',

      // 스크롤과 애니메이션을 1:1로 동기화
      scrub: 1,

      // 애니메이션 시작점: scaling될 요소의 상단(top)이 뷰포트 상단(top)에 도달할 때
      start: 'top top',

      // 애니메이션 종료점: scaling될 요소를 400vh만큼 스크롤한 후
      end: '+=400vh',

      /**
       * 스크롤 진행에 따른 업데이트 콜백
       * @param {object} scrollTriggerSelf - ScrollTrigger 인스턴스
       */
      onUpdate: () => {
        applyFianlPinSpacerHeight();
      },

      /**
       * 스케일 애니메이션 완료 시 콜백
       * 높이 애니메이션을 연계 실행
       */
      onComplete: () => {
        adaptingReduceHeight(); // 높이 축소 애니메이션 시작
      },
    },

    // 부드러운 감속 이징 적용
    ease: 'power2.out',
  });
};
