import { SignIn } from "@clerk/nextjs"
import { LegalNotice } from "@/components/LegalNotice"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F7F9] to-[#E5E7EB] flex items-center justify-center p-4">
      <div className="mb-6 absolute top-4 left-4">
        <LegalNotice />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0B1E3C] mb-2">Welcome to Venturo</h1>
          <p className="text-[#6B7280]">Sign in to your Venturo account</p>
        </div>
        
        <SignIn 
          appearance={{
            elements: {
              headerTitle: {
                display: 'none', // Hide the default "Sign in" title
              },
              headerSubtitle: {
                display: 'none', // Hide the default subtitle
              },
              card: {
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              },
              formButtonPrimary: {
                backgroundColor: '#21C087',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px',
                padding: '12px 24px',
                '&:hover': {
                  backgroundColor: '#1BA876',
                },
              },
              formFieldInput: {
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '16px',
                padding: '12px 16px',
                color: '#0B1E3C',
                '&:focus': {
                  borderColor: '#21C087',
                  boxShadow: '0 0 0 3px rgba(33, 192, 135, 0.1)',
                },
              },
              formFieldLabel: {
                fontSize: '14px',
                fontWeight: '600',
                color: '#0B1E3C',
              },
              socialButtonsBlockButton: {
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#0B1E3C',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                  borderColor: '#9CA3AF',
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}



