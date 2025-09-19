// animation_applePill.html/scripts/gsapAnimations.js
// GSAP를 사용한 스케일 및 높이 애니메이션을 관리하는 모듈

import { domElementsConfig } from './config.js';
import { applyFianlPinSpacerHeight } from './responsiveManager.js';
import { updateScrollDirectionText } from './textChangeSystem.js';

/**
 * 높이 축소 애니메이션을 실행하는 함수
 * 스케일 애니메이션 완료 후 연계되어 실행됨
 * 디바이스 섹션의 높이를 100vh에서 60vh로 부드럽게 축소
 */
export const adaptingReduceHeight = () => {
  // 0.5초 지연 후 높이 애니메이션 시작
  // 스케일 애니메이션과의 자연스러운 연결을 위한 딜레이
  gsap.delayedCall(0.5, () => {
    // 높이 축소 트윈 애니메이션 생성
    const heightReductionTween = gsap.to(domElementsConfig.deviceImageSection, {
      height: '60vh', // 뷰포트 높이의 60%로 축소
      duration: 2, // 2초 동안 애니메이션 실행
      ease: 'power2.inOut', // 부드러운 가속-감속 이징 함수

      /**
       * 높이 애니메이션 완료 시 콜백
       * pin-spacer 높이를 최종 조정
       */
      onComplete: () => {
        // 반응형 pin-spacer 높이 최종 적용
        applyFianlPinSpacerHeight();
      },
    });

    /**
     * pin-spacer 실시간 동기화 함수
     * 높이 애니메이션 진행 중 pin-spacer도 함께 변경되도록 처리
     * ScrollTrigger가 생성하는 pin-spacer와 실제 섹션 높이를 동기화
     */
    const synchronizePinSpacerHeightWhileScrolling = () => {
      // GSAP ScrollTrigger가 생성한 pin-spacer 요소 찾기
      const pinSpacerElement = document.querySelector('.pin-spacer');

      // 애니메이션이 아직 진행 중인 경우만 동기화 수행
      if (pinSpacerElement && heightReductionTween.progress() < 1) {
        // 현재 디바이스 섹션의 실제 높이값 측정
        const currentSectionHeight =
          domElementsConfig.deviceImageSection.getBoundingClientRect().height;

        // pin-spacer 높이를 섹션 높이와 동일하게 설정
        // !important 플래그로 CSS 우선순위 강제 적용
        pinSpacerElement.style.setProperty(
          'height',
          `${currentSectionHeight}px`,
          'important'
        );

        // min-height와 max-height 제약 해제
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
 * 스케일링 DOM 애니메이션을 초기화하는 핵심 함수
 * ScrollTrigger를 사용하여 디바이스 목업을 스크롤에 따라 축소시키는 애니메이션
 * 스크롤 진행률에 따라 텍스트 변경 시스템도 함께 동작
 */
export const scalingDomAnimation = () => {
  // 이전 스크롤 진행률을 추적하기 위한 변수
  // 스크롤 방향 감지에 사용됨
  let previousScrollProgress = 0;

  // GSAP ScrollTrigger를 사용한 스케일 애니메이션 설정
  gsap.to(domElementsConfig.scalableDeviceMockup, {
    scale: 0.6667, // 목업 요소를 66.67% 크기로 축소

    scrollTrigger: {
      // 애니메이션 트리거 요소 설정
      trigger: '.main-animation-section .device-image-section',

      // 해당 섹션을 화면에 고정 (sticky 효과)
      // 사용자가 스크롤하는 동안 요소가 화면에 고정되어 애니메이션 진행
      pin: '.main-animation-section .device-image-section',

      // 스크롤과 애니메이션을 1:1로 동기화
      // scrub: true이면 스크롤 속도에 따라 애니메이션 속도 결정
      scrub: 1,

      // 애니메이션 시작점: 트리거 요소의 상단이 뷰포트 상단에 도달할 때
      start: 'top top',

      // 애니메이션 종료점: 트리거 요소를 400vh만큼 더 스크롤한 후
      // 즉, 뷰포트 높이의 4배만큼 스크롤해야 애니메이션 완료
      end: '+=400vh',

      /**
       * 스크롤 진행에 따른 실시간 업데이트 콜백
       * 매 프레임마다 호출되어 진행률 변화를 감지
       *
       * @param {Object} scrollTriggerInstance - ScrollTrigger 인스턴스
       */
      onUpdate: (scrollTriggerInstance) => {
        // 현재 애니메이션 진행률 (0~1)
        const { progress } = scrollTriggerInstance;

        // 반응형 pin-spacer 높이 적용
        // 스크롤 중에도 지속적으로 높이 조정
        applyFianlPinSpacerHeight();

        // 텍스트 변경 시스템 업데이트
        // 현재 진행률과 이전 진행률을 비교하여 방향 감지
        updateScrollDirectionText(progress, previousScrollProgress).catch(
          (textError) => {
            // 텍스트 업데이트 실패 시 에러 로깅
            console.error('[ERROR] Text update failed in onUpdate:', textError);
          }
        );

        // 다음 프레임을 위해 현재 진행률 저장
        previousScrollProgress = progress;
      },

      /**
       * 스케일 애니메이션 완료 시 콜백
       * 높이 축소 애니메이션을 연계 실행
       */
      onComplete: () => {
        // 스케일 애니메이션 완료 후 높이 축소 애니메이션 시작
        adaptingReduceHeight();
      },
    },

    // 부드러운 감속 이징 적용
    // 애니메이션 시작은 빠르게, 끝으로 갈수록 천천히
    ease: 'power2.out',
  });
};
