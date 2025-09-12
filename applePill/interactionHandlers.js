// // animation_applePill.html/scripts/interactionHandlers.js - 사용자 인터랙션 처리

// import { domElementsConfig, debugLog } from './config.js';
// import { displayInteractionHint } from './pillAnimations.js';

// /**
//  * CSS 커스텀 속성을 업데이트하는 유틸리티 함수
//  * @param {HTMLElement} targetElement - 속성을 설정할 대상 요소
//  * @param {string} cssPropertyName - CSS 변수명 (예: '--pill-hint-scale')
//  * @param {string} propertyValue - 설정할 값
//  */
// const updateCssCustomProperty = (
//   targetElement,
//   cssPropertyName,
//   propertyValue
// ) => {
//   targetElement.style.setProperty(cssPropertyName, propertyValue);
// };

// /**
//  * 사용자 인터랙션 힌트 시스템을 초기화하는 함수
//  * 마우스 호버, 클릭 등의 이벤트에 따른 시각적 피드백 제공
//  */
// export const initializeUserInteractionHints = () => {
//   debugLog('인터랙션 힌트 시스템 초기화 시작');

//   // Pill 내부의 인터랙티브 버튼 요소 찾기
//   const interactiveButton = domElementsConfig.animatedPillWrapper.querySelector(
//     '.pill-interactive-button'
//   );

//   /**
//    * 버튼 클릭 이벤트 핸들러
//    * 클릭 시 강력한 힌트 애니메이션 표시
//    */
//   const handleButtonClick = () => {
//     debugLog('버튼 클릭 힌트');

//     // 클릭 시 가장 강한 힌트 효과 (스케일 2.0, 투명도 0.5)
//     displayInteractionHint(2.0, 0.5);
//   };

//   /**
//    * 마우스 진입 이벤트 핸들러 (hover 시작)
//    * Pill에 마우스가 올라갔을 때 부드러운 글로우 효과 표시
//    */
//   const handleMouseEnter = () => {
//     debugLog('마우스 진입 - 호버 글로우 효과 시작');

//     // 호버 시 부드러운 글로우 효과
//     // 작은 스케일(1.1)과 낮은 투명도(0.15)로 은은한 효과
//     updateCssCustomProperty(
//       domElementsConfig.animatedPillWrapper,
//       '--pill-hint-scale',
//       '1.1'
//     );
//     updateCssCustomProperty(
//       domElementsConfig.animatedPillWrapper,
//       '--pill-hint-opacity',
//       '0.15'
//     );
//   };

//   /**
//    * 마우스 이탈 이벤트 핸들러 (hover 종료)
//    * Pill에서 마우스가 벗어났을 때 글로우 효과 제거
//    */
//   const handleMouseLeave = () => {
//     debugLog('마우스 이탈 - 호버 글로우 효과 종료');

//     // 모든 글로우 효과 제거
//     updateCssCustomProperty(
//       domElementsConfig.animatedPillWrapper,
//       '--pill-hint-scale',
//       '0'
//     );
//     updateCssCustomProperty(
//       domElementsConfig.animatedPillWrapper,
//       '--pill-hint-opacity',
//       '0'
//     );
//   };

//   // 이벤트 리스너 등록
//   if (interactiveButton) {
//     // 버튼 클릭 이벤트
//     interactiveButton.addEventListener('click', handleButtonClick);
//     debugLog('버튼 클릭 이벤트 리스너 등록');
//   } else {
//     debugLog('인터랙티브 버튼을 찾을 수 없음');
//   }

//   // Pill 래퍼 마우스 이벤트들
//   if (domElementsConfig.animatedPillWrapper) {
//     // 마우스 진입 이벤트 (호버 시작)
//     domElementsConfig.animatedPillWrapper.addEventListener(
//       'mouseenter',
//       handleMouseEnter
//     );

//     // 마우스 이탈 이벤트 (호버 종료)
//     domElementsConfig.animatedPillWrapper.addEventListener(
//       'mouseleave',
//       handleMouseLeave
//     );

//     debugLog('Pill 마우스 이벤트 리스너 등록 (enter/leave)');
//   } else {
//     debugLog('Pill 래퍼 요소를 찾을 수 없음');
//   }

//   debugLog('인터랙션 힌트 초기화 완료');
// };
