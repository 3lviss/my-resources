# UI/UX Reviewer Agent Memory

## Project Design System

**Color Palette (dark theme, consistent across app):**
- Backgrounds: `bg-gray-900` (page/header), `bg-gray-800` (cards/toolbar), `bg-gray-700` (table headers)
- Accent: `purple-*` (primary accent), `cyan-*` (secondary), `pink-*` (gradient endpoint)
- Text: `text-white` (primary), `text-gray-300/400` (secondary/muted), `text-gray-500` (disabled/placeholder)
- Borders: `border-gray-700/800` (structural), `border-purple-500/20` or `/30` (decorative accent)
- Danger: `red-400/500/600`

**Typography scale:**
- Page titles/logo: `text-xl` to `text-4xl font-bold` with gradient clip
- Section headers: `text-lg font-semibold text-white`
- Body: `text-gray-300`, `text-sm text-gray-400`
- Labels: `text-gray-300 font-medium`

**Common Tailwind patterns:**
- Rounded: `rounded-lg` (cards/modals), `rounded-xl` (inputs/auth forms), `rounded-2xl` (auth card)
- Focus rings: `focus:ring-2 focus:ring-purple-500/20` or `focus:ring-purple-400` (close button)
- Transitions: `transition-colors`, `transition-all duration-200/300`
- Shadows: `shadow-xl` (ConfirmModal), `shadow-2xl` (Modal/auth card)

**Component inventory:**
- `Button.tsx` – variants: primary, secondary, danger, ghost, gradient, glass; sizes: sm, md, lg
- `Modal.tsx` – generic modal with focus trap, Escape dismiss, scroll lock, ARIA role=dialog
- `ConfirmModal.tsx` – standalone destructive-action modal (does NOT use Modal.tsx, inconsistency)
- `Toast.tsx` – simple success/error notification, auto-dismiss
- `Datatable.tsx` – resource table with edit/delete icon buttons
- `Pagination.tsx`, `Filter.tsx`, `SearchInput.tsx` – supporting data list controls

**Known design inconsistencies:**
- `ConfirmModal` uses `bg-black/50` overlay vs `Modal`'s `bg-black/75` — different darkness
- `ConfirmModal` uses `bg-gray-800` vs `Modal`'s `bg-gray-900` — different modal surface color
- `ConfirmModal` lacks ARIA attributes (no role=dialog, aria-modal, aria-labelledby)
- `ConfirmModal` lacks Escape key dismiss and focus management
- `ConfirmModal` should ideally be refactored to use `Modal.tsx` as its base

**Accessibility patterns seen:**
- Modal.tsx: has role=dialog, aria-modal, aria-labelledby, aria-describedby, focus trap, Escape key, scroll lock, focus restoration — solid implementation
- Button.tsx: missing focus-visible ring styles on all variants (uses disabled:opacity-50 but no focus ring)
- Datatable icon buttons: use `title` attribute only, no `aria-label` — screen reader gap
- Links in Datatable: "Link" text is not descriptive for screen readers

See `patterns.md` for detailed component analysis notes.
