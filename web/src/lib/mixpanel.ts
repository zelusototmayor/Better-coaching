'use client';

import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '';

let initialized = false;

export const initMixpanel = () => {
  if (initialized || !MIXPANEL_TOKEN || typeof window === 'undefined') return;
  
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage',
    api_host: 'https://api-eu.mixpanel.com',
  });
  
  initialized = true;
};

export const trackEvent = (event: string, properties?: Record<string, unknown>) => {
  if (!initialized) return;
  mixpanel.track(event, properties);
};

export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  if (!initialized) return;
  mixpanel.identify(userId);
  if (properties) {
    mixpanel.people.set(properties);
  }
};

export const resetUser = () => {
  if (!initialized) return;
  mixpanel.reset();
};

export { mixpanel };
