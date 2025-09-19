// animation_applePill.html/scripts/main.js
// 전체 애니메이션 시스템의 초기화 및 통합 관리를 담당하는 메인 모듈

// 각 기능 모듈들을 ES6 모듈 시스템으로 임포트
import {
  initializeResponsiveResizeHandler, // 반응형 리사이즈 이벤트 핸들러
  applyFianlPinSpacerHeight, // pin-spacer 높이 적용 함수
} from './responsiveManager.js';

import { scalingDomAnimation } from './gsapAnimations.js'; // 스케일 애니메이션 함수
import { initializePillAnimationController } from './pillAnimations.js'; // Pill 애니메이션 컨트롤러
import { initializeTransformRemovalSystem } from './transformSystem.js'; // Transform 제거 시스템
import { initializeScrollTextSystem } from './textChangeSystem.js'; // 스크롤 텍스트 변경 시스템

/**
 * GSAP 라이브러리 초기화 및 플러그인 등록 함수
 * 전역에서 GSAP와 ScrollTrigger의 사용 가능 여부를 확인하고 초기화
 *
 * @returns {boolean} 초기화 성공 여부
 */
const initializeGsapLibrary = () => {
  // GSAP와 ScrollTrigger가 전역 스코프에서 사용 가능한지 확인
  // HTML에서 CDN으로 로드된 라이브러리들이 정상적으로 로드되었는지 검증
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // ScrollTrigger 플러그인을 GSAP에 등록
    // 이 과정을 거쳐야 gsap.to()에서 scrollTrigger 옵션을 사용할 수 있음
    gsap.registerPlugin(ScrollTrigger);

    console.log('[DEBUG] GSAP and ScrollTrigger initialized successfully');
    return true;
  } else {
    // 라이브러리가 로드되지 않은 경우 에러 로깅
    console.error(
      '[ERROR] GSAP 또는 ScrollTrigger 라이브러리가 로드되지 않았습니다.'
    );
    return false;
  }
};

/**
 * 전체 애니메이션 시스템을 초기화하는 핵심 함수
 * 모든 서브시스템들을 올바른 순서로 초기화하여 전체 시스템 구동
 * 의존성 관계를 고려한 순차적 초기화 수행
 */
const performSystemInitialization = () => {
  // 1단계: GSAP 라이브러리 초기화 (필수 선행 작업)
  const isGsapReady = initializeGsapLibrary();
  if (!isGsapReady) {
    console.error('[ERROR] GSAP 초기화 실패 - 시스템 초기화 중단');
    return; // GSAP 없이는 애니메이션 시스템 동작 불가
  }

  try {
    // 2단계: 반응형 관리 시스템 초기화 (가장 먼저 설정)
    // 브라우저 리사이즈 이벤트 핸들러를 등록하여 뷰포트 변경에 대응
    initializeResponsiveResizeHandler();

    // 초기 pin-spacer 높이 설정
    // ScrollTrigger 생성 전에 기본 높이값을 설정하여 레이아웃 안정화
    applyFianlPinSpacerHeight();

    // 3단계: 스크롤 텍스트 시스템 초기화
    // DOM 요소 존재 확인 및 초기 상태 설정
    const isScrollTextSystemReady = initializeScrollTextSystem();
    if (!isScrollTextSystemReady) {
      // 텍스트 시스템 초기화 실패 시에도 전체 시스템은 계속 동작
      console.warn(
        '[WARN] Scroll text system initialization failed - continuing without text features'
      );
    }

    // 4단계: GSAP 기반 순차 애니메이션 초기화 (스케일 → 높이)
    // 스케일 애니메이션과 텍스트 변경이 연동되어 동작
    scalingDomAnimation();

    // 5단계: Pill 애니메이션 컨트롤러 초기화 (메인 인터랙션)
    // 스크롤에 따라 나타나고 사라지는 Pill 애니메이션 설정
    initializePillAnimationController();

    // 6단계: Transform 제거 시스템 초기화 (자연스러운 전환을 위해)
    // GSAP transform에서 CSS sticky로의 부드러운 전환 처리
    initializeTransformRemovalSystem();

    console.log('[DEBUG] All animation systems initialized successfully');
  } catch (systemError) {
    // 초기화 과정에서 발생한 예상치 못한 오류 처리
    console.error('[ERROR] 시스템 초기화 중 오류 발생:', systemError);

    // 오류가 발생해도 페이지가 완전히 멈추지 않도록 처리
    // 사용자에게는 기본적인 콘텐츠라도 보여주는 것이 중요
  }
};

/**
 * DOM 준비 상태를 확인하고 적절한 시점에 시스템 초기화를 실행하는 함수
 * DOMContentLoaded 이벤트를 활용하여 안전한 초기화 타이밍 보장
 */
const initializeCompleteAnimationSystem = () => {
  // 현재 문서의 로딩 상태 확인
  // readyState: 'loading' | 'interactive' | 'complete'
  const isDocumentReady = document.readyState !== 'loading';

  if (isDocumentReady) {
    // DOM이 이미 준비된 상태라면 즉시 초기화 실행
    // 이는 스크립트가 늦게 로드되었을 때의 상황에 대비
    console.log('[DEBUG] Document already ready, initializing immediately');
    performSystemInitialization();
  } else {
    // DOM이 아직 로딩 중이라면 DOMContentLoaded 이벤트 대기
    // HTML 파싱이 완료되고 모든 DOM 요소에 접근 가능해지면 초기화
    console.log('[DEBUG] Waiting for DOMContentLoaded event');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[DEBUG] DOMContentLoaded fired, starting initialization');
      performSystemInitialization();
    });
  }
};

/**
 * 전역 오류 처리기 등록
 * 예상치 못한 JavaScript 오류를 캐치하여 디버깅에 도움이 되는 정보 제공
 * 프로덕션 환경에서는 오류 로깅 서비스로 전송하는 것도 고려
 */
window.addEventListener('error', (errorEvent) => {
  console.error('[ERROR] 전역 오류 발생:', {
    message: errorEvent.message, // 오류 메시지
    filename: errorEvent.filename, // 오류가 발생한 파일
    lineno: errorEvent.lineno, // 오류가 발생한 라인 번호
    colno: errorEvent.colno, // 오류가 발생한 컬럼 번호
    error: errorEvent.error, // 실제 Error 객체
  });
});

/**
 * IIFE (Immediately Invoked Function Expression) 패턴을 사용한 시스템 시작
 * 전역 네임스페이스 오염을 방지하고 즉시 실행
 * strict mode를 사용하여 더 안전한 JavaScript 코드 실행
 */
(() => {
  'use strict'; // 엄격 모드 활성화 - 잠재적 오류를 미리 방지

  console.log('[DEBUG] Main script starting...');

  // 전체 애니메이션 시스템 초기화 시작
  initializeCompleteAnimationSystem();

  console.log('[DEBUG] Main script setup complete');
})();
