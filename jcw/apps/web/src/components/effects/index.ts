// Effects Components Export
export { default as AnimatedSection } from './AnimatedSection';
export { default as HoverEffect } from './HoverEffect';
export { default as ParallaxEffect } from './ParallaxEffect';
export { default as LoadingEffect } from './LoadingEffect';
export { default as ClickEffect } from './ClickEffect';
export { default as ParticleNetwork } from './ParticleNetwork';
export { default as ParticleHeader } from './ParticleHeader';

// Effect Types
export type AnimationType = 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'bounceIn';
export type HoverEffectType = 'lift' | 'glow' | 'rotate' | 'scale' | 'bounce' | 'shake';
export type ClickEffectType = 'ripple' | 'pulse' | 'bounce' | 'shake' | 'glow';
export type LoadingEffectType = 'fade' | 'slide' | 'scale' | 'blur';
export type EffectIntensity = 'light' | 'medium' | 'strong';