import type { HTMLAttributes, ReactNode } from "react";

interface ExampleComponentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Descriptive text about the component purpose
   */
  title?: string;

  /**
   * Optional variant for different styles
   */
  variant?: "primary" | "secondary" | "neutral";

  /**
   * Optional size prop
   */
  size?: "sm" | "md" | "lg";

  /**
   * Component content
   */
  children?: ReactNode;
}

/**
 * ExampleComponent
 *
 * A reusable component that demonstrates the project's component pattern.
 * Uses TypeScript for type safety and Tailwind CSS for styling.
 *
 * @example
 * <ExampleComponent title="Hello" variant="primary">
 *   Component content
 * </ExampleComponent>
 */
export default function ExampleComponent({
  title,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ExampleComponentProps) {
  // Define style mappings for variants and sizes
  const variantStyles = {
    primary: "bg-purple-600 text-white",
    secondary: "bg-cyan-600 text-white",
    neutral: "bg-gray-700 text-gray-100",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <div
      className={`
        rounded-lg border border-gray-600
        transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {title && <div className="font-semibold mb-2">{title}</div>}
      {children}
    </div>
  );
}
