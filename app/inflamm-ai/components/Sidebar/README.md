# Sidebar Component Documentation

## Overview
The Sidebar component provides the main navigation for the Inflamm AI application with support for desktop, tablet, and mobile views.

## Features
- **Framer Motion animations** with `layoutId` for smooth active state transitions
- **Quantum background** (circuit-bg.svg) when `FEATURE_QUANTUM_BG` is enabled
- **Responsive design**: Full sidebar on desktop, collapsible on tablet, hidden on mobile (bottom nav instead)
- **Accessibility**: WCAG AA compliant, keyboard navigable, aria-current on active items
- **Touch-friendly**: 44px minimum touch targets

## Props

### Sidebar
```typescript
interface SidebarProps {
  activeModule: string;      // Current active module ID
  onNavigate: (module: string) => void;  // Navigation callback
  collapsed?: boolean;        // Collapsed state (icon-only)
}
```

### SidebarItem
```typescript
interface SidebarItemProps {
  id: string;                 // Unique identifier
  label: string;              // Display label
  Icon: React.ComponentType;  // Icon component
  active: boolean;            // Active state
  onClick: () => void;        // Click handler
  collapsed?: boolean;        // Collapsed state
}
```

## Design Tokens
Located in `app/inflamm-ai/styles/tokens.css`:

```css
--accent-orange: #FF8A00
--accent-yellow: #FFD400
--surface: #0F1720
--bg: #0B0F14
--muted: #98A1AD
--glow-orange: rgba(255, 180, 122, 0.12)
--glow-yellow: rgba(255, 241, 154, 0.10)
--radius-xl: 14px
--touch-target-min: 44px
```

## Navigation Order
The sidebar items must appear in this exact order:
1. VyTap
2. Vitalsync
3. Chat
4. SciCast
5. Blog

## Feature Flags
- `FEATURE_VYTAP` - Show/hide VyTap module
- `FEATURE_VITALSYNC` - Show/hide Vitalsync module
- `FEATURE_CHAT` - Show/hide Chat module
- `FEATURE_SCICAST` - Show/hide SciCast module
- `FEATURE_BLOG` - Show/hide Blog module
- `FEATURE_QUANTUM_BG` - Enable/disable quantum circuit background

## Accessibility
- All navigation buttons are keyboard accessible (Tab/Enter)
- Active items have `aria-current="page"`
- Collapsed mode includes `aria-label` on icon-only items
- Focus states use visible ring indicators
- Color contrast meets WCAG AA standards

## Responsive Behavior
- **Desktop (≥1024px)**: Full sidebar with icon + label
- **Tablet (768-1023px)**: Collapsible sidebar (can show icon-only)
- **Mobile (<768px)**: Hidden sidebar, bottom navigation bar instead

## Icons
Icons are defined in `components/Sidebar/icons.tsx` and accept:
- `isActive` prop: Changes stroke color to orange when true
- `className` prop: Additional CSS classes

## Animations
- Active indicator uses Framer Motion's `layoutId="sidebar-active"`
- Hover: scale(1.02)
- Active press: translateY(1px)
- Smooth spring transitions (stiffness: 500, damping: 30)

## Usage Example
```tsx
import { Sidebar } from './components/Sidebar/Sidebar';

function App() {
  const [activeModule, setActiveModule] = useState('vytap');
  
  return (
    <Sidebar
      activeModule={activeModule}
      onNavigate={setActiveModule}
      collapsed={false}
    />
  );
}
```

## Visual Style
- Dark surface (#0F1720) background
- Pill-shaped active indicator with orange→yellow gradient glow
- Subtle drop shadows on active items
- Circuit pattern background at ~6-8% opacity
- Small animated glow particles at bottom

## Testing
- Unit tests: Navigation callbacks, feature flag filtering
- Visual regression: Chromatic/Percy snapshots for all states
- Accessibility: axe-core compliance tests
- E2E: Navigation flow between all modules

## Maintenance Notes
- Icons should remain consistent with the line-art style
- Active gradient must use CSS variables for theming
- Touch targets must never be smaller than 44px
- Always test keyboard navigation when making changes
