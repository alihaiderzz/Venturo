import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function PricingFAQ() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="cancel" className="border rounded-lg px-4 md:px-6">
              <AccordionTrigger className="text-left text-sm md:text-base">Can I cancel anytime?</AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                Yes, cancel anytime. Access continues until the end of your current period.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payments" className="border rounded-lg px-4 md:px-6">
              <AccordionTrigger className="text-left text-sm md:text-base">
                Do you process payments or manage equity?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                No. Venturo is a networking/showcase platform only. All negotiations, payments, and equity arrangements
                occur privately between users.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="licensed" className="border rounded-lg px-4 md:px-6">
              <AccordionTrigger className="text-left text-sm md:text-base">
                Are you licensed to offer financial services?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                No. Venturo does not hold an AFSL and does not provide financial or legal advice.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="boosting" className="border rounded-lg px-4 md:px-6">
              <AccordionTrigger className="text-left text-sm md:text-base">
                Is Boosting guaranteed to increase investors?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                No. Boosts improve visibility, not outcomes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="refunds" className="border rounded-lg px-4 md:px-6">
              <AccordionTrigger className="text-left text-sm md:text-base">What's your refund policy?</AccordionTrigger>
              <AccordionContent className="text-sm md:text-base">
                As a default, subscriptions are non-refundable once a period starts. We handle exceptions via support on
                a case-by-case basis.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
