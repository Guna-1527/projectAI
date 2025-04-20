"use client";

import * as React from "react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode;
}

const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({className, children, ...props}, ref) => {
    return (
      <pre
        ref={ref}
        className={`bg-secondary rounded-md p-4 font-mono text-sm text-secondary-foreground whitespace-pre-wrap ${className}`}
        {...props}
      >
        <code>{children}</code>
      </pre>
    );
  }
);

CodeBlock.displayName = "CodeBlock";

export {CodeBlock};
