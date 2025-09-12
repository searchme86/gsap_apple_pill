// animation_applePill.html/scripts/pillAnimations.js - Pill 애니메이션 타임라인 및 컨트롤러

import {
  domElementsConfig,
  pillAnimationConfiguration,
  animationStateTracker,
  debugLog,
} from './config.js';

/**
 * Pill 상승 애니메이션 타임라인을 생성하는 함수
 * 화면 아래에서 위로 올라오면서 크기가 확장되는 애니메이션
 *
 * @returns {gsap.timeline} GSAP 타임라인 객체
 */
export const createPillRiseAnimationTimeline = () => {
  // debugLog('Pill 상승 Timeline 생성');

  // GSAP 타임라인 생성 (일시정지 상태로 시작)
  const pillRiseTimeline = gsap.timeline({
    // 일단 정지된 상태로 타임라인을 생성함
    paused: true,

    /**
     * 애니메이션 시작 시 콜백
     */
    onStart: () => {
      debugLog('Pill 상승 애니메이션 시작');

      // 애니메이션 상태 업데이트
      animationStateTracker.isCurrentlyAnimating = true;
      animationStateTracker.isReverseDirection = false;
      animationStateTracker.currentAnimationPhase = 'rising';

      // Pill 요소를 화면에 표시
      domElementsConfig.animatedPillWrapper.style.display = 'flex';
    },

    /**
     * 애니메이션 완료 시 콜백
     */
    onComplete: () => {
      debugLog('Pill 상승 완료 - 인터랙티브 모드');

      // 애니메이션 상태 업데이트
      animationStateTracker.isCurrentlyAnimating = false;
      animationStateTracker.currentAnimationPhase = 'expanded';
    },
  });

  // 1단계: translateY를 사용한 상승 애니메이션
  pillRiseTimeline.fromTo(
    domElementsConfig.animatedPillWrapper,
    {
      // 시작 상태: 화면 아래 800px 위치
      y: pillAnimationConfiguration.pillInitialYPosition, // 800px
      opacity: 0.9,
    },
    {
      // 끝 상태: 화면 위쪽 -120px 위치
      y: pillAnimationConfiguration.pillFinalYPosition, // -120px
      opacity: 1.0,
      duration: pillAnimationConfiguration.pillRiseAnimationDuration, // 0.9초
      ease: pillAnimationConfiguration.pillRiseEasingFunction, // 'power2.out'

      /**
       * translateY 애니메이션 완료 시 콜백
       */
      onComplete: () => {
        animationStateTracker.currentAnimationPhase = 'expanding';
        // setTimeout(() => displayInteractionHint(1.4, 0.3), 100);
      },
    },
    0 // 타임라인 시작 지점
  );

  // 2단계: CSS 변수를 통한 폭 확장 애니메이션
  pillRiseTimeline.to(
    domElementsConfig.animatedPillWrapper,
    {
      duration: pillAnimationConfiguration.pillExpandAnimationDuration, // 1.1초
      ease: pillAnimationConfiguration.pillExpandEasingFunction, // 'power2.out'

      /**
       * 폭 확장 시작 시 콜백
       */
      onStart: () => {
        // 'expanded' 클래스 추가로 CSS 변수 활성화
        //<div class="animated-pill-wrapper expanded" id="animatedPillWrapper">
        //.animated-pill-wrapper.expanded {
        // --pill-width: 180px;        /* 기본 40px → 180px */
        //--pill-text-opacity: 1;     /* 기본 0 → 1 */
        //--pill-text-x: 0px;         /* 기본 -12px → 0px */

        domElementsConfig.animatedPillWrapper.classList.add('expanded');
        // setTimeout(() => displayInteractionHint(1.6, 0.35), 200);
      },
    },
    pillAnimationConfiguration.pillRiseAnimationDuration // 0.9초 후 시작
  );

  return pillRiseTimeline;
};

/**
 * Pill 사라짐 애니메이션 타임라인을 생성하는 함수
 * 폭이 축소되면서 화면 아래로 사라지는 애니메이션
 *
 * @returns {gsap.timeline} GSAP 타임라인 객체
 */
export const createPillDisappearAnimationTimeline = () => {
  // GSAP 타임라인 생성 (일시정지 상태로 시작)
  const pillDisappearTimeline = gsap.timeline({
    paused: true,

    /**
     * 사라짐 애니메이션 시작 시 콜백
     */
    onStart: () => {
      // 애니메이션 상태 업데이트
      animationStateTracker.isCurrentlyAnimating = true;
      animationStateTracker.isReverseDirection = true;
      animationStateTracker.currentAnimationPhase = 'disappearing';
    },

    /**
     * 사라짐 애니메이션 완료 시 콜백
     */
    onComplete: () => {
      debugLog('Pill 사라짐 완료');

      // 애니메이션 상태 초기화
      animationStateTracker.isCurrentlyAnimating = false;
      animationStateTracker.isReverseDirection = false;
      animationStateTracker.currentAnimationPhase = 'hidden';

      // Pill 요소 숨김 및 클래스 정리
      domElementsConfig.animatedPillWrapper.style.display = 'none';
      domElementsConfig.animatedPillWrapper.classList.remove('expanded');
    },
  });

  // 1단계: 폭 축소 애니메이션
  pillDisappearTimeline.to(
    domElementsConfig.animatedPillWrapper,
    {
      duration: 0.4, // 0.4초 동안
      ease: pillAnimationConfiguration.pillDisappearEasingFunction, // 'power2.in'

      /**
       * 폭 축소 시작 시 콜백
       */
      onStart: () => {
        // 'expanded' 클래스 제거로 CSS 변수 비활성화
        domElementsConfig.animatedPillWrapper.classList.remove('expanded');
      },
    },
    0 // 타임라인 시작 지점
  );

  // 2단계: translateY를 사용한 하강 애니메이션
  pillDisappearTimeline.to(
    domElementsConfig.animatedPillWrapper,
    {
      // 화면 아래 800px로 이동
      y: pillAnimationConfiguration.pillDisappearYPosition, // 800px (아래로)
      opacity: 0.7,
      duration: pillAnimationConfiguration.pillDisappearAnimationDuration, // 0.8초
      ease: pillAnimationConfiguration.pillDisappearEasingFunction, // 'power2.in'
    },
    0.2 // 0.2초 후 시작 (폭 축소와 약간 겹침)
  );

  return pillDisappearTimeline;
};

/**
 * Pill 애니메이션 전체 컨트롤러를 초기화하는 함수
 * ScrollTrigger를 사용하여 스크롤 위치에 따라 애니메이션 실행
 * 원본 타이밍과 동일하게 메인 섹션 진입 시 즉시 실행
 */
export const initializePillAnimationController = () => {
  // 초기 상태: 화면 아래 숨김
  gsap.set(domElementsConfig.animatedPillWrapper, {
    y: pillAnimationConfiguration.pillInitialYPosition, // 800px
    display: 'none',
  });

  // 애니메이션 타임라인들 생성
  const pillRiseTimeline = createPillRiseAnimationTimeline();
  const pillDisappearTimeline = createPillDisappearAnimationTimeline();

  // ScrollTrigger 설정 - 원본과 동일한 트리거 사용
  ScrollTrigger.create({
    trigger: '.main-animation-section', // 원본과 동일한 트리거
    start: 'top top', // 원본과 동일한 시작점
    end: 'bottom top', // 섹션 하단이 뷰포트 상단에 도달할 때까지
    markers: false, // 디버그 마커 비활성화
    id: 'original-pill-controller', // 식별용 ID

    /**
     * 메인 애니메이션 섹션 진입 시 콜백
     */
    onEnter: () => {
      // 기존 애니메이션이 진행 중이면 중단
      if (animationStateTracker.isCurrentlyAnimating) {
        pillDisappearTimeline.kill();
      }

      // Pill 초기 상태 설정
      gsap.set(domElementsConfig.animatedPillWrapper, {
        y: pillAnimationConfiguration.pillInitialYPosition, // 800px
        opacity: 0.9,
        display: 'flex',
      });

      // 클래스 정리
      domElementsConfig.animatedPillWrapper.classList.remove('expanded');
      animationStateTracker.isTransformPropertyRemoved = false;

      // 원본처럼 즉시 실행
      pillRiseTimeline.restart();
      debugLog('✅ 원본과 동일 - 메인 섹션 진입하자마자 Pill 상승!');
    },

    /**
     * 메인 애니메이션 섹션 이탈 시 콜백 (역방향 스크롤)
     */
    onLeaveBack: () => {
      // 상승 애니메이션 중단하고 사라짐으로 전환
      if (
        animationStateTracker.isCurrentlyAnimating &&
        !animationStateTracker.isReverseDirection
      ) {
        debugLog('상승 중단 → 사라짐 전환');
        pillRiseTimeline.kill();
      }

      // 현재 Y 위치 확인
      const currentYPosition = gsap.getProperty(
        domElementsConfig.animatedPillWrapper,
        'y'
      );

      // Y 위치가 -100px 이상 올라와 있으면 사라짐 애니메이션 실행
      const shouldPlayDisappearAnimation = currentYPosition <= -100;
      if (shouldPlayDisappearAnimation) {
        pillDisappearTimeline.restart();
      } else {
        // 아직 충분히 올라오지 않았으면 즉시 숨김
        gsap.set(domElementsConfig.animatedPillWrapper, {
          y: pillAnimationConfiguration.pillInitialYPosition,
          display: 'none',
        });
        domElementsConfig.animatedPillWrapper.classList.remove('expanded');
        animationStateTracker.currentAnimationPhase = 'hidden';
        animationStateTracker.isCurrentlyAnimating = false;
      }
    },
  });
};
