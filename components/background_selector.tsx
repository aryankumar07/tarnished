'use client'
import { getbackground } from "../lib/getBackground"
import { useDetectMouseMove } from "../hooks/useDetectMouseMove"
import { isProduction } from "../lib/env"
import { Particles } from "./particleBackground"
import React, { useMemo } from 'react'

export const BackgroundSelector = ({
  children
}: {
  children?: React.ReactNode
}) => {

  const BackGroundElement = useMemo(() => getbackground(), [])
  const { idle } = useDetectMouseMove()
  const isproduction = isProduction()

  const showIdleBackground = idle && isproduction

  return (
    <div className="relative w-full">
      {/* Default background layer - always rendered, visibility controlled by CSS */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: showIdleBackground ? 0 : 1, pointerEvents: showIdleBackground ? 'none' : 'auto' }}
      >
        <BackGroundElement>
          <div className="invisible">{/* Placeholder to maintain BackGroundElement structure */}</div>
        </BackGroundElement>
      </div>

      {/* Idle background layer - always rendered, visibility controlled by CSS */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: showIdleBackground ? 1 : 0, pointerEvents: showIdleBackground ? 'auto' : 'none' }}
      >
        <Particles
          className="absolute inset-0"
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
