export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 lg:pt-28">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            GMT Refund & Return Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Transparency and customer satisfaction are central to our service. This policy explains how we handle
            refunds, returns, cancellations, and credits.
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Last Updated: August 7, 2025</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="prose prose-gray max-w-none">
          {/* Introduction */}
          <div className="bg-card rounded-lg border border-border p-6 sm:p-8 mb-8">
            <p className="text-foreground leading-relaxed">
              At GMT, transparency and customer satisfaction are central to our service. This policy explains how we
              handle refunds, returns, cancellations, and credits for the various services we provide. Please read
              carefully to understand your rights and our procedures.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">📦</span>
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                Service Categories Covered
              </h2>
              <div className="space-y-4 text-foreground">
                <p className="mb-4">Our services are grouped into the following categories:</p>
                <div className="bg-muted rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-foreground">
                    <li>
                      <strong>a)</strong> Membership Subscription Plans (e.g., Premium GMT Membership)
                    </li>
                    <li>
                      <strong>b)</strong> Shipping, Storage & Documentation Services
                    </li>
                    <li>
                      <strong>c)</strong> Shopping Assistance & Value-Added Services
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">💳</span>
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                Subscription-Based Memberships
              </h2>
              <div className="space-y-6 text-foreground">
                <p>
                  GMT offers paid Premium Membership plans with exclusive features and benefits, available on monthly,
                  quarterly, or yearly terms.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-green-800 flex items-center">
                    <span className="mr-2">✅</span>
                    Refund Eligibility
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-green-700">
                    <li>
                      <strong>Within 7 Days:</strong> Cancel within 7 days of purchase and receive a 100% refund
                    </li>
                    <li>
                      <strong>After 7 Days:</strong> Refunds are processed on a pro-rated basis based on the remaining
                      subscription period
                    </li>
                    <li>
                      <strong>Automatic Renewals:</strong> If auto-renew is enabled, cancellation is also eligible for
                      refunds under the same terms
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-yellow-800 flex items-center">
                    <span className="mr-2">⚠️</span>
                    Note
                  </h4>
                  <p className="text-yellow-700">
                    Refunds cannot exceed the original membership fee. No compensation is provided for indirect costs,
                    damages, or missed opportunities.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-blue-800 flex items-center">
                    <span className="mr-2">💰</span>
                    Refund Method
                  </h4>
                  <p className="text-blue-700">
                    All refunds are issued as account credit by default. If a direct refund (to card/bank) is requested,
                    any transaction fees, exchange rate costs, or penalties incurred will be deducted from the total
                    refund.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">🚚</span>
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                Shipping, Storage & Document Services
              </h2>
              <div className="space-y-4 text-foreground">
                <p>
                  All processing, shipping, document scan-and-email, and storage services are billed at the time of
                  request or during automated processing.
                </p>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-destructive">
                    <li>These services are delivered "as-is"</li>
                    <li>No refunds are issued once processing begins or a shipment is dispatched</li>
                    <li>
                      Service issues related to courier performance (e.g., delays or damages) must be raised with the
                      carrier
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">🛍️</span>
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                Shopping Assistance & Value-Added Services
              </h2>
              <div className="space-y-4 text-foreground">
                <p>If you use GMT's Shopping Assistance (where we purchase on your behalf) or similar services:</p>
                <div className="bg-muted rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-foreground">
                    <li>100% refund is available before processing starts</li>
                    <li>Once fulfillment or payment begins, no cancellations or refunds are possible</li>
                    <li>Orders paused after processing begins are not eligible for refunds</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">🔁</span>
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  5
                </span>
                Merchandise Returns (From Stores)
              </h2>
              <div className="space-y-4 text-foreground">
                <p>
                  GMT acts as your logistics and shopping assistant, not a product retailer. For all merchandise
                  returns:
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-orange-700">
                    <li>Please contact the original seller or online store directly</li>
                    <li>GMT is not responsible for incorrect items, sizes, damages, or unwanted products</li>
                    <li>We do not issue refunds related to product satisfaction or retail return issues</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">🌍</span>
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  6
                </span>
                International Returns & Refusals
              </h2>
              <div className="space-y-4 text-foreground">
                <p>
                  If a package is refused by the recipient or customs clearance fails (due to duties, ID proof, etc.):
                </p>
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <ul className="list-disc list-inside space-y-2 text-foreground">
                    <li>Carriers may return the package to GMT or destroy it (depending on country laws)</li>
                    <li>
                      If returned, carriers treat this as a "3rd-country shipment" and charge a return fee—often higher
                      than original shipping costs
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-red-800">GMT will pass this return fee to the customer by:</h4>
                  <ul className="list-disc list-inside space-y-1 text-red-700 ml-4">
                    <li>Charging the saved payment method, or</li>
                    <li>Deducting from your GMT account balance</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium flex items-center">
                    <span className="mr-2">⚠️</span>
                    <strong>Important:</strong> We highly recommend accepting all packages to avoid these extra charges.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">🔄</span>
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  7
                </span>
                How Refunds Are Issued
              </h2>
              <div className="space-y-4 text-foreground">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-800">Default Method</h4>
                    <p className="text-sm text-blue-700">GMT account credit (usable for future services)</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-green-800">Upon Request</h4>
                    <p className="text-sm text-green-700">Refunds can be issued to your original payment method</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-orange-800">Fee Deduction</h4>
                    <p className="text-sm text-orange-700">
                      Financial charges (e.g., transaction or currency fees) will be deducted from the refund amount
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Contact Section */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 sm:p-8 mt-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
              <span className="text-2xl mr-3">📫</span>
              Contact for Refund or Return Issues
            </h2>
            <p className="text-foreground mb-4">
              If you need help with cancellations, refunds, or account credits, please contact our support team:
            </p>
            <div className="space-y-2">
              <p className="text-foreground font-medium">GMT Support Team</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <a
                  href="mailto:support@getmethis.world"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  📧 support@getmethis.world
                </a>
                <a
                  href="https://getmethis.world"
                  className="text-primary hover:text-primary/80 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🌐 getmethis.world
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
