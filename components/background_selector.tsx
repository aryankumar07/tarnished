'use client'
import { getbackground } from "../lib/getBackground"
import { useDetectMouseMove } from "../hooks/useDetectMouseMove"
import SnowParticleBackground from "./particleBackground"
import React from 'react'
import { isDevelopment } from "../lib/env"


export const BackgroundSelector = ({
  children
}: {
  children?: React.ReactNode
}) => {

  const BackGroundElement = getbackground()
  const { idle } = useDetectMouseMove()
  const isdevelopment = isDevelopment()

  return !idle || isdevelopment ? (
    <BackGroundElement>
      <div className="relative z-10">{children}</div>
    </BackGroundElement>
  ) : (
    <>
      <SnowParticleBackground />
      {children}
    </>
  )


}
