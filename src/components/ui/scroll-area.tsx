
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    type?: "auto" | "always" | "scroll" | "hover";
    scrollbars?: "vertical" | "horizontal" | "both";
  }
>(({ className, children, type = "hover", scrollbars = "both", ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    type={type}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    
    {(scrollbars === "vertical" || scrollbars === "both") && (
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className="flex select-none touch-none p-0.5 transition-colors duration-150 ease-out data-[state=visible]:bg-secondary/30 w-2.5 hover:w-3"
      >
        <ScrollAreaPrimitive.Thumb 
          className="relative flex-1 rounded-full bg-secondary-foreground/30 hover:bg-secondary-foreground/50 dark:bg-blue-500/30 dark:hover:bg-blue-500/50 transition-colors" 
        />
      </ScrollAreaPrimitive.Scrollbar>
    )}
    
    {(scrollbars === "horizontal" || scrollbars === "both") && (
      <ScrollAreaPrimitive.Scrollbar
        orientation="horizontal"
        className="flex select-none touch-none p-0.5 transition-colors duration-150 ease-out data-[state=visible]:bg-secondary/30 h-2.5 hover:h-3"
      >
        <ScrollAreaPrimitive.Thumb 
          className="relative flex-1 rounded-full bg-secondary-foreground/30 hover:bg-secondary-foreground/50 dark:bg-blue-500/30 dark:hover:bg-blue-500/50 transition-colors" 
        />
      </ScrollAreaPrimitive.Scrollbar>
    )}
    
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
