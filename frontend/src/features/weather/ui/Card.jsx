import React from "react";

const Card = React.forwardRef(({ className="", ...props }, ref) => (
  <div
    ref={ref}
    className={
      `rounded-xl border bg-card text-card-foreground shadow ${className}`
    }
    {...props}
  />
));
Card.displayName = "Card";

export {
  Card
};
