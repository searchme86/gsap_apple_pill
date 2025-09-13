// animation_applePill.html/scripts/config.js - DOM 요소 및 애니메이션 설정값 관리

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
