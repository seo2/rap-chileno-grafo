---
name: El País Más Rapero
colors:
  surface: '#fdf8f8'
  surface-dim: '#ddd9d9'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#46474a'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#76777b'
  outline-variant: '#c7c6ca'
  surface-tint: '#5f5e5f'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1c'
  on-primary-container: '#858384'
  inverse-primary: '#c8c6c7'
  secondary: '#a23e2e'
  on-secondary: '#ffffff'
  secondary-container: '#fd826d'
  on-secondary-container: '#721b0f'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#062014'
  on-tertiary-container: '#6e8a79'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e3'
  primary-fixed-dim: '#c8c6c7'
  on-primary-fixed: '#1b1b1c'
  on-primary-fixed-variant: '#474647'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a7'
  on-secondary-fixed: '#400200'
  on-secondary-fixed-variant: '#822719'
  tertiary-fixed: '#ccead6'
  tertiary-fixed-dim: '#b0cdbb'
  on-tertiary-fixed: '#062014'
  on-tertiary-fixed-variant: '#324c3e'
  background: '#fdf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  data-mono:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 40px
  container-max: 1280px
---

## Brand & Style
The brand personality is that of a **curatorial archivist and street-level historian**. It avoids the sterile aesthetics of modern SaaS in favor of a **fanzine-inspired, editorial grit**. The design system evokes the tactile quality of independent hip-hop magazines and vinyl records, bridging the gap between raw street culture and academic documentation.

The visual direction follows a **Modern Editorial/Minimalist** approach with a **Tactile** twist. It prioritizes structure and information density, using thin ink-like borders and paper textures to create a "living archive." The target audience includes researchers, hip-hop enthusiasts, and cultural explorers who value authenticity and historical depth.

## Colors
The palette is rooted in organic, analog tones to move away from digital "tech" aesthetics. 

- **Ink Black (#1A1A1B):** Used for primary typography and heavy structural borders.
- **Bone / Aged Paper (#F5F2ED):** The canvas. A warm, off-white that reduces eye strain and provides an archival feel.
- **Earth Red (#A13D2D):** A call to action and emphasis color, representing the energy of the Chilean scene.
- **Deep Forest Green (#2D4739):** Used for secondary accents and state indicators (e.g., Verified).
- **Muted Gold (#C5A059):** Reserved for special highlights, honors, or historic milestones.

Avoid pure whites (#FFFFFF) or standard digital blues. All interactions should maintain high contrast to ensure a "printed" look.

## Typography
The typography system relies on a sharp contrast between **Libre Caslon Text** (the editorial voice) and **Hanken Grotesk** (the functional voice).

- **Headlines:** Use Libre Caslon Text for all titles to instill a sense of literary authority and timelessness. 
- **Body & UI:** Hanken Grotesk provides a clean, contemporary sans-serif counterpoint that ensures data-heavy lists remain legible.
- **Labels:** Small caps and increased letter-spacing should be used for metadata and category tags to differentiate them from prose.

## Layout & Spacing
The layout follows a **Rigid Grid System** inspired by newspaper columns. It prioritizes vertical rhythm and tight information density.

- **Grid:** A 12-column grid for desktop with 16px gutters. Elements should align strictly to the grid to maintain a structured "cartography" feel.
- **Dividers:** Instead of using background containers to separate content, use 1px or 2px horizontal and vertical lines in Ink Black.
- **Density:** Spacing should feel "rhythmic"—tight enough to show breadth of data, but with generous top/bottom margins for major section headers to let the editorial content breathe.

## Elevation & Depth
This design system rejects shadows and blurs. Depth is conveyed through **Tonal Layering** and **Ink Borders**.

- **Surfaces:** Use subtle shifts in background color (e.g., a slightly darker Bone) or paper grain textures to differentiate layers.
- **Outlines:** All floating elements (like dropdowns or tooltips) must have a solid 1px or 2px Ink Black border.
- **Grain:** A global, low-opacity noise overlay should be applied to the background to break the digital flatness and reinforce the tactile archival theme.

## Shapes
Shapes are **Structured and Low-Radius**. 

- **Corners:** Use a consistent 4px radius for buttons and input fields. Large image containers or sections can go up to 8px, but no further. 
- **Icons:** Use sharp or slightly softened stroke-based icons. Avoid filled, "bubbly" icon sets.

## Components

### Buttons & Inputs
Buttons should feel like stamped labels. Use solid Ink Black backgrounds with Bone text for primary actions, and 1px Black outlines for secondary actions. Avoid hover effects that use shadows; instead, use color fills or "inverted" states (e.g., Black text on Earth Red background).

### Chips & Curatorial States
Chips are essential for the "Status" of artists/records.
- **Verified:** Deep Forest Green outline with a small dot icon.
- **Candidate:** Muted Gold outline.
- **Archived:** Thin Ink Black outline.
All chips use the `label-caps` typography.

### Lists & Dividers
The primary navigation pattern. Dense lists of artists or locations should be separated by 1px horizontal dividers. Use a "Hover Row" state where the background shifts to a very light gray-tinted version of Bone to indicate selection without breaking the grid.

### Cards (The "Minimal" Card)
Avoid shadows. A "card" in this system is simply a group of content defined by a border or a subtle background tint. Images should have a slight "ink bleed" effect or high-contrast treatment to match the editorial aesthetic.

### Data Visualizations
Maps and timelines should use the Earth Red and Deep Forest Green for data points, set against the Bone background. Lines should be thin and precise, resembling architectural or cartographic drafts.