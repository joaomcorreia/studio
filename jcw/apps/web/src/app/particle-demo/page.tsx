'use client';

import React from 'react';
import { ParticleNetwork, ParticleHeader, AnimatedSection } from '../../components/effects';

export default function ParticleDemo() {
  return (
    <div>
      {/* Full Screen Particle Header */}
      <ParticleHeader height="100vh" particleCount={80}>
        <div className="flex items-center justify-center h-full text-center">
          <AnimatedSection animation="fadeIn" duration={1}>
            <div className="text-white max-w-4xl px-8">
              <h1 className="text-6xl font-bold mb-6">
                🌟 PARTICLES
              </h1>
              <p className="text-2xl mb-8 opacity-90">
                Interactive Network Animation
              </p>
              <div className="text-lg space-y-2 opacity-80">
                <p>✨ Move your mouse around to interact with particles</p>
                <p>🔗 Watch the dynamic connections form and break</p>
                <p>🎨 Beautiful gradient colors and glow effects</p>
                <p>📱 Fully responsive and performance optimized</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </ParticleHeader>

      {/* Particle Variations */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-8">
          <AnimatedSection animation="slideUp">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              🎛️ Particle Variations
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dense Network */}
            <AnimatedSection animation="slideUp" delay={0.2}>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Dense Network</h3>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <ParticleNetwork 
                    particleCount={120}
                    connectionDistance={80}
                    particleSpeed={0.2}
                    colors={['#3B82F6', '#8B5CF6', '#EC4899']}
                  />
                </div>
                <p className="mt-4 text-gray-600">
                  High particle count with shorter connections for a dense, interconnected look.
                </p>
              </div>
            </AnimatedSection>

            {/* Sparse Network */}
            <AnimatedSection animation="slideUp" delay={0.4}>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Sparse Network</h3>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <ParticleNetwork 
                    particleCount={30}
                    connectionDistance={200}
                    particleSpeed={0.8}
                    colors={['#10B981', '#F59E0B', '#EF4444']}
                  />
                </div>
                <p className="mt-4 text-gray-600">
                  Fewer particles with longer connections and faster movement.
                </p>
              </div>
            </AnimatedSection>

            {/* Cool Colors */}
            <AnimatedSection animation="slideUp" delay={0.6}>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Cool Colors</h3>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <ParticleNetwork 
                    particleCount={60}
                    connectionDistance={120}
                    particleSpeed={0.4}
                    colors={['#06B6D4', '#3B82F6', '#8B5CF6', '#6366F1']}
                  />
                </div>
                <p className="mt-4 text-gray-600">
                  Blue and cyan color palette for a cool, tech feel.
                </p>
              </div>
            </AnimatedSection>

            {/* Warm Colors */}
            <AnimatedSection animation="slideUp" delay={0.8}>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Warm Colors</h3>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <ParticleNetwork 
                    particleCount={60}
                    connectionDistance={120}
                    particleSpeed={0.4}
                    colors={['#EF4444', '#F59E0B', '#EC4899', '#F97316']}
                  />
                </div>
                <p className="mt-4 text-gray-600">
                  Red, orange, and pink colors for energy and warmth.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Implementation Info */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">
              🚀 Ready to Use!
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8 text-left">
              <h3 className="text-2xl font-bold mb-4">Features:</h3>
              <ul className="space-y-2 text-lg">
                <li>✅ <strong>No Three.js needed</strong> - Pure Canvas/JavaScript</li>
                <li>✅ <strong>Mouse interaction</strong> - Particles follow your cursor</li>
                <li>✅ <strong>Dynamic connections</strong> - Lines form and break in real-time</li>
                <li>✅ <strong>Customizable</strong> - Colors, speed, density, connection distance</li>
                <li>✅ <strong>Performance optimized</strong> - Smooth 60fps animation</li>
                <li>✅ <strong>Responsive</strong> - Works on all screen sizes</li>
                <li>✅ <strong>Accessible</strong> - Doesn't interfere with page content</li>
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}