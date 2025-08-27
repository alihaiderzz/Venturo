import { Check, X } from "lucide-react"

export function ComparisonTable() {
  return (
    <section className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Plan Comparison</h2>
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="min-w-[600px]">
            <table className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 md:p-4 font-medium text-sm md:text-base">Features</th>
                  <th className="text-center p-3 md:p-4 font-medium text-sm md:text-base">Free</th>
                  <th className="text-center p-3 md:p-4 font-medium bg-[#0B1E3C]/5 text-sm md:text-base">Pro</th>
                  <th className="text-center p-3 md:p-4 font-medium text-sm md:text-base">Premium</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                <tr className="border-b">
                  <td className="p-3 md:p-4">Active listings</td>
                  <td className="text-center p-3 md:p-4">1</td>
                  <td className="text-center p-3 md:p-4 bg-[#0B1E3C]/5">3</td>
                  <td className="text-center p-3 md:p-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 md:p-4">Priority exposure</td>
                  <td className="text-center p-3 md:p-4">
                    <X className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground mx-auto" />
                  </td>
                  <td className="text-center p-3 md:p-4 bg-[#0B1E3C]/5">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-[#21C087] mx-auto" />
                  </td>
                  <td className="text-center p-3 md:p-4">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-[#21C087] mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 md:p-4">Boost discount</td>
                  <td className="text-center p-3 md:p-4">
                    <X className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground mx-auto" />
                  </td>
                  <td className="text-center p-3 md:p-4 bg-[#0B1E3C]/5">20%</td>
                  <td className="text-center p-3 md:p-4">30%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 md:p-4">AI Pitch Copilot credits</td>
                  <td className="text-center p-3 md:p-4">3</td>
                  <td className="text-center p-3 md:p-4 bg-[#0B1E3C]/5">30</td>
                  <td className="text-center p-3 md:p-4">50</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 md:p-4">Listing analytics</td>
                  <td className="text-center p-3 md:p-4">
                    <X className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground mx-auto" />
                  </td>
                  <td className="text-center p-3 md:p-4 bg-[#0B1E3C]/5">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-[#21C087] mx-auto" />
                  </td>
                  <td className="text-center p-3 md:p-4">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-[#21C087] mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 md:p-4">Advanced filters</td>
                  <td className="text-center p-3 md:p-4">
                    <X className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground mx-auto" />
                  </td>
                  <td className="text-center p-3 md:p-4 bg-[#0B1E3C]/5">
                    <X className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground mx-auto" />
                  </td>
                  <td className="text-center p-3 md:p-4">
                    <Check className="h-3 w-3 md:h-4 md:w-4 text-[#21C087] mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 md:p-4">Intro credits</td>
                  <td className="text-center p-3 md:p-4">
                    <X className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground mx-auto" />
                  </td>
                  <td className="text-center p-3 md:p-4 bg-[#0B1E3C]/5">
                    <X className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground mx-auto" />
                  </td>
                  <td className="text-center p-3 md:p-4">5 / mo</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 md:p-4">Events</td>
                  <td className="text-center p-3 md:p-4">Basic RSVP</td>
                  <td className="text-center p-3 md:p-4 bg-[#0B1E3C]/5">Early access</td>
                  <td className="text-center p-3 md:p-4">Invites + Early access</td>
                </tr>
                <tr>
                  <td className="p-3 md:p-4">Support</td>
                  <td className="text-center p-3 md:p-4">72h</td>
                  <td className="text-center p-3 md:p-4 bg-[#0B1E3C]/5">24–48h</td>
                  <td className="text-center p-3 md:p-4">24–48h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
