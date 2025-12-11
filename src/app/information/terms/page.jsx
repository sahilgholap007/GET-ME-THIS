export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 lg:pt-28">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">GMT Terms of Use</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Please read these terms carefully before using our services. By accessing GMT, you agree to be bound by
            these terms.
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="prose prose-gray max-w-none">
          {/* Introduction */}
          <div className="bg-card rounded-lg border border-border p-6 sm:p-8 mb-8">
            <p className="text-foreground leading-relaxed mb-4">
              These Terms of Use ("Terms" or "Agreement") govern your access to and use of the GMT (the
              "getmethis.world") and any services or products offered through it. By using our GMT, you are deemed to
              have read, understood, and agreed to these Terms, including our Privacy Policy and other relevant notices.
              If you do not agree, please discontinue your use immediately.
            </p>
            <p className="text-foreground leading-relaxed">
              GMT reserves the right to update or modify these Terms at any time without prior notice. The most current
              version of the Terms will always be available on our GMT. Continued use of the GMT after changes implies
              your acceptance.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                Intellectual Property
              </h2>
              <div className="space-y-4 text-foreground">
                <p>
                  All images, content, code, logos, trademarks, graphics, text, and designs on this Website are the
                  exclusive property of GMT and are protected by applicable copyright and intellectual property laws.
                  You may not use or reproduce any material without prior written consent from GMT.
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-2">You agree not to:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Reproduce, modify, publish, or distribute any Website content for commercial use</li>
                    <li>Remove or alter any proprietary notices</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                User Conduct
              </h2>
              <div className="space-y-4 text-foreground">
                <p>
                  By submitting material to GMT (e.g. reviews, comments, inquiries), you retain ownership but grant GMT
                  a worldwide, non-exclusive, royalty-free license to use, distribute, and display such content. This
                  license is irrevocable and perpetual.
                </p>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-destructive">You must not:</h4>
                  <ul className="list-disc list-inside space-y-1 text-destructive">
                    <li>Use the site in a way that disrupts its operation</li>
                    <li>Upload or transmit harmful code, malware, or spam</li>
                    <li>Engage in any unlawful, fraudulent, or abusive behavior</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  We reserve the right to cooperate with law enforcement in case of any breach.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                Security & Restrictions
              </h2>
              <div className="space-y-4 text-foreground">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-destructive">You agree not to:</h4>
                  <ul className="list-disc list-inside space-y-1 text-destructive">
                    <li>Use bots, spiders, scrapers, or automated methods to access the Website</li>
                    <li>Hack, disable, or attempt unauthorized access to systems or data</li>
                    <li>Introduce viruses, worms, trojans, or other malicious software</li>
                  </ul>
                </div>
                <p className="text-sm font-medium">
                  Violations will result in immediate termination of access and may involve legal action.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                Third-Party Content & Links
              </h2>
              <p className="text-foreground">
                GMT may link to or feature third-party content for convenience. We are not responsible for and do not
                endorse the accuracy or legality of such content. You access third-party sites at your own risk.
              </p>
            </section>

            {/* Section 5 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  5
                </span>
                Eligibility
              </h2>
              <div className="space-y-4 text-foreground">
                <p>
                  By using this Website, you confirm you are at least 13 years of age. Users between 13–18 years should
                  use the platform under parental supervision.
                </p>
                <p className="text-sm text-muted-foreground">
                  Certain services may have additional eligibility or age restrictions.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  6
                </span>
                Account Registration
              </h2>
              <div className="space-y-4 text-foreground">
                <p>
                  To access full GMT services, you must create an account and provide accurate information. You are
                  responsible for maintaining the confidentiality of your login credentials.
                </p>
                <p>
                  You must notify GMT of any unauthorized use of your account. We reserve the right to disable accounts
                  that violate these Terms or appear fraudulent.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  7
                </span>
                Services & Charges
              </h2>
              <div className="space-y-4 text-foreground">
                <p>
                  All prices and service fees are subject to change without notice. Although we aim for accuracy, errors
                  may occur, and GMT reserves the right to correct them.
                </p>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    Estimates provided by GMT's shipping tools are based on user input and do not guarantee final
                    pricing, as actual shipping costs may vary due to:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Carrier rate changes</li>
                    <li>Currency fluctuations</li>
                    <li>Package weight/size discrepancies</li>
                    <li>Local taxes or clearance fees</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  8
                </span>
                Prohibited Items
              </h2>
              <div className="space-y-4 text-foreground">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-destructive">GMT prohibits the shipment of:</h4>
                  <ul className="list-disc list-inside space-y-1 text-destructive">
                    <li>Hazardous or flammable goods</li>
                    <li>Weapons or ammunition</li>
                    <li>Controlled substances</li>
                    <li>Counterfeit or illegal items</li>
                    <li>Perishables, live animals, and similar restricted goods</li>
                  </ul>
                </div>
                <p className="text-sm font-medium">
                  Violation of this policy may result in seizure, disposal, or legal reporting, and GMT assumes no
                  liability.
                </p>
              </div>
            </section>

            {/* Remaining sections in a more compact format */}
            <div className="grid gap-6 md:grid-cols-2">
              <section className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold mr-2">
                    9
                  </span>
                  Indemnification
                </h2>
                <p className="text-sm text-foreground">
                  You agree to indemnify, defend, and hold harmless GMT, its employees, directors, partners, and
                  affiliates from any claims, damages, liabilities, and legal fees arising from your use of the Website
                  or violation of these Terms.
                </p>
              </section>

              <section className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold mr-2">
                    10
                  </span>
                  Disclaimer of Warranties
                </h2>
                <p className="text-sm text-foreground mb-3">
                  The GMT Website is provided "as is" and "as available." We make no warranties of any kind.
                </p>
                <p className="text-xs text-muted-foreground">
                  You are responsible for virus-checking any downloaded content using up-to-date software.
                </p>
              </section>

              <section className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold mr-2">
                    11
                  </span>
                  Limitation of Liability
                </h2>
                <p className="text-sm text-foreground">
                  To the maximum extent allowed by law, GMT shall not be liable for loss of profit, revenue, data, or
                  business. In no case shall GMT's liability exceed USD $100 per incident.
                </p>
              </section>

              <section className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold mr-2">
                    12
                  </span>
                  Termination of Access
                </h2>
                <p className="text-sm text-foreground">
                  GMT may suspend or terminate your access to the Website at any time and for any reason, including
                  violation of these Terms, without notice.
                </p>
              </section>
            </div>

            {/* Final sections */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  15
                </span>
                Jurisdiction and Governing Law
              </h2>
              <div className="space-y-4 text-foreground">
                <p>
                  These Terms are governed by the laws of [Insert Jurisdiction, e.g., State of Delaware or relevant GMT
                  HQ country]. Any disputes shall be subject to the exclusive jurisdiction of its courts.
                </p>
                <p className="text-sm text-muted-foreground">
                  You agree to waive any right to a trial by jury in any action arising under these Terms.
                </p>
              </div>
            </section>
          </div>

          {/* Contact Section */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 sm:p-8 mt-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-foreground mb-4">
              If you have questions about these Terms or require assistance, please contact:
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
