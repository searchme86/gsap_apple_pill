// animation_applePill.html/scripts/main.js - 전체 시스템 초기화 및 통합 관리

import {
  initializeResponsiveResizeHandler,
  applyFianlPinSpacerHeight,
} from './responsiveManager.js';
import { scalingDomAnimation } from './gsapAnimations.js';
import { initializePillAnimationController } from './pillAnimations.js';
import { initializeTransformRemovalSystem } from './transformSystem.js';

/**
 * GSAP 라이브러리 초기화 및 플러그인 등록
 * ScrollTrigger 플러그인을 GSAP에 등록하고 준비 상태 확인
 */
const initializeGsapLibrary = () => {
  // GSAP와 ScrollTrigger가 전역에서 사용 가능한지 확인
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // ScrollTrigger 플러그인을 GSAP에 등록
    gsap.registerPlugin(ScrollTrigger);
    return true;
  } else {
    // 라이브러리가 로드되지 않은 경우 오류 로깅
    console.error(
      '[ERROR] GSAP 또는 ScrollTrigger 라이브러리가 로드되지 않았습니다.'
    );
    return false;
  }
};

/**
 * 전체 애니메이션 시스템을 초기화하는 핵심 함수
 * 모든 모듈들을 올바른 순서로 초기화하여 전체 시스템 구동
 */
const performSystemInitialization = () => {
  // 1. GSAP 라이브러리 초기화 (필수 선행 작업)
  const isGsapReady = initializeGsapLibrary();
  if (!isGsapReady) {
    console.error('[ERROR] GSAP 초기화 실패 - 시스템 초기화 중단');
    return;
  }

  try {
    // 2. 반응형 관리 시스템 초기화 (가장 먼저 설정)
    initializeResponsiveResizeHandler(); // resize 이벤트 핸들러 등록
    applyFianlPinSpacerHeight(); // 초기 pin-spacer 높이 설정

    // 3. GSAP 기반 순차 애니메이션 초기화 (스케일 → 높이)
    scalingDomAnimation();

    // 4. Pill 애니메이션 컨트롤러 초기화 (메인 인터랙션)
    initializePillAnimationController();

    // 5. Transform 제거 시스템 초기화 (자연스러운 전환을 위해)
    initializeTransformRemovalSystem();
  } catch (error) {
    // 초기화 과정에서 발생한 오류 처리
    console.error('[ERROR] 시스템 초기화 중 오류 발생:', error);
  }
};

/**
 * 최종 애니메이션 시스템 초기화 함수
 * DOM 준비 상태를 확인하고 적절한 시점에 시스템 초기화 실행
 */
const initializeCompleteAnimationSystem = () => {
  // DOM 준비 상태 확인
  const isDocumentReady = document.readyState !== 'loading';

  if (isDocumentReady) {
    // DOM이 이미 준비된 상태라면 즉시 초기화 실행
    performSystemInitialization();
  } else {
    // DOM이 아직 로딩 중이라면 DOMContentLoaded 이벤트 대기
    document.addEventListener('DOMContentLoaded', () => {
      performSystemInitialization();
    });
  }
};

// 전역 오류 처리기 등록 (선택적)
window.addEventListener('error', (event) => {
  console.error('[ERROR] 전역 오류 발생:', event.error);
});

// IIFE (즉시 실행 함수)로 시스템 시작
// 기존 코드와 동일한 패턴 유지
(() => {
  'use strict';

  // 시스템 초기화 실행
  initializeCompleteAnimationSystem();
})();
