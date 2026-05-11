import { clsx, type ClassValue } from "clsx"
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge"
import { parse, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export const generateUniqueId = () => {
  return Date.now().toString().slice(-10);
};

export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export function useTraceUpdate(props: any, name?: string) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps: Record<string, any>, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log(`${name} Changed props:`, changedProps);
    }
    prev.current = props;
  });
}


export const convertDateFormat = (
  date: Date | string
) => {
  return format(
    parse(date as string, "dd/MM/yyyy", new Date()),
    "dd-MM-yyyy"
  );
};