import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Heading1({ className, children, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

function Heading2({ className, children, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn("scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

function Heading3({ className, children, ...props }: ComponentProps<"h3">) {
  return (
    <h3 className={cn("scroll-m-20 text-2xl font-bold tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

function Heading4({ className, children, ...props }: ComponentProps<"h4">) {
  return (
    <h4 className={cn("scroll-m-20 text-xl font-medium tracking-tight", className)} {...props}>
      {children}
    </h4>
  );
}

function Paragraph({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />;
}

function Text({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("leading-7", className)} {...props} />;
}

function Large({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-lg font-medium leading-7", className)} {...props} />;
}

function Small({ className, ...props }: ComponentProps<"small">) {
  return <small className={cn("text-sm font-medium leading-none", className)} {...props} />;
}

function XSmall({ className, ...props }: ComponentProps<"small">) {
  return <small className={cn("text-xs font-medium leading-none", className)} {...props} />;
}

function Blockquote({ className, ...props }: ComponentProps<"blockquote">) {
  return <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props} />;
}

const Typography = {
  H1: Heading1,
  H2: Heading2,
  H3: Heading3,
  H4: Heading4,
  P: Paragraph,
  Blockquote,
  Small,
  XSmall,
  Large,
  Text,
};

export { Typography };
