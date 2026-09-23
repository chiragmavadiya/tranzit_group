// clarity.ts

import Clarity from "@microsoft/clarity";

const PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;
let initialized = false;

export const initClarity = () => {
  if (!PROJECT_ID) return;

  Clarity.init(PROJECT_ID);
  initialized = true;
};

export const identifyUser = (id: string, name?: string) => {
  if (!initialized) return;

  Clarity.identify(id, undefined, undefined, name);
};

export const trackEvent = (event: string) => {
  if (!initialized) return;

  Clarity.event(event);
};

export const setTag = (key: string, value: string) => {
  if (!initialized) return;

  Clarity.setTag(key, value);
};