"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Share2, Copy, Twitter, Facebook, Linkedin, Instagram, Check } from "lucide-react"

interface ShareButtonProps {
  ideaId: string
  ideaTitle: string
  ideaDescription?: string
}

export function ShareButton({ ideaId, ideaTitle, ideaDescription }: ShareButtonProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/idea/${ideaId}`
  const shareText = `Check out this startup idea: ${ideaTitle}`
  const fullShareText = `${shareText} - ${ideaDescription || ''}`.substring(0, 200) + (ideaDescription && ideaDescription.length > 200 ? '...' : '')

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "The idea link has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  const handleSocialShare = (platform: string) => {
    let url = ""
    
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case "instagram":
        // Instagram doesn't support direct URL sharing, so we copy the link and show instructions
        handleCopyLink()
        toast({
          title: "Link copied for Instagram!",
          description: "Paste this link in your Instagram story or post caption.",
        })
        return
      default:
        return
    }
    
    window.open(url, "_blank", "width=600,height=400")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-11 min-h-11" aria-label="Share idea">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare("twitter")} className="cursor-pointer">
          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare("facebook")} className="cursor-pointer">
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare("linkedin")} className="cursor-pointer">
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSocialShare("instagram")} className="cursor-pointer">
          <Instagram className="h-4 w-4 mr-2 text-pink-600" />
          Share on Instagram
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
