'use client'
import { getbackground } from "../lib/getBackground"
import { useDetectMouseMove } from "../hooks/useDetectMouseMove"
import { isProduction } from "../lib/env"
import { Particles } from "./particleBackground"
import React, { useCallback } from 'react'

export const BackgroundSelector = ({
  children
}: {
  children?: React.ReactNode
}) => {

  const BackGroundElement = useCallback(getbackground(), [])
  const { idle } = useDetectMouseMove()
  const isproduction = isProduction()

  return !idle || !isproduction ? (
    <BackGroundElement>
      <div className="relative z-10">{children}</div>
    </BackGroundElement>
  ) : (
    <div className="relative w-full">
      <Particles
        className="absolute inset-0"
        quantity={200}
        ease={50}
        color={'#000000'}
        refresh
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
