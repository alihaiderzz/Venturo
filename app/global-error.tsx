'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Something went wrong!</h2>
            <p className="text-muted-foreground">
              We encountered an unexpected error. Please try again.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => reset()}>
                Try again
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Go home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
