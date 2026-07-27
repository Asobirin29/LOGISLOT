---
name: Logislot Enterprise
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#002046'
  on-primary: '#ffffff'
  primary-container: '#1b365d'
  on-primary-container: '#87a0cd'
  inverse-primary: '#aec7f7'
  secondary: '#356289'
  on-secondary: '#ffffff'
  secondary-container: '#a5d0fd'
  on-secondary-container: '#2c5980'
  tertiary: '#321c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#4f2f00'
  on-tertiary-container: '#c6965e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f7'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2e476f'
  secondary-fixed: '#cfe5ff'
  secondary-fixed-dim: '#a0cbf7'
  on-secondary-fixed: '#001d33'
  on-secondary-fixed-variant: '#194a70'
  tertiary-fixed: '#ffddb9'
  tertiary-fixed-dim: '#f1bd81'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#623f0f'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style
The design system is engineered for high-efficiency B2B logistics environments where clarity, speed of data processing, and reliability are paramount. The brand personality is authoritative yet streamlined, moving away from legacy industrial clutter toward a modern, systematic interface. 

The visual style is **Corporate Modern** with a focus on functional minimalism. It utilizes a structured grid, flat-vector geometric illustrations for empty states or onboarding, and high-density information layouts. The emotional response should be one of "controlled precision"—users should feel that the platform is a robust tool capable of managing complex global supply chains with ease.

## Colors
The palette is anchored by **Deep Navy Blue**, signifying stability and corporate trust. The **Medium Blue** serves as an interactive accent for secondary actions and progress indicators. 

The background utilizes a cool-toned **Light Grey** to reduce eye strain during long working hours and to clearly separate surface areas from the page container. Error states use a high-visibility **Red** to ensure critical logistics failures are immediately noticed. Semantic colors for "Success" (Green) and "Warning" (Amber) should follow the same saturation levels as the secondary blue to maintain a harmonious UI.

## Typography
This design system uses **Inter** exclusively to leverage its exceptional legibility in data-heavy environments. The type scale is disciplined, prioritizing hierarchy through weight and subtle letter-spacing adjustments rather than excessive size shifts.

- **Headlines:** Use Bold (700) for page titles and Semi-Bold (600) for section headers.
- **Body:** The default size is 14px to allow for high information density without sacrificing readability.
- **Labels:** Small, uppercase labels are used for table headers and form input descriptors to differentiate them from user-entered data.

## Layout & Spacing
The layout relies on a **Fluid Grid** with a maximum container width of 1440px for desktop to prevent line lengths from becoming unreadable. We use an 8px linear scale for all spacing increments.

- **Desktop (1280px+):** 12-column grid, 24px gutters, 40px side margins.
- **Tablet (768px - 1279px):** 8-column grid, 16px gutters, 24px side margins.
- **Mobile (<767px):** 4-column grid, 16px gutters, 16px side margins.

Complex data tables should allow for horizontal scrolling within their containers rather than forcing the entire page to reflow, maintaining the visibility of primary navigation at all times.

## Elevation & Depth
In line with the professional enterprise aesthetic, this design system avoids heavy shadows. Instead, it uses **Tonal Layers** and **Low-Contrast Outlines** to define hierarchy.

- **Level 0 (Background):** #F4F6F9.
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF) with a 1px border of #E2E8F0. No shadow.
- **Level 2 (Modals/Popovers):** Pure White with a very soft, diffused shadow: `0 4px 12px rgba(27, 54, 93, 0.08)`.

Interactions are signaled through color shifts (darkening the primary blue on hover) rather than increasing elevation.

## Shapes
The design system employs a **Rounded (8px)** corner radius across all primary components (Inputs, Buttons, Cards). This radius strikes a balance between the clinical feel of sharp corners and the overly casual nature of pill shapes. 

- **Small elements (Checkboxes):** 4px radius.
- **Medium elements (Buttons/Inputs):** 8px radius.
- **Large elements (Cards/Modals):** 12px radius.

## Components
### Logo
The **LOGISLOT** text logo should be rendered in the primary Deep Navy Blue using Inter Bold. It is always left-aligned in the navigation bar.

### Buttons
- **Primary:** Solid Deep Navy Blue fill with white text. High-contrast.
- **Secondary:** Transparent fill with Medium Blue border and text.
- **Tertiary:** Ghost style; text-only for low-priority actions.

### Input Fields
Inputs feature a 1px border (#CBD5E1) and an 8px radius. Active states use a 2px border of the Secondary Blue. Icons (e.g., Search, User, Lock) are placed on the left side of the input, rendered in Neutral Grey.

### Cards & Lists
Data lists should use zebra-striping (alternating #F4F6F9 and #FFFFFF) for high readability in large datasets. Cards are used for dashboard modules, featuring a 1px border and no shadow.

### Logistics-Specific Components
- **Status Badges:** Small, high-contrast pills for shipping status (e.g., "In Transit," "Delayed," "Delivered").
- **Data Grids:** High-density tables with fixed headers and sortable columns.