```markdown
# Apple-Style Pill Animation System

Apple 홈페이지 스타일의 순차적 스크롤 애니메이션과 인터랙티브 Pill 시스템을 구현한 프로젝트입니다.

## 애니메이션 미리보기

## 애니메이션 미리보기

[![Video Label](http://img.youtube.com/vi/eqZKZOQIHfU/0.jpg)](https://youtu.be/eqZKZOQIHfU)

## 주요 특징

- **순차적 애니메이션**: 스케일링 → 높이 축소 → Pill 상승의 자연스러운 흐름
- **Apple 스타일 Pill**: 화면 하단에서 상승하여 확장되는 인터랙티브 UI
- **반응형 디자인**: 360px부터 데스크톱까지 완벽 대응
- **자연스러운 전환**: Transform 제거 시스템으로 부드러운 sticky 효과
- **모듈화 구조**: 재사용 가능한 컴포넌트 기반 설계

## 애니메이션 동작 원리

### 전체 애니메이션 플로우

Apple의 홈페이지와 같은 자연스러운 스크롤 경험을 제공하기 위해 4개의 독립적인 애니메이션 시스템이 정교하게 연결되어 작동합니다.
```

┌─────────────────┐ onComplete ┌─────────────────┐ 0.5초 지연 ┌─────────────────┐
│ 스케일 애니메이션 │ ─────────────→ │ 높이 축소 애니메이션 │ ─────────────→ │ 자연스러운 전환 │
│ (400vh 구간) │ │ (2초 duration) │ │ │
└─────────────────┘ └─────────────────┘ └─────────────────┘
↓
┌─────────────────┐ 섹션 진입 시 ┌─────────────────┐ 65% 지점부터 ┌─────────────────┐
│ Pill 상승 애니메이션 │ ←───────────── │ 메인 섹션 진입감지 │ │ Transform 제거 │
│ (즉시 실행) │ │ (ScrollTrigger) │ ─────────────→ │ (90% 지점까지) │
└─────────────────┘ └─────────────────┘ └─────────────────┘

```

#### 동시성과 순차성의 조화

1. **순차적 실행**: 스케일 → 높이 애니메이션은 `onComplete` 콜백으로 연결
2. **병렬 실행**: Pill 애니메이션은 독립적인 ScrollTrigger로 메인 섹션 진입 시 즉시 시작
3. **중첩 실행**: Transform 제거는 65% 지점부터 시작되어 기존 애니메이션과 자연스럽게 전환

#### 시간축 분석

```

시간축: 0s ────── 2s ────── 4s ────── 6s ────── 8s ──────
스케일: [████████████████████████████████████]
높이: [████████████]
Pill: [██████████████████]
Transform: [████████████]

````

### 핵심 애니메이션 단계

#### Phase 1: 디바이스 스케일 애니메이션

```javascript
gsap.to(domElementsConfig.scalableDeviceMockup, {
  scale: 0.6667, // 원본의 66.67%로 축소
  scrollTrigger: {
    trigger: '.main-animation-section .device-image-section',
    pin: '.main-animation-section .device-image-section',
    scrub: 1, // 스크롤과 1:1 동기화
    start: 'top top',
    end: '+=400vh', // 뷰포트 높이의 4배만큼 스크롤
    onComplete: () => adaptingReduceHeight()
  }
});
````

**핵심 특징**:

- **Pin 효과**: 해당 섹션을 화면에 고정하여 스크롤하는 동안 계속 보이도록 처리
- **Scrub 동기화**: `scrub: 1`로 스크롤 속도와 애니메이션 진행률을 1:1로 매칭
- **Transform Origin**: 요소의 중앙을 기준으로 축소되어 자연스러운 효과
- **Pin-spacer 관리**: GSAP이 자동 생성하는 pin-spacer의 높이를 실시간으로 조정

**수학적 계산**:

```
스크롤 거리: 400vh (뷰포트 높이 * 4)
스케일 변화: 1.0 → 0.6667 (33.33% 축소)
진행률 = 현재 스크롤 / 400vh
현재 스케일 = 1.0 - (진행률 * 0.3333)
```

#### Phase 2: 자연스러운 높이 축소 애니메이션

```javascript
export const adaptingReduceHeight = () => {
  gsap.delayedCall(0.5, () => {
    const heightReductionTween = gsap.to(domElementsConfig.deviceImageSection, {
      height: '60vh', // 100vh → 60vh로 40% 축소
      duration: 2,
      ease: 'power2.inOut',
      onComplete: () => applyFianlPinSpacerHeight(),
    });

    // 실시간 pin-spacer 동기화
    const synchronizePinSpacerHeightWhileScrolling = () => {
      if (pinSpacerElement && heightReductionTween.progress() < 1) {
        const currentHeight =
          domElementsConfig.deviceImageSection.getBoundingClientRect().height;
        pinSpacerElement.style.setProperty(
          'height',
          `${currentHeight}px`,
          'important'
        );
        requestAnimationFrame(synchronizePinSpacerHeightWhileScrolling);
      }
    };
  });
};
```

**핵심 메커니즘**:

- **지연 실행**: 0.5초 지연으로 스케일 애니메이션과 자연스럽게 연결
- **실시간 동기화**: `requestAnimationFrame`을 사용해 60fps로 pin-spacer 높이 동기화
- **브라우저 레이아웃 엔진 활용**: `height` 속성 변경으로 문서 플로우를 자연스럽게 재계산
- **Easing 최적화**: `power2.inOut`으로 시작과 끝이 부드러운 가속/감속 곡선

**레이아웃 플로우 변화**:

```
Before: [Device Section: 100vh] → [Text Section]
         ↓ (height 애니메이션)
After:  [Device Section: 60vh] → [Text Section이 자연스럽게 위로 상승]
```

#### Phase 3: Pill 상승 및 확장 애니메이션

```javascript
export const createPillRiseAnimationTimeline = () => {
  const pillRiseTimeline = gsap.timeline({ paused: true });

  // 1단계: 극적인 수직 상승
  pillRiseTimeline.fromTo(
    domElementsConfig.animatedPillWrapper,
    {
      y: 800, // 화면 아래 800px (완전히 화면 밖)
      opacity: 0.9, // 살짝 투명한 상태로 시작
    },
    {
      y: -120, // 화면 위 120px (sticky 위치)
      opacity: 1.0,
      duration: 0.9,
      ease: 'power2.out', // 빠른 시작, 부드러운 착지
    }
  );

  // 2단계: CSS 변수 기반 폭 확장
  pillRiseTimeline.to(
    domElementsConfig.animatedPillWrapper,
    {
      duration: 1.1,
      onStart: () => {
        // CSS 변수를 통한 부드러운 폭 확장
        domElementsConfig.animatedPillWrapper.classList.add('expanded');
      },
    },
    0.9
  ); // 상승 완료 시점부터 시작

  return pillRiseTimeline;
};
```

**애니메이션 타이밍 차트**:

```
Timeline: 0s ─── 0.9s ──── 2.0s
상승:     [████████████]
확장:            [██████████████]
겹침:            [███] (0.9s~1.1s 구간)
```

**CSS 변수 시스템**:

```css
.animated-pill-wrapper {
  width: var(--pill-width);
  transition: width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --pill-width: 40px; /* 기본 상태 */
}

.animated-pill-wrapper.expanded {
  --pill-width: 180px; /* 확장 상태 */
  --pill-text-opacity: 1; /* 텍스트 표시 */
  --pill-text-x: 0px; /* 텍스트 위치 조정 */
}
```

#### Phase 4: 스크롤 방향 인식 시스템

```javascript
ScrollTrigger.create({
  trigger: '.main-animation-section',
  start: 'top top',
  end: 'bottom top',

  // 하향 스크롤: 새로운 콘텐츠 탐색 의도
  onEnter: () => {
    pillRiseTimeline.restart(); // 즉시 상승 애니메이션 시작
  },

  // 상향 스크롤: 이전 콘텐츠 복귀 의도
  onLeaveBack: () => {
    const currentY = gsap.getProperty(
      domElementsConfig.animatedPillWrapper,
      'y'
    );

    if (currentY <= -100) {
      // 시나리오 1: Pill이 완전히 상승한 상태
      pillDisappearTimeline.restart(); // 부드러운 사라짐 애니메이션
    } else {
      // 시나리오 2: 아직 상승 중인 상태
      // 즉시 숨김 처리 (사용자가 빠르게 지나가고 싶어함)
      gsap.set(domElementsConfig.animatedPillWrapper, {
        y: 800,
        display: 'none',
      });
    }
  },
});
```

**사용자 의도 분석**:

- **하향 스크롤**: 새로운 콘텐츠를 보려는 적극적 탐색 → 풀 애니메이션 제공
- **상향 스크롤**: 빠른 복귀나 재확인 → 현재 상태에 따른 적절한 반응

#### Phase 5: Transform 제거 및 Sticky 전환

```javascript
export const initializeTransformRemovalSystem = () => {
  ScrollTrigger.create({
    trigger: '.scalable-device-mockup',
    start: '65% top', // 전체 애니메이션의 65% 지점
    end: '90% top', // 90% 지점까지 점진적 제거
    scrub: 2, // 부드러운 2배속 동기화

    onUpdate: (self) => {
      const progress = self.progress;
      // 사인 함수를 사용한 자연스러운 이징
      const easedProgress = Math.sin((progress * Math.PI) / 2);

      // Transform 값을 점진적으로 0에 가깝게 조정
      const currentY = -120 + 120 * easedProgress; // -120px → 0px

      domElementsConfig.animatedPillWrapper.style.transform = `translateY(${currentY}px)`;

      // 99% 지점에서 완전한 transform 제거
      if (progress >= 0.99) {
        domElementsConfig.animatedPillWrapper.style.transform = '';
        // 이제 CSS의 sticky positioning이 위치를 제어
      }
    },
  });
};
```

**Transform → Sticky 전환의 수학적 모델**:

```
진행률(p) = 0 → 1
이징 함수 = sin(p * π/2)
Y 위치 = -120 + (120 * 이징값)

p=0.0: Y=-120px (GSAP transform 완전 제어)
p=0.5: Y=-75px  (중간 전환 지점)
p=0.9: Y=-12px  (거의 CSS sticky 준비)
p=0.99: Y=-1px  (transform 제거 직전)
p=1.0: transform 제거, CSS sticky 완전 활성화
```

## 핵심 코드 구조

### 모듈 구성

```
├── main.js                 # 전체 시스템 초기화 및 통합
├── config.js              # DOM 요소 및 설정값 관리
├── gsapAnimations.js      # 스케일/높이 애니메이션
├── pillAnimations.js      # Pill 상승/확장/사라짐 애니메이션
├── responsiveManager.js   # 반응형 pin-spacer 관리
└── transformSystem.js     # Transform 제거 시스템
```

### 핵심 함수들

#### 1. 순차 애니메이션 시스템

```javascript
// gsapAnimations.js
export const scalingDomAnimation = () => {
  gsap.to(domElementsConfig.scalableDeviceMockup, {
    scale: 0.6667,
    scrollTrigger: {
      trigger: '.main-animation-section .device-image-section',
      pin: '.main-animation-section .device-image-section',
      scrub: 1,
      start: 'top top',
      end: '+=400vh',
      onComplete: () => {
        adaptingReduceHeight(); // 높이 애니메이션 연계 실행
      },
    },
  });
};
```

#### 2. Pill 애니메이션 타임라인

```javascript
// pillAnimations.js
export const createPillRiseAnimationTimeline = () => {
  const pillRiseTimeline = gsap.timeline({ paused: true });

  // 1단계: 상승 애니메이션
  pillRiseTimeline.fromTo(
    domElementsConfig.animatedPillWrapper,
    { y: 800, opacity: 0.9 },
    { y: -120, opacity: 1.0, duration: 0.9, ease: 'power2.out' }
  );

  // 2단계: 폭 확장 (CSS 변수 활용)
  pillRiseTimeline.to(
    domElementsConfig.animatedPillWrapper,
    {
      duration: 1.1,
      onStart: () => {
        domElementsConfig.animatedPillWrapper.classList.add('expanded');
      },
    },
    0.9
  );

  return pillRiseTimeline;
};
```

#### 3. Transform 제거 시스템

```javascript
// transformSystem.js
export const initializeTransformRemovalSystem = () => {
  ScrollTrigger.create({
    trigger: '.scalable-device-mockup',
    start: '65% top',
    end: '90% top',
    scrub: 2,
    onUpdate: (self) => {
      const progress = self.progress;
      const easedProgress = Math.sin((progress * Math.PI) / 2);
      const currentY = -120 + 120 * easedProgress; // -120px → 0px

      domElementsConfig.animatedPillWrapper.style.transform = `translateY(${currentY}px)`;

      if (progress >= 0.99) {
        // Transform 완전 제거
        domElementsConfig.animatedPillWrapper.style.transform = '';
      }
    },
  });
};
```

#### 4. 반응형 pin-spacer 관리

```javascript
// responsiveManager.js
export const calculateResponsivePinSpacerHeightByViewport = () => {
  const currentViewportWidth = window.innerWidth;
  const isMobileDevice =
    currentViewportWidth >= 360 && currentViewportWidth < 768;
  return isMobileDevice ? '90vh' : '115vh';
};

export const applyFianlPinSpacerHeight = (customHeight = null) => {
  const targetHeightValue =
    customHeight || calculateResponsivePinSpacerHeightByViewport();
  const pinSpacerElement = document.querySelector('.pin-spacer');

  if (pinSpacerElement) {
    pinSpacerElement.style.setProperty(
      'height',
      targetHeightValue,
      'important'
    );
  }
};
```

## CSS 변수 기반 애니메이션

Pill의 폭 확장은 CSS 변수와 전환을 활용하여 구현:

```css
.animated-pill-wrapper {
  width: var(--pill-width);
  transition: width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --pill-width: 40px; /* 기본값 */
}

.animated-pill-wrapper.expanded {
  --pill-width: 180px; /* 확장 시 */
  --pill-text-opacity: 1;
  --pill-text-x: 0px;
}
```

## 파일 구조

```
project/
├── animation_applePill.html    # 메인 HTML
├── guide_animation_pill.html   # 애니메이션 가이드
└── applePill/
    ├── main.js                 # 시스템 초기화
    ├── config.js               # 설정 관리
    ├── gsapAnimations.js       # GSAP 애니메이션
    ├── pillAnimations.js       # Pill 애니메이션
    ├── responsiveManager.js    # 반응형 관리
    └── transformSystem.js      # Transform 시스템
```

## 사용법

### 1. 기본 설치

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script type="module" src="./applePill/main.js"></script>
```

### 2. HTML 구조

```html
<section class="main-animation-section">
  <div class="device-image-section">
    <div class="scalable-device-mockup"></div>
  </div>

  <div class="fixed-pill-container">
    <div class="animated-pill-wrapper" id="animatedPillWrapper">
      <span class="pill-display-text">Lorem ipsum</span>
      <button class="pill-interactive-button" type="button">
        <!-- 버튼 내용 -->
      </button>
    </div>
  </div>
</section>
```

### 3. 초기화

```javascript
import { initializeCompleteAnimationSystem } from './applePill/main.js';
initializeCompleteAnimationSystem();
```

## 주요 개선사항 (v3)

- **순차적 애니메이션 시스템**: onComplete 콜백 체인으로 자연스러운 흐름
- **Pin-spacer 높이 동기화**: 110vh 고정으로 레이아웃 점프 현상 완전 해결
- **자연스러운 레이아웃 플로우**: translateY 강제 이동 대신 height 기반 자연 플로우
- **양방향 Pill 애니메이션**: 극적인 상승과 부드러운 사라짐의 완벽한 대칭
- **Transform 제거 시스템**: 애니메이션 완료 후 순수 sticky positioning
- **스크롤 방향 인식**: 사용자 의도에 따른 차별적 반응 시스템
