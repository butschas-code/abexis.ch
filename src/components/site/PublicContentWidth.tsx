import type { ReactNode } from "react";

/** Same horizontal bounds as the home page (`max-w-[1068px]` + safe-area insets). */
export function PublicContentWidth({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`mx-auto w-full max-w-[1068px] pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] md:px-6 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
