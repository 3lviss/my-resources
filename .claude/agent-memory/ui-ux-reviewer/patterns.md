# Component Patterns & Analysis Notes

## Modal.tsx — Detailed Analysis (reviewed 2026-03-04)

File: `/Users/e.ahmetovic/Desktop/app/frontend/src/components/Modal.tsx`

### Strengths
- Proper ARIA: role="dialog", aria-modal="true", aria-labelledby, aria-describedby
- Focus management: stores previousActiveElement, restores on close
- Keyboard: Escape key dismiss via document keydown listener
- Scroll lock: document.body.style.overflow = "hidden" on open, restored on close
- Clean conditional rendering: returns null when !isOpen (avoids display:none pitfalls)
- TypeScript: extends HTMLAttributes<HTMLDivElement> for forward-compatible prop spreading
- Visual: consistent dark theme (bg-gray-900, border-purple-500/30, shadow-2xl)
- Close button has aria-label="Close modal"
- Overlay has aria-hidden="true"

### Issues Found

**Critical Accessibility:**
1. No full focus trap — tabIndex={-1} on the dialog div allows focus to escape into background DOM
   - Needs a FocusScope or manual trap (find all focusable children, intercept Tab/Shift+Tab)
   - WCAG 2.1 SC 2.1.2 (No Keyboard Trap) applies in reverse — focus must stay inside

2. `modal-title` id is hardcoded — if two modals are open simultaneously, IDs collide
   - Fix: use useId() hook or pass a unique id prop

3. `modal-description` id has the same hardcoded collision risk

**Major Accessibility:**
4. Focus moves to the dialog container (tabIndex=-1), not the first interactive element inside
   - Best practice (ARIA Authoring Practices Guide) recommends focusing first focusable child or the dialog heading
   - setTimeout delay of 0ms is fragile — animations could delay rendering

5. Missing `aria-live` or `role="alertdialog"` for destructive/error contexts
   - ConfirmModal use case would benefit from role="alertdialog" signal

**Minor Accessibility:**
6. Close button focus ring: `focus:ring-2 focus:ring-purple-400` is good, but `focus:outline-none` suppresses the native outline without always guaranteeing ring shows (Firefox sometimes differs)
   - Prefer `focus-visible:ring-2 focus-visible:outline-none` to only suppress for mouse users

**Visual Design:**
7. No entry animation — `opacity-100 scale-100 transition-all duration-200` classes are set as static values, so there is no actual enter transition. The modal pops in immediately.
   - To animate, need to manage entering state (e.g., start at opacity-0 scale-95, then switch to opacity-100 scale-100)
   - Alternatively use @headlessui/react Transition or CSS @keyframes via Tailwind

8. Max width `max-w-md` (448px) with `mx-4` is good for mobile, but no size variants exist
   - Large content (forms, tables) has no way to get a wider modal without overriding via contentClassName

9. Content area `max-h-[calc(100vh-10rem)]` — on very small screens (< 400px height) this could clip close to 0
   - Consider `max-h-[80dvh]` using dynamic viewport height for better mobile support

**UX:**
10. No loading/busy state indicator — when footer has async actions, nothing indicates progress inside the modal shell itself (left to footer content)

11. Overlay click closes modal but there is no visual affordance (cursor does not change to pointer, no ripple)

**Code Quality:**
12. `onClose` is in the useEffect dependency array but not wrapped in useCallback at the call site — could cause effect re-runs if the parent re-renders with a new function reference. Modal itself cannot fix this; the limitation should be documented.

13. `className` prop is spread onto the outer backdrop wrapper div, not the dialog container — consumer might expect className to style the modal box, not the full-screen overlay wrapper.

14. `contentClassName` prop name is slightly misleading — it applies to the modal panel (the box), not just the content area <div>. A clearer name would be `panelClassName` or `dialogClassName`.

## ConfirmModal.tsx — Gap Analysis vs Modal.tsx

File: `/Users/e.ahmetovic/Desktop/app/frontend/src/components/ConfirmModal.tsx`

- Does NOT use Modal.tsx — separate implementation, leading to style drift
- Missing: role="dialog", aria-modal, aria-labelledby, focus management, Escape key, scroll lock
- Uses bg-black/50 (vs Modal's bg-black/75), bg-gray-800 surface (vs Modal's bg-gray-900)
- Recommendation: Refactor to use Modal.tsx as base component

## Button.tsx — Accessibility Gap

- All variants missing `focus-visible:ring-2 focus-visible:ring-offset-2` — keyboard users get no focus indicator
- This is a WCAG 2.1 SC 1.4.11 (Non-text Contrast) and SC 2.4.7 (Focus Visible) concern
