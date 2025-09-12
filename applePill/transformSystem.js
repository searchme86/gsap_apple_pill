// animation_applePill.html/scripts/transformSystem.js - Transform 속성 제거 시스템

import {
  domElementsConfig,
  animationStateTracker,
  debugLog,
} from './config.js';

/**
 * Transform 제거 시스템을 초기화하는 함수
 * 특정 스크롤 지점에서 GSAP transform을 제거하고 CSS bottom 속성으로 전환
 * 이를 통해 자연스러운 sticky 효과를 구현
 */
export const initializeTransformRemovalSystem = () => {
  // ScrollTrigger를 사용한 부드러운 transform 제거 시스템
  ScrollTrigger.create({
    // 트리거 요소: 스케일 가능한 디바이스 목업
    trigger: '.scalable-device-mockup',

    // 시작점: 목업의 65% 지점이 뷰포트 상단에 도달할 때
    start: '65% top',

    // 종료점: 목업의 90% 지점이 뷰포트 상단에 도달할 때
    end: '90% top',

    // 스크롤과 애니메이션을 2배속으로 동기화 (부드러운 전환을 위해)
    scrub: 2,

    /**
     * 스크롤 진행에 따른 업데이트 콜백
     * transform을 점진적으로 제거하면서 자연스러운 전환 효과 구현
     *
     * @param {object} scrollTriggerSelf - ScrollTrigger 인스턴스
     */
    onUpdate: (scrollTriggerSelf) => {
      // 애니메이션 진행률 (0~1)
      const progressValue = scrollTriggerSelf.progress;

      // 사인 함수를 사용한 이징 적용 (부드러운 곡선 전환)
      const easedProgressValue = Math.sin((progressValue * Math.PI) / 2);

      // Y 위치 계산: -120px에서 0px로 점진적 변화
      // 진행률 0일 때: -120px (GSAP transform 위치)
      // 진행률 1일 때: 0px (CSS bottom 속성 활성화 준비)
      const currentYPosition = -120 + 120 * easedProgressValue;

      // transform 속성을 직접 설정하여 부드러운 전환
      domElementsConfig.animatedPillWrapper.style.transform = `translateY(${currentYPosition}px)`;

      // 투명도도 함께 조정 (0.95에서 1.0으로)
      const currentOpacity = 0.95 + 0.05 * easedProgressValue;
      domElementsConfig.animatedPillWrapper.style.opacity = currentOpacity;

      debugLog(
        `부드러운 동기화: ${currentYPosition.toFixed(1)}px (${(
          progressValue * 100
        ).toFixed(1)}%)`
      );

      // 애니메이션이 거의 완료되었는지 확인 (99% 이상)
      const isTransformCompleted = progressValue >= 0.99;

      if (isTransformCompleted) {
        // transform과 opacity 속성을 완전히 제거
        // 이제 CSS의 bottom 속성이 Pill 위치를 제어하게 됨
        domElementsConfig.animatedPillWrapper.style.transform = '';
        domElementsConfig.animatedPillWrapper.style.opacity = '';

        // 상태 추적기 업데이트
        animationStateTracker.isTransformPropertyRemoved = true;

        debugLog('Transform 완전 제거 - CSS bottom 활성화');
      }
    },

    /**
     * 역방향 스크롤 시 콜백
     * Transform 제거 지점을 역방향으로 통과할 때 호출
     */
    onLeaveBack: () => {
      debugLog('Transform 제거 지점 역방향 통과');

      // transform 제거 상태를 false로 리셋
      // 다시 GSAP transform이 Pill 위치를 제어하게 됨
      animationStateTracker.isTransformPropertyRemoved = false;
    },
  });

  debugLog('Transform 제거 시스템 초기화 완료');
};
