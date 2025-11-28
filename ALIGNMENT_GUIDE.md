# Enterprise CRM - Alignment & Spacing Guide

## ✅ Layout Structure

### Main Layout
```
┌─────────────────────────────────────────────────────────┐
│  Sidebar (64px wide, fixed left)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  TopBar (h-16, fixed top, left-64)              │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  Main Content (mt-16, p-8, max-w-1920px)  │ │  │
│  │  │                                            │ │  │
│  │  │  All pages centered with consistent       │ │  │
│  │  │  spacing and alignment                    │ │  │
│  │  │                                            │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 📐 Spacing System

### Consistent Padding
- **Main Content Area**: `p-8` (32px padding on all sides)
- **Cards**: `p-6` (24px padding)
- **Card Content**: `pt-6` (24px top padding)
- **Sections**: `space-y-6` (24px vertical spacing between sections)

### Grid Systems
- **Stats Cards**: `grid gap-4 md:grid-cols-2 lg:grid-cols-4`
- **Two Column**: `grid gap-4 md:grid-cols-2`
- **Kanban Board**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4`

## 🎯 Component Alignment

### Page Headers
All pages use consistent header structure:
```tsx
<div className="flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
    <p className="text-muted-foreground mt-1">Description</p>
  </div>
  <div className="flex items-center gap-2">
    {/* Action buttons */}
  </div>
</div>
```

### Card Alignment
```tsx
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content with consistent padding */}
  </CardContent>
</Card>
```

### Form Groups
```tsx
<div className="space-y-2">
  <Label>Field Label</Label>
  <Input />
</div>
```

## 🎨 Custom Utility Classes

### Page Structure
- `.page-header` - Consistent header layout with flex and spacing
- `.page-title` - Standard title styling (text-3xl font-bold tracking-tight)
- `.page-description` - Muted description text with top margin

### Layout
- `.card-grid` - Responsive grid for stat cards
- `.stat-card` - Consistent card styling with padding and borders
- `.form-group` - Vertical spacing for form fields

## 📱 Responsive Breakpoints

### Tailwind Breakpoints Used
- **sm**: 640px - Small devices
- **md**: 768px - Medium devices (tablets)
- **lg**: 1024px - Large devices (desktops)
- **xl**: 1280px - Extra large screens
- **2xl**: 1536px - Ultra-wide screens

### Responsive Patterns
```tsx
// Stats Grid: 1 col mobile, 2 cols tablet, 4 cols desktop
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

// Kanban: 1 col mobile, 2 cols tablet, 3 cols desktop, 6 cols ultra-wide
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

// Two Column: 1 col mobile, 2 cols desktop
<div className="grid gap-4 lg:grid-cols-2">
```

## 🔧 Alignment Best Practices

### Flexbox Alignment
```tsx
// Horizontal center with space between
<div className="flex justify-between items-center">

// Vertical center
<div className="flex items-center gap-2">

// Start alignment with gap
<div className="flex items-start gap-3">
```

### Grid Alignment
```tsx
// Auto-fit columns with minimum width
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">

// Fixed columns with responsive breakpoints
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
```

### Text Alignment
```tsx
// Left-aligned (default)
<p className="text-left">

// Center-aligned
<p className="text-center">

// Right-aligned for numbers
<p className="text-right">
```

## 📊 Specific Page Alignments

### Dashboard
- **Stats Grid**: 4 columns on desktop, 2 on tablet, 1 on mobile
- **Charts Section**: 2 columns on desktop, 1 on mobile
- **AI Insights**: Full width on mobile, 2/3 width on desktop

### Pipeline
- **Kanban Columns**: 6 columns on ultra-wide, 3 on desktop, 2 on tablet, 1 on mobile
- **Card Spacing**: 4px gap between cards
- **Column Width**: Equal width with flex-1

### Activities
- **Stats Cards**: 4 columns on desktop, 2 on tablet, 1 on mobile
- **Task List**: Full width with consistent padding
- **Tabs**: Full width with centered content

### Settings
- **Form Layout**: Single column with max-width-2xl
- **Section Spacing**: space-y-6 between sections
- **Input Groups**: space-y-2 within each group

## 🎯 Vertical Rhythm

### Consistent Spacing Scale
- **xs**: `gap-1` (4px) - Tight spacing for related items
- **sm**: `gap-2` (8px) - Form field spacing
- **md**: `gap-4` (16px) - Card grid spacing
- **lg**: `gap-6` (24px) - Section spacing
- **xl**: `gap-8` (32px) - Major section breaks

### Section Spacing
```tsx
// Between major sections
<div className="space-y-6">

// Between cards in a grid
<div className="grid gap-4">

// Between form fields
<div className="space-y-2">
```

## 🖼️ Card Layouts

### Stat Card
```tsx
<Card className="bg-card border-border">
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Label</p>
        <p className="text-2xl font-bold text-foreground">Value</p>
      </div>
      <div className="p-3 rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
  </CardContent>
</Card>
```

### Content Card
```tsx
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Icon className="h-5 w-5" />
      Title
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content with vertical spacing */}
  </CardContent>
</Card>
```

## 🎨 Visual Hierarchy

### Typography Scale
- **Page Title**: `text-3xl font-bold tracking-tight`
- **Section Title**: `text-2xl font-bold`
- **Card Title**: `text-lg font-semibold`
- **Body Text**: `text-sm` or `text-base`
- **Muted Text**: `text-sm text-muted-foreground`

### Icon Sizes
- **Large Icons**: `h-6 w-6` (24px) - Page headers
- **Medium Icons**: `h-5 w-5` (20px) - Card headers
- **Small Icons**: `h-4 w-4` (16px) - Buttons, inline icons

## ✅ Alignment Checklist

### Before Committing
- [ ] All page headers use consistent structure
- [ ] Cards have uniform padding (p-6)
- [ ] Grids use consistent gap spacing (gap-4)
- [ ] Sections have vertical spacing (space-y-6)
- [ ] Buttons are properly aligned in headers
- [ ] Icons are consistently sized
- [ ] Text hierarchy is clear
- [ ] Responsive breakpoints work correctly
- [ ] No horizontal scrolling on mobile
- [ ] Content is centered with max-width

### Testing Checklist
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1280px width)
- [ ] Test on ultra-wide (1920px width)
- [ ] Check sidebar collapse behavior
- [ ] Verify card grid responsiveness
- [ ] Test form layouts on all sizes

## 🚀 Performance Considerations

### Efficient Layouts
- Use `flex` for simple alignments
- Use `grid` for complex layouts
- Avoid nested flex containers when possible
- Use `gap` instead of margin for spacing

### Responsive Images
```tsx
<img 
  className="w-full h-auto object-cover rounded-lg" 
  alt="Description"
/>
```

## 📝 Code Examples

### Perfect Page Structure
```tsx
export default function PageName() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
          <p className="text-muted-foreground mt-1">Description</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>Action</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat cards */}
      </div>

      {/* Content Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Section Title</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Content */}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

**Last Updated**: 2025-11-28
**Version**: 1.0.0
**Status**: Production Ready ✅

All alignment and spacing guidelines are implemented consistently across the entire application.
