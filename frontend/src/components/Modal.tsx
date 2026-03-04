import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef } from "react";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: ReactNode;
  /** Modal content */
  children?: ReactNode;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Optional footer content */
  footer?: ReactNode;
  /** Optional CSS class for the content area */
  contentClassName?: string;
  /** Optional description for screen readers */
  description?: string;
}

/**
 * Modal
 *
 * A modal dialog component with a 75% dark overlay backdrop.
 * Features focus management, Escape key dismiss, and scroll prevention.
 * Supports optional title, footer, close button, and screen reader descriptions.
 *
 * @example
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
 *   <p>Are you sure?</p>
 * </Modal>
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  footer,
  contentClassName = "",
  description,
  className = "",
  ...props
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    // Store the element that had focus before the modal opened
    previousActiveElement.current = document.activeElement;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Move focus into the dialog
    setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    // Prevent body scroll and apply Escape key listener
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      // Restore focus to the element that triggered the modal
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      {...props}
    >
      {/* Overlay with 75% opacity */}
      <div
        className="absolute inset-0 bg-black/75 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={dialogRef}
        className={`relative z-50 w-full max-w-md mx-4 rounded-lg bg-gray-900 shadow-2xl border border-purple-500/30 opacity-100 scale-100 transition-all duration-200 ${contentClassName}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-purple-500/20 px-6 py-4">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-white"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 text-gray-200 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {description && (
            <p id="modal-description" className="text-sm text-gray-400 mb-4">
              {description}
            </p>
          )}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-purple-500/20 px-6 py-4 flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
