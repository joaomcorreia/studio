'use client';

import React, { useState } from 'react';
import { AnimatedSection, HoverEffect, ParallaxEffect, LoadingEffect, ClickEffect } from '../../../components/effects';

export default function EffectsDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <AnimatedSection animation="fadeIn" duration={1}>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              🎨 React Effects Showcase
            </h1>
            <p className="text-xl text-gray-600">
              Choose your favorite animations for your website!
            </p>
          </div>
        </AnimatedSection>

        {/* Animation Types */}
        <AnimatedSection animation="slideUp" delay={0.2}>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">✨ Animation Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <AnimatedSection animation="fadeIn" delay={0.1}>
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Fade In</h3>
                  <p className="text-gray-600">Smooth opacity transition</p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slideUp" delay={0.2}>
                <div className="p-6 bg-green-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Slide Up</h3>
                  <p className="text-gray-600">Moves from bottom to position</p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="bounceIn" delay={0.3}>
                <div className="p-6 bg-purple-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Bounce In</h3>
                  <p className="text-gray-600">Spring-based entrance</p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slideLeft" delay={0.4}>
                <div className="p-6 bg-yellow-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Slide Left</h3>
                  <p className="text-gray-600">Enters from the right</p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slideRight" delay={0.5}>
                <div className="p-6 bg-pink-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Slide Right</h3>
                  <p className="text-gray-600">Enters from the left</p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="scaleIn" delay={0.6}>
                <div className="p-6 bg-indigo-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Scale In</h3>
                  <p className="text-gray-600">Grows from small to full size</p>
                </div>
              </AnimatedSection>

            </div>
          </div>
        </AnimatedSection>

        {/* Hover Effects */}
        <AnimatedSection animation="slideUp" delay={0.4}>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">🖱️ Hover Effects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <HoverEffect effect="lift" intensity="medium">
                <div className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Lift Effect</h3>
                  <p>Hover to see me rise up!</p>
                </div>
              </HoverEffect>

              <HoverEffect effect="glow" intensity="medium">
                <div className="p-6 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Glow Effect</h3>
                  <p>Hover to see me glow!</p>
                </div>
              </HoverEffect>

              <HoverEffect effect="scale" intensity="medium">
                <div className="p-6 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Scale Effect</h3>
                  <p>Hover to see me grow!</p>
                </div>
              </HoverEffect>

              <HoverEffect effect="rotate" intensity="light">
                <div className="p-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Rotate Effect</h3>
                  <p>Hover to see me spin!</p>
                </div>
              </HoverEffect>

              <HoverEffect effect="bounce" intensity="medium">
                <div className="p-6 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-lg cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Bounce Effect</h3>
                  <p>Hover to see me bounce!</p>
                </div>
              </HoverEffect>

              <HoverEffect effect="shake" intensity="medium">
                <div className="p-6 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Shake Effect</h3>
                  <p>Hover to see me shake!</p>
                </div>
              </HoverEffect>

            </div>
          </div>
        </AnimatedSection>

        {/* Click Effects */}
        <AnimatedSection animation="slideUp" delay={0.6}>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">👆 Click Effects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <ClickEffect effect="ripple">
                <div className="p-6 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white rounded-lg cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Ripple Effect</h3>
                  <p>Click to see ripples!</p>
                </div>
              </ClickEffect>

              <ClickEffect effect="pulse">
                <div className="p-6 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-lg cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Pulse Effect</h3>
                  <p>Click to see me pulse!</p>
                </div>
              </ClickEffect>

              <ClickEffect effect="glow">
                <div className="p-6 bg-gradient-to-r from-violet-400 to-violet-600 text-white rounded-lg cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">Glow Effect</h3>
                  <p>Click to see me glow!</p>
                </div>
              </ClickEffect>

            </div>
          </div>
        </AnimatedSection>

        {/* Loading Effects */}
        <AnimatedSection animation="slideUp" delay={0.8}>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">⏳ Loading Effects</h2>
            <div className="text-center mb-6">
              <button
                onClick={triggerLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Loading Effect
              </button>
            </div>
            <LoadingEffect isLoading={isLoading} effect="fade">
              <div className="p-8 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-lg text-center">
                <h3 className="text-2xl font-semibold mb-2">Content Loaded!</h3>
                <p>This content appears after loading completes</p>
              </div>
            </LoadingEffect>
          </div>
        </AnimatedSection>

        {/* Parallax Effect */}
        <AnimatedSection animation="slideUp" delay={1.0}>
          <div className="bg-white rounded-2xl p-8 shadow-lg overflow-hidden">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">🌊 Parallax Effect</h2>
            <div className="relative h-64 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg overflow-hidden">
              <ParallaxEffect speed={-0.3}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-2xl font-bold mb-2">Scroll to see parallax!</h3>
                    <p>This moves at a different speed than the page</p>
                  </div>
                </div>
              </ParallaxEffect>
            </div>
          </div>
        </AnimatedSection>

        {/* Footer */}
        <AnimatedSection animation="fadeIn" delay={1.2}>
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">
              🎉 These effects are now active on your homepage! 
              <br />
              Scroll back up to see them in action as you navigate.
            </p>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}