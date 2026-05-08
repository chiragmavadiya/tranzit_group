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
  placement = "bottom",
  onlyOnOverflow = undefined,
  className = "",
}) => {
  const container = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const vertical = false

  const handleVisibleChange = (_visible: boolean) => {
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
    <div
      ref={container}
      className={`block min-w-0 max-w-full truncate ${className}`.trim()}
    >
      {children}
    </div>
  );

  return (
    <Tooltip onOpenChange={handleVisibleChange} open={visible} defaultOpen={visible}>
      <TooltipTrigger
        render={<div />}
        className="block min-w-0 max-w-full cursor-pointer"
      >
        {onlyOnOverflow ? content : children}
      </TooltipTrigger>
      <TooltipContent side={placement}>{title}</TooltipContent>
    </Tooltip>
  );
};

// export default CustomTooltip;
