import * as React from "react";
import { cn } from "@/lib/utils"; // Utility function for merging class names

// Card component that serves as the main container
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-2xl border bg-card text-card-foreground shadow-sm", className)} // Combine default and custom classes
    {...props} // Spread additional props
  />
));
Card.displayName = "Card"; // Set display name for easier debugging

// CardHeader component for the header section of the card
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)} // Flex column layout with spacing
    {...props}
  />
));
CardHeader.displayName = "CardHeader"; // Set display name

// CardTitle component for the card's title
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)} // Title styling
    {...props}
  />
));
CardTitle.displayName = "CardTitle"; // Set display name

// CardDescription component for additional text or description
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)} // Description styling
    {...props}
  />
));
CardDescription.displayName = "CardDescription"; // Set display name

// CardContent component for the main content area of the card
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} /> // Padding for content
));
CardContent.displayName = "CardContent"; // Set display name

// CardFooter component for the footer section of the card
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)} // Flex container for footer content
    {...props}
  />
));
CardFooter.displayName = "CardFooter"; // Set display name

// Exporting all components for use in other parts of the application
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
