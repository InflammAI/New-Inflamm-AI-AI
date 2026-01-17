# Inflamm AI Logo Files

## Available Formats

### 1. **React Component** (Recommended for App)
- **File**: `app/inflamm-ai/components/Logo/Logo.tsx`
- **Usage**: `<Logo size={48} />`
- **Benefits**: 
  - Fully scalable
  - No file loading delays
  - Type-safe with TypeScript
  - Customizable via props

### 2. **High-Resolution SVG Vector** (For External Use)
- **File**: `public/images/inflamm-logo-hd.svg`
- **Resolution**: 512x512 (scalable to any size)
- **Format**: SVG with transparent background
- **Usage**: Print, web, presentations, marketing materials
- **Benefits**: Crisp at any size, small file size

### 3. **Standard SVG** (Legacy)
- **File**: `public/images/inflamm-logo.svg`
- **Usage**: `<img src="/images/inflamm-logo.svg" />`

## Logo Design Specifications

### Colors
- **Primary Orange**: `#FF8C00` (Dark Orange)
- **Light Orange**: `#FFB347` (Light Salmon)
- **Border Accent**: `#D2691E` (Chocolate)
- **Heart**: `#FFFFFF` (White)

### Elements
1. **Outer Ring**: 12px stroke, gradient fill
2. **Inner Ring**: 4px stroke, 60% opacity
3. **Person Head**: 20px radius circle
4. **Person Body**: 30x40 ellipse
5. **Heart**: White with brown outline
6. **Signal Waves**: 3 concentric arcs (8, 7, 6px strokes)

### Design Features
- ✅ **Clean geometry** - perfect circles and smooth curves
- ✅ **Consistent spacing** - balanced composition
- ✅ **Even stroke widths** - professional appearance
- ✅ **High contrast** - readable at small sizes
- ✅ **Scalable** - looks crisp from 16px to 512px
- ✅ **Accessible** - warm, friendly color scheme

## Usage Examples

### In React Components
```tsx
import { Logo } from '@/components/Logo/Logo';

// Small
<Logo size={24} />

// Medium (default)
<Logo size={48} />

// Large
<Logo size={96} />

// With custom styling
<Logo size={64} className="hover:scale-110 transition" />
```

### In HTML
```html
<!-- SVG (best for web) -->
<img src="/images/inflamm-logo-hd.svg" alt="Inflamm AI" width="48" height="48" />

<!-- With Next.js Image component -->
<Image src="/images/inflamm-logo-hd.svg" alt="Inflamm AI" width={48} height={48} priority />
```

## Optimization Tips

1. **For small sizes (16-32px)**: Use the React component with solid colors
2. **For medium sizes (48-96px)**: Use the React component with gradients
3. **For large sizes (128px+)**: Use the HD SVG file
4. **For print**: Export HD SVG at 300 DPI or higher

## File Sizes
- React Component: ~2KB (embedded in JS)
- HD SVG: ~2.5KB
- Standard SVG: ~2KB

## License
© 2025 Inflamm AI. All rights reserved.
