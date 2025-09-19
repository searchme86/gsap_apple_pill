// animation_applePill.html/scripts/textChangeSystem.js
// 스크롤 방향에 따라 동적으로 텍스트를 변경하는 시스템

import { domElementsConfig } from './config.js';

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
 * 중복 처리 방지와 상태 관리를 위해 사용
 */
export const textChangeStateTracker = {
  currentDisplayedText: '', // 현재 표시되고 있는 텍스트
  isTextVisible: false, // 텍스트가 현재 보이는 상태인지 여부
  previousScrollDirection: null, // 이전 스크롤 방향 ('forward' 또는 'backward')
  textTransitionInProgress: false, // 텍스트 전환 애니메이션이 진행 중인지 여부
};

/**
 * glow-dynamic-text 요소를 안전하게 가져오는 함수
 * DOM에서 텍스트를 표시할 요소를 찾아서 반환
 *
 * @returns {HTMLElement|null} 텍스트 요소 또는 null
 */
const getGlowTextElement = () => {
  const { scalableDeviceMockup } = domElementsConfig;
  // scalable-device-mockup 내부에서 텍스트 요소를 찾음
  return scalableDeviceMockup?.querySelector('#glowDynamicText') || null;
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
 * 텍스트 페이드아웃 애니메이션을 실행하는 함수
 * GSAP을 사용하여 부드러운 페이드아웃 효과 구현
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
 * 텍스트 페이드인 애니메이션을 실행하는 함수
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
 * 스크롤 방향에 따라 텍스트를 업데이트하는 메인 함수
 * 스크롤 진행률을 받아서 적절한 텍스트를 표시하거나 숨김
 *
 * @param {number} scrollProgressValue - 현재 스크롤 진행률 (0~1)
 * @param {number} previousProgressValue - 이전 스크롤 진행률 (기본값: 0)
 */
export const updateScrollDirectionText = async (
  scrollProgressValue,
  previousProgressValue = 0
) => {
  // 텍스트 표시 요소 가져오기
  const textDisplayElement = getGlowTextElement();
  if (!textDisplayElement) {
    console.warn('[DEBUG] glow-dynamic-text element not found');
    return;
  }

  // 이미 텍스트 전환이 진행 중이면 중복 실행 방지
  if (textChangeStateTracker.textTransitionInProgress) {
    return;
  }

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
    // 텍스트를 표시할 조건: 진행률이 10%~90% 사이
    // 너무 빠른 시점이나 늦은 시점에는 텍스트를 숨김
    const shouldShowText =
      scrollProgressValue > 0.1 && scrollProgressValue < 0.9;

    // 텍스트를 숨겨야 하는 경우
    if (!shouldShowText) {
      if (textChangeStateTracker.isTextVisible) {
        await executeTextFadeOut(textDisplayElement);
        textChangeStateTracker.isTextVisible = false;
      }
      return;
    }

    // 기존 텍스트가 보이고 있다면 먼저 페이드아웃
    if (textChangeStateTracker.isTextVisible) {
      await executeTextFadeOut(textDisplayElement);
    }

    // 새로운 텍스트로 페이드인
    await executeTextFadeIn(textDisplayElement, targetTextContent);

    // 상태 업데이트
    textChangeStateTracker.currentDisplayedText = targetTextContent;
    textChangeStateTracker.previousScrollDirection = currentScrollDirection;
    textChangeStateTracker.isTextVisible = true;

    // 디버그 로그 출력
    console.log(
      `[DEBUG] Text updated: ${targetTextContent} (direction: ${currentScrollDirection})`
    );
  } catch (textUpdateError) {
    // 에러 처리
    console.error('[ERROR] Text update failed:', textUpdateError);
  } finally {
    // 항상 전환 진행 플래그를 해제
    textChangeStateTracker.textTransitionInProgress = false;
  }
};

/**
 * 스크롤 텍스트 시스템을 초기화하는 함수
 * DOM 요소 확인, 초기 상태 설정, 상태 추적기 초기화 수행
 *
 * @returns {boolean} 초기화 성공 여부
 */
export const initializeScrollTextSystem = () => {
  // 필수 DOM 요소 확인
  const textDisplayElement = getGlowTextElement();

  if (!textDisplayElement) {
    console.error(
      '[ERROR] Required text element not found - text system initialization failed'
    );
    return false;
  }

  // 텍스트 요소 초기 상태 설정 (숨김)
  gsap.set(textDisplayElement, {
    opacity: 0,
  });

  // 상태 추적기 초기화
  textChangeStateTracker.currentDisplayedText = '';
  textChangeStateTracker.isTextVisible = false;
  textChangeStateTracker.previousScrollDirection = null;
  textChangeStateTracker.textTransitionInProgress = false;

  console.log('[DEBUG] Scroll text system initialized successfully');
  return true;
};
