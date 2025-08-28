"use client"

import { ShareButton } from "./ShareButton"

interface ShareButtonWrapperProps {
  ideaId: string
  ideaTitle: string
  ideaDescription?: string
}

export function ShareButtonWrapper({ ideaId, ideaTitle, ideaDescription }: ShareButtonWrapperProps) {
  return (
    <ShareButton 
      ideaId={ideaId} 
      ideaTitle={ideaTitle} 
      ideaDescription={ideaDescription}
    />
  )
}
