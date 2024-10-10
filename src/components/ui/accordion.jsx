import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react"; // Importing an icon for the accordion trigger
import { cn } from "@/lib/utils"; // Utility function for conditional class names

// Accordion is the root component from Radix UI Accordion
const Accordion = AccordionPrimitive.Root;

// AccordionItem is a single item in the accordion, wrapped in forwardRef for flexibility
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      // Styling: adding border, background color, and hover effects
      "border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200 rounded-lg shadow-sm",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem"; // Defining display name for easier debugging

// AccordionTrigger is the clickable header that toggles open/close state
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Flexbox alignment, padding, font styling, and color transition on hover
        "flex flex-1 items-center justify-between py-4 px-4 text-lg font-semibold text-gray-700 transition-all hover:text-blue-600 [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children} {/* This renders the trigger text (accordion header) */}
      <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300" /> {/* Icon that rotates when the accordion is open */}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName; // Reusing Radix's display name

// AccordionContent is the collapsible content section that reveals when the accordion item is open
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-gray-600 bg-gray-50 rounded-lg transition-all duration-300 ease-in-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("py-4 px-4", className)}>
      {children} {/* This renders the content inside the accordion */}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName; // Defining display name for easier debugging

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }; // Exporting all components for use
