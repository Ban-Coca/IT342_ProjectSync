import { cn } from "@/lib/utils"

export function Loading({
  variant = "spinner",
  size = "md",
  text,
  textPosition = "right",
  fullscreen = false,
  className,
}) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
    "2xl": "w-16 h-16",
  }

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
    "2xl": "text-xl",
  }

  const renderLoadingIndicator = () => {
    switch (variant) {
      case "spinner":
        return (
          <div
            className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", sizeClasses[size])}
          />
        )
      case "dots":
        return (
          <div className="flex space-x-1">
            <div
              className={cn(
                "rounded-full bg-current animate-bounce",
                size === "xs" ? "w-1 h-1" : "",
                size === "sm" ? "w-1.5 h-1.5" : "",
                size === "md" ? "w-2 h-2" : "",
                size === "lg" ? "w-2.5 h-2.5" : "",
                size === "xl" ? "w-3 h-3" : "",
                size === "2xl" ? "w-4 h-4" : "",
              )}
              style={{ animationDelay: "0ms" }}
            />
            <div
              className={cn(
                "rounded-full bg-current animate-bounce",
                size === "xs" ? "w-1 h-1" : "",
                size === "sm" ? "w-1.5 h-1.5" : "",
                size === "md" ? "w-2 h-2" : "",
                size === "lg" ? "w-2.5 h-2.5" : "",
                size === "xl" ? "w-3 h-3" : "",
                size === "2xl" ? "w-4 h-4" : "",
              )}
              style={{ animationDelay: "150ms" }}
            />
            <div
              className={cn(
                "rounded-full bg-current animate-bounce",
                size === "xs" ? "w-1 h-1" : "",
                size === "sm" ? "w-1.5 h-1.5" : "",
                size === "md" ? "w-2 h-2" : "",
                size === "lg" ? "w-2.5 h-2.5" : "",
                size === "xl" ? "w-3 h-3" : "",
                size === "2xl" ? "w-4 h-4" : "",
              )}
              style={{ animationDelay: "300ms" }}
            />
          </div>
        )
      case "pulse":
        return <div className={cn("rounded-full bg-current animate-pulse", sizeClasses[size])} />
      default:
        return null
    }
  }

  const content = (
    <>
      {text && textPosition === "top" && <span className={cn("text-center", textSizeClasses[size])}>{text}</span>}
      <div className="flex items-center">
        {text && textPosition === "left" && <span className={cn("mr-2", textSizeClasses[size])}>{text}</span>}
        {renderLoadingIndicator()}
        {text && textPosition === "right" && <span className={cn("ml-2", textSizeClasses[size])}>{text}</span>}
      </div>
      {text && textPosition === "bottom" && <span className={cn("text-center", textSizeClasses[size])}>{text}</span>}
    </>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center justify-center p-4">{content}</div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex",
        textPosition === "top" || textPosition === "bottom" ? "flex-col" : "flex-row",
        "items-center",
        className,
      )}
    >
      {content}
    </div>
  )
}
