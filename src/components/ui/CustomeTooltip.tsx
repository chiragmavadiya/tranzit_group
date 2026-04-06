"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

type Placement = "top" | "bottom" | "left" | "right";

interface CustomTooltipProps {
  children: React.ReactNode;
  title: React.ReactNode;
  placement?: Placement;
  onlyOnOverflow?: boolean;
  className?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  children,
  title,
  placement = "top",
  onlyOnOverflow = undefined,
  className = "",
}) => {
  const container = React.useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const vertical = false

  const handleVisibleChange = (_visible: boolean) => {
    console.log("Tooltip visibility change:", _visible);
    if (onlyOnOverflow === undefined || onlyOnOverflow === false) {
      setVisible(_visible);
      return;
    }
    
    if (container.current && ((!vertical && container.current.clientWidth < container.current.scrollWidth) || (vertical && container.current.clientHeight < container.current.scrollHeight))) {
      setVisible(_visible);
    } else if (container.current && !vertical && container.current.clientWidth === container.current.scrollWidth) {
      setVisible(false);
    }
  };

  const content = (
    <span
      ref={container}
      className={`block min-w-0 max-w-full truncate ${className}`.trim()}
    >
      {children}
    </span>
  );

  return (
    <Tooltip onOpenChange={handleVisibleChange} open={visible} defaultOpen={visible}>
      <TooltipTrigger
        render={<span />}
        className="block min-w-0 max-w-full cursor-pointer"
      >
        {content}
      </TooltipTrigger>
      <TooltipContent side={placement}>{title}</TooltipContent>
    </Tooltip>
  );
};
