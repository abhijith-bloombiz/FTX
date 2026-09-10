/**
 * FTX Premium Motion System - Constants & Tokens
 */

export const MOTION_EASING = {
    DEFAULT: "cubic-bezier(0.22, 1, 0.36, 1)",
    UI: "cubic-bezier(0.4, 0, 0.2, 1)",
    CINEMATIC: "cubic-bezier(0.16, 1, 0.3, 1)",
    SMOOTH: "cubic-bezier(0.25, 1, 0.5, 1)",
} as const;

export const MOTION_DURATION = {
    MICRO: 150,     // Level 1: Buttons, icons, links (120-200ms)
    INTERACTION: 300, // Level 2: Cards, menus, modals (250-500ms)
    STORYTELLING: 700, // Level 3: Section reveals, images (600-900ms)
    CINEMATIC: 1200,   // Level 4: Hero, loader (900-1500ms)
} as const;

export const STAGGER_PRESETS = {
    FAST: 60,
    NORMAL: 100,
    EDITORIAL: 140,
    MAX: 300,
} as const;

export const LENIS_CONFIG = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical" as const,
    gestureOrientation: "vertical" as const,
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.0,
    syncTouch: false,
    infinite: false,
};
