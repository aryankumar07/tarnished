'use client'
import { getbackground } from "../lib/getBackground"
import { useDetectMouseMove } from "../hooks/useDetectMouseMove"
import { ParticleCanvas } from "./particleBackground"
import React from 'react'

export const BackgroundSelector = ({
  children
}: {
  children?: React.ReactNode
}) => {

  const BackGroundElement = getbackground()
  const { idle } = useDetectMouseMove()

  return !idle ? (
    <BackGroundElement>
      <div className="relative z-10">{children}</div>
    </BackGroundElement>
  ) : (
    // parent is relative so canvas (absolute) can size itself to parent's scrollHeight
    <div className="relative w-full">
      <ParticleCanvas
        count={150}
        speedMultiplier={1.2}
        showLines={false}
        bgAlpha={0.15}
        maxLinkDistance={150}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
