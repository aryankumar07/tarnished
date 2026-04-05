'use client'
import { getbackground } from "../lib/getBackground"
import { useDetectMouseMove } from "../hooks/useDetectMouseMove"
import { isProduction } from "../lib/env"
import { Particles } from "./particleBackground"
import BackgroundTree from "../sunny"
import React, { useMemo } from 'react'
import { useTheme } from 'next-themes'

export const BackgroundSelector = ({
  children
}: {
  children?: React.ReactNode
}) => {

  const BackGroundElement = useMemo(() => getbackground(), [])
  const { idle } = useDetectMouseMove()
  const isproduction = isProduction()
  const { theme } = useTheme()

  const isSunny = theme === 'sunny'
  const showIdleBackground = idle && isproduction && !isSunny

  return (
    <div className="relative min-h-screen w-full">
      {/* Default pattern background layer */}
      <div
        className="fixed inset-0 transition-opacity duration-500"
        style={{ opacity: (showIdleBackground || isSunny) ? 0 : 1, pointerEvents: (showIdleBackground || isSunny) ? 'none' : 'auto' }}
      >
        <BackGroundElement>
          <div className="invisible">{/* Placeholder to maintain BackGroundElement structure */}</div>
        </BackGroundElement>
      </div>

      {/* Sunny background layer - on top of everything */}
      <div
        className="fixed inset-0 transition-opacity duration-500"
        style={{ opacity: isSunny ? 1 : 0, pointerEvents: 'none', zIndex: 50 }}
      >
        {isSunny && (
          <BackgroundTree
            transparent={true}
            backgroundColor="#e8e4e0"
            branchCount={8}
            branchWidth={1}
            shadowOpacity={1.9}
            windStrength={4.3}
            windSpeed={2}
            position="top-left"
          />
        )}
      </div>

      {/* Idle background layer */}
      <div
        className="fixed inset-0 transition-opacity duration-500"
        style={{ opacity: showIdleBackground ? 1 : 0, pointerEvents: showIdleBackground ? 'auto' : 'none' }}
      >
        <Particles
          className="fixed inset-0"
          quantity={200}
          ease={50}
          color={'#000000'}
          refresh={false}
        />
      </div>

      {/* Content layer - always mounted, never remounts */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
