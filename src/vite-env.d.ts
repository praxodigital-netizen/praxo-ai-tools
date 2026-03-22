/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  Razorpay: any;
}

export {};
