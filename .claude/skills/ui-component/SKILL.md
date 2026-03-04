---
name: component
description: Generate a React component with TypeScript and Tailwind CSS for the resource management application. Create new reusable UI components following project standards.
argument-hint: [ComponentName] [brief description]
disable-model-invocation: false
allowed-tools: Write, Read, Glob
---

# Generate a React Component

Create a new React TypeScript component for the resource management application.

- **Component name**: `$0` (use PascalCase, e.g., FilterPanel, ResourceCard)
- **Description**: `$1` (what the component does)
- **Location**: `frontend/src/components/`

## Project Requirements

Based on the project structure (see [CLAUDE.md](../../CLAUDE.md)):

1. **React 19 + TypeScript**
   - Use type-only imports: `import type { ReactNode } from "react"`
   - Strong typing for all props

2. **Styling**
   - Tailwind CSS for all styling
   - No separate CSS files unless the component is complex
   - Use project color scheme: purples, cyans, dark backgrounds

3. **Component Pattern**
   - Props interface extending HTML element attributes where applicable
   - Default export function component
   - Include JSDoc documentation
   - Sensible defaults for optional props

4. **File Structure**
   - Single file component: `frontend/src/components/$0.tsx`
   - Or multi-file if complex: `frontend/src/components/$0/$0.tsx`

## Component Template

Use this pattern for the component structure:

```typescript
import type { HTMLAttributes, ReactNode } from "react";

interface ComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  // Add custom props here
  children?: ReactNode;
  variant?: "primary" | "secondary";
}

/**
 * ComponentName
 *
 * Brief description of what this component does.
 *
 * @example
 * <ComponentName variant="primary">Content</ComponentName>
 */
export default function ComponentName({
  className = "",
  ...props
}: ComponentNameProps) {
  return (
    <div className={`base-styles ${className}`} {...props}>
      {props.children}
    </div>
  );
}
```

## Reference Examples

See these existing components for patterns to follow:

- [Button.tsx](../../frontend/src/components/Button.tsx) - Complex variant handling
- [SearchInput.tsx](../../frontend/src/components/SearchInput.tsx) - HTML attribute extension
- [ConfirmModal.tsx](../../frontend/src/components/ConfirmModal.tsx) - More complex state
- [Pagination.tsx](../../frontend/src/components/Pagination.tsx) - Props composition

## Instructions for Claude

When creating the component `$0` with description `$1`:

1. **Create the file** at `frontend/src/components/$0.tsx`

2. **Define props interface**
   - Extend `HTMLAttributes<HTMLElement>` if appropriate
   - Include all props mentioned in the description
   - Add JSDoc comments for complex props

3. **Implement component**
   - Follow the template pattern above
   - Use Tailwind CSS classes for styling
   - Match the design from other components (dark background, purple/cyan accents)
   - Handle children and other common props

4. **Add documentation**
   - JSDoc with description and example
   - Props documentation if complex

5. **Follow style conventions**
   - Use semantic HTML elements
   - Consistent spacing and sizing
   - Accessible interaction patterns

6. **Trigger UI/UX Review** (IMPORTANT)
   - After creating the component, launch the `ui-ux-reviewer` agent
   - Use: `/agent ui-ux-reviewer` or delegate to the ui-ux-reviewer sub-agent
   - Provide the component path: `frontend/src/components/$0.tsx`
   - Include component description and requirements
   - Wait for review feedback before finalizing

## Post-Generation Review

After creating the component:

1. **Automatic UI/UX Review** - The component will be automatically reviewed by the `ui-ux-reviewer` agent
2. **Feedback Loop** - Review insights will be used to refine the component if needed
3. **Visual Validation** - Screenshots and accessibility checks will be performed
4. **Quality Assurance** - Ensures component meets design and usability standards

## Example Invocation

```
/component ResourceCard A card component for displaying resource information with title, type, and action buttons
```

This would create `frontend/src/components/ResourceCard.tsx` with:
- Props for resource data (title, type, etc.)
- Action buttons
- Styled with Tailwind CSS matching project theme
- TypeScript types for all props

## Integration with ui-ux-reviewer Agent

After generating the component, it will be automatically sent to the **ui-ux-reviewer** agent which will:

✅ **Visual Design Review**
- Check Tailwind CSS consistency
- Validate color scheme (purples, cyans, dark backgrounds)
- Ensure responsive design

✅ **User Experience Review**
- Test component interactivity
- Validate accessibility (WCAG 2.1)
- Check component behavior in different states

✅ **Code Quality Review**
- TypeScript type safety
- Props documentation
- Component pattern adherence

✅ **Browser Testing**
- Screenshot validation
- Cross-browser compatibility
- Mobile responsiveness
