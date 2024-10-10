import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul"; // Importing the Drawer component from the vaul library

import { cn } from "@/lib/utils"; // Utility function for merging class names

// Drawer component that serves as the main container for the drawer
const Drawer = ({ shouldScaleBackground = true, ...props }) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer"; // Set display name for easier debugging

// Aliases for various DrawerPrimitive components
const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

// DrawerOverlay component for the overlay background
const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)} // Full-screen overlay with a semi-transparent background
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName; // Set display name

// DrawerContent component for the main content of the drawer
const DrawerContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className // Styling for drawer content
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" /> {/* Progress indicator */}
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent"; // Set display name

// DrawerHeader component for the header section of the drawer
const DrawerHeader = ({ className, ...props }) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} // Grid layout for header
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader"; // Set display name

// DrawerFooter component for the footer section of the drawer
const DrawerFooter = ({ className, ...props }) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter"; // Set display name

// DrawerTitle component for the title within the drawer
const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)} // Title styling
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName; // Set display name

// DrawerDescription component for descriptive text within the drawer
const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)} // Description styling
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName; // Set display name

// Exporting all components for use in other parts of the application
export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
