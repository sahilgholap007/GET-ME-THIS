export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 lg:pt-28">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">GMT Privacy Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Your privacy is important to us. This policy explains how we collect, use, protect, and share your
            information when you use our website and services.
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
              At GMT, your privacy is important to us. This Privacy Policy explains how we collect, use, protect, and
              share your information when you visit and use our website and services.
            </p>
            <p className="text-foreground leading-relaxed">
              By accessing or using the GMT website (the "getmethis.world"), you agree to the terms of this Privacy
              Policy. If you do not agree, please discontinue use.
            </p>
          </div>

          {/* Privacy Policy Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                Protection of Customer Information
              </h2>
              <div className="space-y-4 text-foreground">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium">
                    🔒 We understand that your privacy matters. GMT will not sell or disclose your personal or
                    confidential information to any third party not directly involved in your transactions—except where
                    required by law or necessary to provide our services.
                  </p>
                </div>

                <p className="mb-4">We collect information about you and your packages to:</p>
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <ul className="list-disc list-inside space-y-1 text-foreground">
                    <li>Deliver services efficiently</li>
                    <li>Communicate updates or promotions</li>
                    <li>Improve our platform and offerings</li>
                    <li>Fulfill legal or contractual obligations</li>
                    <li>Perform trend analysis and pricing studies</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Third-Party Partners:</strong> We may share your information with trusted third-party
                    vendors who assist us in delivering GMT services. These partners are contractually obligated to
                    protect your information and use it only for authorized purposes.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                What Personal Data We Collect
              </h2>
              <div className="space-y-4 text-foreground">
                <p className="mb-4">
                  Personal data is information that can identify you as an individual. GMT may collect the following:
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <ul className="list-disc list-inside space-y-1 text-purple-800">
                    <li>Name and address</li>
                    <li>Email address</li>
                    <li>Telephone number</li>
                    <li>Credit card and payment details</li>
                    <li>Shipping and order history</li>
                    <li>IP address and browser/device information (via cookies)</li>
                  </ul>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-green-800">✅ We Never Sell Your Data</h4>
                    <p className="text-sm text-green-700">
                      We never sell your personal data. Aggregated, non-identifiable data may be used for analytics or
                      business optimization.
                    </p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-orange-800">⚖️ Legal Disclosure</h4>
                    <p className="text-sm text-orange-700">
                      We may disclose information to government agencies or authorities as required by law, customs
                      regulations, or safety protocols.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                Retention of Information
              </h2>
              <div className="space-y-4 text-foreground">
                <p className="mb-4">We retain customer data as long as necessary for:</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Business operations and service continuity</li>
                    <li>Regulatory compliance</li>
                    <li>Proof of delivery, billing, and claims processing</li>
                  </ul>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800">
                    <strong>Data Disposal:</strong> After data is no longer required, it is securely deleted or
                    anonymized.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                Cookies and Tracking Technologies
              </h2>
              <div className="space-y-4 text-foreground">
                <p className="mb-4">
                  Our Website uses cookies and third-party tracking tools to enhance your browsing experience.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2 text-yellow-800">🍪 Cookies help us:</h4>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700">
                    <li>Understand Website traffic and user behavior</li>
                    <li>Customize user experience</li>
                    <li>Enable login and secure access</li>
                    <li>Improve advertising accuracy</li>
                  </ul>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-cyan-800">⚙️ Your Options:</h4>
                  <p className="text-cyan-700 mb-2">
                    You may disable cookies in your browser settings. However, doing so may prevent access to secure or
                    personalized features.
                  </p>
                  <p className="text-cyan-700 text-sm">
                    We also use tools like Google Analytics and similar technologies for usage tracking, analytics, and
                    site performance optimization.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  5
                </span>
                Data Security
              </h2>
              <div className="space-y-4 text-foreground">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800">
                    🔐 GMT implements appropriate physical, electronic, and managerial safeguards to protect your data
                    from loss, misuse, and unauthorized access.
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800">
                    <strong>Important:</strong> However, no system is 100% secure, and we cannot guarantee absolute data
                    security.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    💡 We encourage all users to maintain good cybersecurity practices, such as using strong passwords
                    and keeping browsers and antivirus software up to date.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  6
                </span>
                Consent and Modifications
              </h2>
              <div className="space-y-4 text-foreground">
                <p className="mb-4">
                  Your use of the Website constitutes your consent to GMT's Privacy Policy. We reserve the right to
                  update this Policy at any time.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-800">
                    📢 Significant changes will be posted on the Website or sent to your registered email. We recommend
                    checking this page periodically to stay informed about how your data is protected.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  7
                </span>
                Requesting Data Deletion
              </h2>
              <div className="space-y-4 text-foreground">
                <p className="mb-4">
                  If you wish to have your personal data deleted from GMT systems, follow these steps:
                </p>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">
                        1
                      </span>
                      <h4 className="font-semibold text-blue-800">Contact Us</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Send an email to support@getmethis.world with the subject: "Data Deletion Request"
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">
                        2
                      </span>
                      <h4 className="font-semibold text-green-800">Provide Verification</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Include your full name, registered email, and any other necessary information to help us locate
                      your account.
                    </p>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">
                        3
                      </span>
                      <h4 className="font-semibold text-orange-800">Processing Time</h4>
                    </div>
                    <p className="text-sm text-orange-700">
                      We will review your request and delete the data within 30 days, in accordance with applicable data
                      protection laws.
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">
                        4
                      </span>
                      <h4 className="font-semibold text-purple-800">Confirmation</h4>
                    </div>
                    <p className="text-sm text-purple-700">
                      You will receive a confirmation email once your data has been deleted.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  8
                </span>
                Children's Privacy
              </h2>
              <div className="space-y-4 text-foreground">
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <p className="text-pink-800">
                    👶 GMT does not knowingly collect or store data from users under the age of 13. If we discover that
                    we've collected information from a child, we will delete it promptly. Parental supervision is
                    advised for users under 18.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Contact Section */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 sm:p-8 mt-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                9
              </span>
              Contact Us
            </h2>
            <p className="text-foreground mb-4">
              If you have questions, concerns, or requests about this Privacy Policy, please contact:
            </p>
            <div className="space-y-2">
              <p className="text-foreground font-medium">GMT Privacy Team</p>
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
