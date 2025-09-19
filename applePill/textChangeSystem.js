// animation_applePill.html/scripts/textChangeSystem.js
// 스크롤 방향에 따라 동적으로 텍스트를 변경하는 시스템 + 기본 텍스트 기능 + Pill 상태 연동

import { domElementsConfig, animationStateTracker } from './config.js';

/**
 * 스크롤 방향별 텍스트 맵핑 객체
 * 정방향과 역방향 스크롤에 따라 표시될 텍스트를 정의
 */
export const scrollTextMapping = {
  forward: 'css의 scale 속성으로 크기가 줄어듭니다', // 정방향 스크롤 시 표시될 텍스트
  backward: '원래 크기의 속성으로 돌아갑니다', // 역방향 스크롤 시 표시될 텍스트
};

/**
 * 텍스트 변경 시스템의 상태를 추적하는 객체
 * 기본 텍스트와 동적 텍스트 간의 전환 상태 관리
 */
export const textChangeStateTracker = {
  currentDisplayedText: '', // 현재 표시되고 있는 동적 텍스트
  isTextVisible: false, // 동적 텍스트가 현재 보이는 상태인지 여부
  previousScrollDirection: null, // 이전 스크롤 방향 ('forward' 또는 'backward')
  textTransitionInProgress: false, // 텍스트 전환 애니메이션이 진행 중인지 여부

  // 기본 텍스트 관련 상태 추가
  isDefaultTextVisible: true, // 기본 텍스트가 현재 보이는 상태인지 여부 (초기값: true)
  currentTextMode: 'default', // 현재 텍스트 모드 ('default' | 'dynamic')
  defaultTextTransitionInProgress: false, // 기본 텍스트 전환이 진행 중인지 여부
};

/**
 * glow-dynamic-text 요소를 안전하게 가져오는 함수
 * DOM에서 동적 텍스트를 표시할 요소를 찾아서 반환
 *
 * @returns {HTMLElement|null} 동적 텍스트 요소 또는 null
 */
const getGlowTextElement = () => {
  const { scalableDeviceMockup } = domElementsConfig;
  return scalableDeviceMockup?.querySelector('#glowDynamicText') || null;
};

/**
 * glow-default-text 요소를 안전하게 가져오는 함수
 * DOM에서 기본 텍스트를 표시할 요소를 찾아서 반환
 *
 * @returns {HTMLElement|null} 기본 텍스트 요소 또는 null
 */
const getGlowDefaultTextElement = () => {
  const { scalableDeviceMockup } = domElementsConfig;
  return scalableDeviceMockup?.querySelector('#glowDefaultText') || null;
};

/**
 * Pill 애니메이션 상태를 확인하여 기본 텍스트 표시 여부를 결정하는 함수
 * Pill이 hidden 상태이거나 disappearing 상태일 때 기본 텍스트 표시
 *
 * @returns {boolean} 기본 텍스트를 표시해야 하는지 여부
 */
const shouldShowDefaultTextBasedOnPillState = () => {
  const { currentAnimationPhase } = animationStateTracker;

  // Pill이 숨겨져 있거나 사라지는 중이면 기본 텍스트 표시
  const pillIsHiddenOrDisappearing =
    currentAnimationPhase === 'hidden' ||
    currentAnimationPhase === 'disappearing';

  console.log(
    `[DEBUG] Pill state: ${currentAnimationPhase}, should show default: ${pillIsHiddenOrDisappearing}`
  );

  return pillIsHiddenOrDisappearing;
};

/**
 * 스크롤 진행률을 비교하여 스크롤 방향을 결정하는 함수
 *
 * @param {number} currentProgress - 현재 스크롤 진행률 (0~1)
 * @param {number} previousProgress - 이전 스크롤 진행률 (0~1)
 * @returns {string} 'forward' 또는 'backward'
 */
const determineScrollDirection = (currentProgress, previousProgress) => {
  // 진행률이 증가하면 정방향, 감소하면 역방향
  return currentProgress > previousProgress ? 'forward' : 'backward';
};

/**
 * 텍스트 업데이트가 필요한지 판단하는 함수
 * 방향이 바뀌었거나 텍스트 내용이 다른 경우에만 업데이트 수행
 *
 * @param {string} newDirection - 새로운 스크롤 방향
 * @param {string} newText - 새로 표시할 텍스트
 * @returns {boolean} 업데이트가 필요한지 여부
 */
const shouldUpdateText = (newDirection, newText) => {
  const { currentDisplayedText, previousScrollDirection } =
    textChangeStateTracker;

  // 방향이 변경되었거나 텍스트가 다른 경우 업데이트 필요
  return (
    newDirection !== previousScrollDirection || newText !== currentDisplayedText
  );
};

/**
 * 기본 텍스트 페이드아웃 애니메이션을 실행하는 함수
 * GSAP을 사용하여 기본 텍스트를 부드럽게 숨김
 *
 * @param {HTMLElement} defaultTextElement - 페이드아웃할 기본 텍스트 요소
 * @returns {Promise} 애니메이션 완료 시 resolve되는 Promise
 */
const executeDefaultTextFadeOut = (defaultTextElement) => {
  return new Promise((resolve) => {
    if (!defaultTextElement) {
      resolve();
      return;
    }

    gsap.to(defaultTextElement, {
      opacity: 0, // 투명도를 0으로
      duration: 0.25, // 0.25초 동안 (동적 텍스트보다 빠르게)
      ease: 'power2.out', // 부드러운 감속 이징
      onComplete: () => {
        // 애니메이션 완료 후 hidden 클래스 추가
        defaultTextElement.classList.add('hidden');
        resolve();
      },
    });
  });
};

/**
 * 기본 텍스트 페이드인 애니메이션을 실행하는 함수
 * GSAP을 사용하여 기본 텍스트를 부드럽게 표시
 *
 * @param {HTMLElement} defaultTextElement - 페이드인할 기본 텍스트 요소
 * @returns {Promise} 애니메이션 완료 시 resolve되는 Promise
 */
const executeDefaultTextFadeIn = (defaultTextElement) => {
  return new Promise((resolve) => {
    if (!defaultTextElement) {
      resolve();
      return;
    }

    // hidden 클래스 제거 및 페이드인 애니메이션
    defaultTextElement.classList.remove('hidden');

    gsap.to(defaultTextElement, {
      opacity: 1, // 투명도를 1로
      duration: 0.3, // 0.3초 동안
      ease: 'power2.out', // 부드러운 감속 이징
      onComplete: () => resolve(),
    });
  });
};

/**
 * 동적 텍스트 페이드아웃 애니메이션을 실행하는 함수
 * GSAP을 사용하여 동적 텍스트를 부드럽게 숨김
 *
 * @param {HTMLElement} targetElement - 페이드아웃할 요소
 * @returns {Promise} 애니메이션 완료 시 resolve되는 Promise
 */
const executeTextFadeOut = (targetElement) => {
  return new Promise((resolve) => {
    // 요소가 없으면 즉시 완료
    if (!targetElement) {
      resolve();
      return;
    }

    // GSAP을 사용한 페이드아웃 애니메이션
    gsap.to(targetElement, {
      opacity: 0, // 투명도를 0으로
      duration: 0.2, // 0.2초 동안
      ease: 'power2.out', // 부드러운 감속 이징
      onComplete: () => {
        // 애니메이션 완료 후 visible 클래스 제거
        targetElement.classList.remove('visible');
        resolve();
      },
    });
  });
};

/**
 * 동적 텍스트 페이드인 애니메이션을 실행하는 함수
 * 새로운 텍스트로 변경하고 부드럽게 나타나는 효과 구현
 *
 * @param {HTMLElement} targetElement - 페이드인할 요소
 * @param {string} newTextContent - 새로 표시할 텍스트 내용
 * @returns {Promise} 애니메이션 완료 시 resolve되는 Promise
 */
const executeTextFadeIn = (targetElement, newTextContent) => {
  return new Promise((resolve) => {
    // 요소가 없으면 즉시 완료
    if (!targetElement) {
      resolve();
      return;
    }

    // 텍스트 내용 변경 및 visible 클래스 추가
    targetElement.textContent = newTextContent;
    targetElement.classList.add('visible');

    // GSAP을 사용한 페이드인 애니메이션
    gsap.to(targetElement, {
      opacity: 1, // 투명도를 1로
      duration: 0.3, // 0.3초 동안 (페이드아웃보다 약간 길게)
      ease: 'power2.out', // 부드러운 감속 이징
      onComplete: () => resolve(),
    });
  });
};

/**
 * 텍스트 모드를 전환하는 함수
 * 기본 텍스트에서 동적 텍스트로, 또는 그 반대로 전환
 *
 * @param {string} targetMode - 전환할 모드 ('default' | 'dynamic')
 */
const switchTextMode = async (targetMode) => {
  // 이미 전환이 진행 중이면 중복 실행 방지
  if (textChangeStateTracker.defaultTextTransitionInProgress) {
    return;
  }

  // 현재 모드와 같으면 전환할 필요 없음
  if (textChangeStateTracker.currentTextMode === targetMode) {
    return;
  }

  const defaultTextElement = getGlowDefaultTextElement();
  const dynamicTextElement = getGlowTextElement();

  if (!defaultTextElement || !dynamicTextElement) {
    console.warn('[DEBUG] Text elements not found for mode switching');
    return;
  }

  // 전환 진행 플래그 설정
  textChangeStateTracker.defaultTextTransitionInProgress = true;

  try {
    if (targetMode === 'dynamic') {
      // 기본 텍스트 → 동적 텍스트 모드로 전환
      console.log('[DEBUG] Switching to dynamic text mode');

      // 기본 텍스트 숨김
      if (textChangeStateTracker.isDefaultTextVisible) {
        await executeDefaultTextFadeOut(defaultTextElement);
        textChangeStateTracker.isDefaultTextVisible = false;
      }

      textChangeStateTracker.currentTextMode = 'dynamic';
    } else if (targetMode === 'default') {
      // 동적 텍스트 → 기본 텍스트 모드로 전환
      console.log(
        '[DEBUG] Switching to default text mode (triggered by Pill state)'
      );

      // 동적 텍스트가 보이고 있으면 먼저 숨김
      if (textChangeStateTracker.isTextVisible) {
        await executeTextFadeOut(dynamicTextElement);
        textChangeStateTracker.isTextVisible = false;
      }

      // 기본 텍스트 표시
      if (!textChangeStateTracker.isDefaultTextVisible) {
        await executeDefaultTextFadeIn(defaultTextElement);
        textChangeStateTracker.isDefaultTextVisible = true;
      }

      textChangeStateTracker.currentTextMode = 'default';

      // 동적 텍스트 상태 초기화
      textChangeStateTracker.currentDisplayedText = '';
      textChangeStateTracker.previousScrollDirection = null;
    }
  } catch (switchError) {
    console.error('[ERROR] Text mode switching failed:', switchError);
  } finally {
    // 항상 전환 진행 플래그를 해제
    textChangeStateTracker.defaultTextTransitionInProgress = false;
  }
};

/**
 * 스크롤 방향에 따라 텍스트를 업데이트하는 메인 함수 (Pill 상태 연동)
 * 스크롤 진행률을 받아서 적절한 텍스트를 표시하거나 기본 텍스트로 복원
 *
 * @param {number} scrollProgressValue - 현재 스크롤 진행률 (0~1)
 * @param {number} previousProgressValue - 이전 스크롤 진행률 (기본값: 0)
 */
export const updateScrollDirectionText = async (
  scrollProgressValue,
  previousProgressValue = 0
) => {
  // DOM 요소들 가져오기
  const textDisplayElement = getGlowTextElement();
  const defaultTextElement = getGlowDefaultTextElement();

  if (!textDisplayElement || !defaultTextElement) {
    console.warn('[DEBUG] Required text elements not found');
    return;
  }

  // 텍스트 전환이 진행 중이면 중복 실행 방지
  if (textChangeStateTracker.textTransitionInProgress) {
    return;
  }

  // ===== 1순위: Pill 상태 기반 기본 텍스트 모드 전환 =====
  // Pill이 사라지거나 숨겨져 있으면 기본 텍스트 모드로 전환
  const shouldShowDefaultByPillState = shouldShowDefaultTextBasedOnPillState();

  if (shouldShowDefaultByPillState) {
    // Pill 상태에 따라 기본 텍스트 모드로 전환
    await switchTextMode('default');
    return;
  }

  // ===== 스크롤 진행률 기반 조건 제거 =====
  // 기존 scrollProgressValue < 0.05 조건을 제거하여
  // 오직 Pill 애니메이션 상태에만 의존하도록 변경

  // ===== 3순위: 동적 텍스트 모드로 전환 =====
  // 스크롤이 시작되었고 Pill이 활성 상태이면 동적 텍스트 모드로 전환
  if (textChangeStateTracker.currentTextMode === 'default') {
    await switchTextMode('dynamic');
  }

  // ===== 기존 동적 텍스트 로직 (수정 없음) =====

  // 스크롤 방향 결정
  const currentScrollDirection = determineScrollDirection(
    scrollProgressValue,
    previousProgressValue
  );
  // 해당 방향에 맞는 텍스트 가져오기
  const targetTextContent = scrollTextMapping[currentScrollDirection];

  // 업데이트가 불필요하면 종료
  if (!shouldUpdateText(currentScrollDirection, targetTextContent)) {
    return;
  }

  // 텍스트 전환 시작 플래그 설정
  textChangeStateTracker.textTransitionInProgress = true;

  try {
    // 동적 텍스트를 표시할 조건: 진행률이 10%~90% 사이
    // 너무 빠른 시점이나 늦은 시점에는 텍스트를 숨김
    const shouldShowDynamicText =
      scrollProgressValue > 0.1 && scrollProgressValue < 0.9;

    // 동적 텍스트를 숨겨야 하는 경우
    if (!shouldShowDynamicText) {
      if (textChangeStateTracker.isTextVisible) {
        await executeTextFadeOut(textDisplayElement);
        textChangeStateTracker.isTextVisible = false;
      }
      return;
    }

    // 기존 동적 텍스트가 보이고 있다면 먼저 페이드아웃
    if (textChangeStateTracker.isTextVisible) {
      await executeTextFadeOut(textDisplayElement);
    }

    // 새로운 동적 텍스트로 페이드인
    await executeTextFadeIn(textDisplayElement, targetTextContent);

    // 상태 업데이트
    textChangeStateTracker.currentDisplayedText = targetTextContent;
    textChangeStateTracker.previousScrollDirection = currentScrollDirection;
    textChangeStateTracker.isTextVisible = true;

    // 디버그 로그 출력
    console.log(
      `[DEBUG] Dynamic text updated: ${targetTextContent} (direction: ${currentScrollDirection})`
    );
  } catch (textUpdateError) {
    // 에러 처리
    console.error('[ERROR] Dynamic text update failed:', textUpdateError);
  } finally {
    // 항상 전환 진행 플래그를 해제
    textChangeStateTracker.textTransitionInProgress = false;
  }
};

/**
 * 외부에서 강제로 기본 텍스트 모드로 전환하는 함수
 * pillAnimations.js에서 Pill 상태 변경 시 즉시 호출됨
 *
 * @returns {Promise} 전환 완료 시 resolve되는 Promise
 */
export const forceDefaultTextMode = async () => {
  console.log('[DEBUG] Force default text mode requested by Pill animation');

  // 기본 텍스트 모드로 즉시 전환
  await switchTextMode('default');
};

/**
 * 스크롤 텍스트 시스템을 초기화하는 함수
 * DOM 요소 확인, 초기 상태 설정, 상태 추적기 초기화 수행
 *
 * @returns {boolean} 초기화 성공 여부
 */
export const initializeScrollTextSystem = () => {
  // 필수 DOM 요소들 확인
  const textDisplayElement = getGlowTextElement();
  const defaultTextElement = getGlowDefaultTextElement();

  if (!textDisplayElement || !defaultTextElement) {
    console.error(
      '[ERROR] Required text elements not found - text system initialization failed'
    );
    return false;
  }

  // 동적 텍스트 요소 초기 상태 설정 (숨김)
  gsap.set(textDisplayElement, {
    opacity: 0,
  });

  // 기본 텍스트 요소 초기 상태 설정 (표시)
  gsap.set(defaultTextElement, {
    opacity: 1,
  });
  defaultTextElement.classList.remove('hidden');

  // 상태 추적기 초기화
  textChangeStateTracker.currentDisplayedText = '';
  textChangeStateTracker.isTextVisible = false;
  textChangeStateTracker.previousScrollDirection = null;
  textChangeStateTracker.textTransitionInProgress = false;

  // 기본 텍스트 상태 초기화
  textChangeStateTracker.isDefaultTextVisible = true;
  textChangeStateTracker.currentTextMode = 'default';
  textChangeStateTracker.defaultTextTransitionInProgress = false;

  console.log(
    '[DEBUG] Scroll text system with Pill state integration initialized successfully'
  );
  return true;
};
