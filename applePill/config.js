// animation_applePill.html/scripts/config.js
// DOM 요소 및 애니메이션 설정값 관리 + 기본 텍스트 시스템 통합

/**
 * DOM 요소들을 중앙에서 관리하는 설정 객체
 * 각 요소는 getElementById로 가져와서 전역적으로 사용
 */
export const domElementsConfig = {
  // 메인 Pill 애니메이션 래퍼 - 실제 애니메이션이 적용되는 요소
  animatedPillWrapper: document.getElementById('animatedPillWrapper'),

  // Pill 내부에 표시되는 텍스트 요소
  pillDisplayText: document.getElementById('pillDisplayText'),

  // 스케일 애니메이션이 적용되는 디바이스 목업 요소
  // 스케일이 적용되는 div
  scalableDeviceMockup: document.getElementById('scalableDeviceMockup'),

  // 높이 애니메이션이 적용되는 디바이스 이미지 섹션
  // PinSpacer에 대한 높이 조절
  deviceImageSection: document.getElementById('deviceImageSection'),

  // 텍스트 표시 섹션 - 스크롤에 따라 나타나는 구간
  displayTextSection: document.getElementById('displayTextSection'),

  // ===== 텍스트 시스템 관련 요소들 =====

  // 기본 텍스트 요소 - DOM 로드 시 처음에 표시되는 정적 텍스트
  // "scale 애니메이션 영역입니다"와 같은 기본 안내 텍스트
  glowDefaultText: document.getElementById('glowDefaultText'),

  // 동적 텍스트 요소 - 스크롤 방향에 따라 변경되는 텍스트
  // 정방향/역방향 스크롤에 따른 동적 메시지 표시
  glowDynamicText: document.getElementById('glowDynamicText'),
};

/**
 * Pill 애니메이션의 모든 설정값을 관리하는 구성 객체
 * 애니메이션 지속시간, 위치, 이징 함수 등을 중앙 관리
 */
export const pillAnimationConfiguration = {
  // Pill 초기 Y 위치 (화면 아래 800px 지점에서 시작)
  pillInitialYPosition: 800,

  // Pill 최종 Y 위치 (화면 위쪽 -120px 지점까지 올라감)
  pillFinalYPosition: -120,

  // Pill 사라질 때 Y 위치 (다시 화면 아래 800px로 내려감)
  pillDisappearYPosition: 800,

  // Pill 상승 애니메이션 지속시간 (0.9초)
  pillRiseAnimationDuration: 0.9,

  // Pill 확장 애니메이션 지속시간 (1.1초)
  pillExpandAnimationDuration: 1.1,

  // Pill 사라짐 애니메이션 지속시간 (0.8초)
  pillDisappearAnimationDuration: 0.8,

  // Pill 상승 시 사용할 이징 함수 (부드러운 감속)
  pillRiseEasingFunction: 'power2.out',

  // Pill 확장 시 사용할 이징 함수 (부드러운 감속)
  pillExpandEasingFunction: 'power2.out',

  // Pill 사라짐 시 사용할 이징 함수 (부드러운 가속)
  pillDisappearEasingFunction: 'power2.in',
};

/**
 * 애니메이션 상태를 추적하는 객체
 * 현재 애니메이션 진행 상황과 방향을 관리
 */
export const animationStateTracker = {
  // 현재 애니메이션이 진행 중인지 여부 (중복 실행 방지용)
  isCurrentlyAnimating: false,

  // 역방향 애니메이션인지 여부 (사라짐 애니메이션 체크용)
  isReverseDirection: false,

  // 현재 애니메이션 단계 ('hidden', 'rising', 'expanding', 'expanded', 'disappearing')
  currentAnimationPhase: 'hidden',

  // Transform 속성이 제거되었는지 여부 (CSS transition 활성화용)
  isTransformPropertyRemoved: false,
};

/**
 * 텍스트 시스템 관련 상수 정의
 * 기본 텍스트와 동적 텍스트 시스템에서 사용하는 설정값들
 */
export const textSystemConfiguration = {
  // 기본 텍스트에서 동적 텍스트로 전환하는 스크롤 진행률 임계값
  // 0.05 = 5% 진행 시점에서 전환
  modeTransitionThreshold: 0.05,

  // 동적 텍스트 표시 구간 설정
  dynamicTextStartThreshold: 0.1, // 10% 진행률부터 동적 텍스트 표시
  dynamicTextEndThreshold: 0.9, // 90% 진행률까지 동적 텍스트 표시

  // 애니메이션 지속시간 설정
  defaultTextFadeOutDuration: 0.25, // 기본 텍스트 페이드아웃 시간 (초)
  defaultTextFadeInDuration: 0.3, // 기본 텍스트 페이드인 시간 (초)
  dynamicTextFadeOutDuration: 0.2, // 동적 텍스트 페이드아웃 시간 (초)
  dynamicTextFadeInDuration: 0.3, // 동적 텍스트 페이드인 시간 (초)

  // 이징 함수 설정
  textTransitionEasing: 'power2.out', // 모든 텍스트 전환에 사용할 이징
};
