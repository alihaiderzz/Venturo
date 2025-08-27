"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Palette, DollarSign, Check } from "lucide-react"

interface UserRoleSelectorProps {
  onRoleSelect: (role: 'founder' | 'creator' | 'backer') => void
  onSkip?: () => void
}

const roles = [
  {
    id: 'founder',
    title: 'Founder',
    description: 'I have a startup idea and need collaborators, mentors, or funding',
    icon: Rocket,
    color: '#21C087',
    features: [
      'Showcase your startup idea',
      'Find co-founders and team members',
      'Connect with mentors and advisors',
      'Access to funding opportunities',
      'Network with other founders'
    ]
  },
  {
    id: 'creator',
    title: 'Creator',
    description: 'I have skills to offer and want to join exciting projects',
    icon: Palette,
    color: '#F5B800',
    features: [
      'Offer your skills for equity or paid work',
      'Join exciting startup projects',
      'Build your portfolio',
      'Network with founders',
      'Find mentorship opportunities'
    ]
  },
  {
    id: 'backer',
    title: 'Backer',
    description: 'I want to invest in or support promising startups',
    icon: DollarSign,
    color: '#0B1E3C',
    features: [
      'Discover promising startups early',
      'Invest in innovative ideas',
      'Mentor founders',
      'Access exclusive opportunities',
      'Build your investment portfolio'
    ]
  }
]

export function UserRoleSelector({ onRoleSelect, onSkip }: UserRoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole as 'founder' | 'creator' | 'backer')
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0B1E3C] mb-2">Welcome to Venturo!</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us personalize your experience by telling us how you'd like to use Venturo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => (
            <Card 
              key={role.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRole === role.id 
                  ? 'ring-2 ring-[#21C087] shadow-lg' 
                  : 'hover:border-[#21C087]/50'
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" 
                     style={{ backgroundColor: `${role.color}20` }}>
                  <role.icon className="h-8 w-8" style={{ color: role.color }} />
                </div>
                <CardTitle className="text-xl text-[#0B1E3C]">{role.title}</CardTitle>
                <CardDescription className="text-sm">{role.description}</CardDescription>
                {selectedRole === role.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-[#21C087] rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0" 
                           style={{ backgroundColor: role.color }} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRole}
            className="bg-[#21C087] hover:bg-[#1a9f6f] text-white px-8 py-3 text-lg"
          >
            Continue
          </Button>
          {onSkip && (
            <Button 
              variant="outline" 
              onClick={onSkip}
              className="border-[#0B1E3C] text-[#0B1E3C] hover:bg-[#0B1E3C] hover:text-white px-8 py-3 text-lg"
            >
              Skip for now
            </Button>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            You can change your role anytime in your profile settings
          </p>
        </div>
      </div>
    </div>
  )
}
