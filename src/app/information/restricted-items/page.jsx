export default function RestrictedItemsPage() {
  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 lg:pt-28">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            GMT Restricted Items Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We are committed to safe, secure, and lawful international shipping. Certain items are strictly prohibited
            to ensure compliance with international regulations and safety standards.
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
              At GMT, we are committed to safe, secure, and lawful international shipping. To ensure compliance with
              international regulations and safety standards, certain items are strictly prohibited from being shipped
              through our platform.
            </p>
            <p className="text-foreground leading-relaxed">
              By using GMT services, you agree not to ship, attempt to ship, or store any items listed below, or any
              items restricted by IATA, ICAO, or any local/import/export regulations.
            </p>
          </div>

          {/* Restricted Items Sections */}
          <div className="space-y-8">
            {/* General Prohibited Items */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">❌</span>
                General Prohibited Items
              </h2>
              <div className="space-y-4 text-foreground">
                <p className="mb-4">The following are strictly prohibited from shipment:</p>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-1 text-destructive">
                    <li>Power banks and standalone batteries</li>
                    <li>Metal detectors, radar detectors, and lock picks</li>
                    <li>Magnets, telescopes, and tattoo equipment</li>
                    <li>Electronic air purifying masks</li>
                    <li>Oil, grease, permanent markers</li>
                    <li>Bank documents, debit/credit cards</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Plants & Plant Materials */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">🌱</span>
                Plants & Plant Materials
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1 text-green-800">
                  <li>Seeds</li>
                  <li>Live plants</li>
                  <li>Cut flowers</li>
                  <li>Any plant product requiring agricultural clearance</li>
                </ul>
              </div>
            </section>

            {/* Illegal Drugs & Controlled Substances */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">💊</span>
                Illegal Drugs & Controlled Substances
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>Cocaine, morphine, LSD, opium</li>
                  <li>Cannabis or any cannabis-derived product (CBD, THC, hemp)</li>
                  <li>Psychotropic substances and hallucinogens</li>
                  <li>Kratom powder (Mitragynine & 7-OH-Mitragynine)</li>
                  <li>Magic mushrooms</li>
                </ul>
              </div>
            </section>

            {/* Dangerous & Hazardous Materials */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                Dangerous & Hazardous Materials
              </h2>
              <div className="space-y-4 text-foreground">
                <p className="font-medium">Includes but not limited to:</p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-1 text-orange-800">
                    <li>Aerosols (e.g., hairspray, deodorant)</li>
                    <li>Pressurized containers and gases</li>
                    <li>Flammable liquids and solids</li>
                    <li>Corrosive substances</li>
                    <li>Explosives and fireworks</li>
                    <li>Radioactive or oxidizing materials</li>
                    <li>Glue, toner, and chemicals</li>
                    <li>Suspension/strut/shocks</li>
                    <li>Sunscreen/sun protection sprays</li>
                    <li>Alcohol-based sprays or treatments</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Grid Layout for Smaller Categories */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Perishable Items */}
              <section className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  <span className="text-xl mr-2">🍔</span>
                  Perishable Items
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
                    <li>Foodstuffs or beverages requiring refrigeration</li>
                    <li>Any perishable item not shelf-stable</li>
                  </ul>
                </div>
              </section>

              {/* Animals & Animal Products */}
              <section className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                  <span className="text-xl mr-2">🐾</span>
                  Animals & Animal Products
                </h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <ul className="list-disc list-inside space-y-1 text-purple-800 text-sm">
                    <li>Live or dead animals</li>
                    <li>Insects or reptiles</li>
                    <li>Animal skins, furs, or meat</li>
                    <li>Pet hair/fur supplements</li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Restricted Electronics */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">📵</span>
                Restricted Electronics
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Laser-based products (e.g., laser pens or laser hair removers)</li>
                  <li>Walkie-talkies</li>
                  <li>Used laptops manufactured before 2008</li>
                  <li>Smartwatches with SIM slot or camera</li>
                  <li>Bulk shipments of laptops or mobile phones</li>
                </ul>
              </div>
            </section>

            {/* Restricted Toys & Simulations */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">🧸</span>
                Restricted Toys & Simulations
              </h2>
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1 text-pink-800">
                  <li>Drones and quadcopters</li>
                  <li>Toy robots or slime</li>
                  <li>Toy guns, BB guns, paintball equipment</li>
                  <li>Antique or replica weapons (e.g., swords, knives, fake grenades)</li>
                  <li>Handcuffs and other restraint items</li>
                </ul>
              </div>
            </section>

            {/* Additional Categories in Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Pornographic Material */}
              <section className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                  <span className="text-lg mr-2">🚫</span>
                  Obscene Material
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <ul className="list-disc list-inside space-y-1 text-red-800 text-sm">
                    <li>Pornographic content in any form</li>
                    <li>Indecent or foul imagery or text</li>
                    <li>Items considered obscene or illegal in destination country</li>
                  </ul>
                </div>
              </section>

              {/* Sharp Objects */}
              <section className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                  <span className="text-lg mr-2">🔪</span>
                  Sharp Objects
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
                    <li>Scissors, knives, needles, and blades</li>
                    <li>Guns and gun accessories</li>
                    <li>Stun guns, pepper sprays, slingshots</li>
                  </ul>
                </div>
              </section>

              {/* Tobacco Products */}
              <section className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                  <span className="text-lg mr-2">🚬</span>
                  Tobacco Products
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <ul className="list-disc list-inside space-y-1 text-amber-800 text-sm">
                    <li>Cigarettes, cigars, chewing tobacco</li>
                    <li>Electronic cigarettes (vapes) and accessories</li>
                    <li>Hookahs and hookah accessories</li>
                  </ul>
                </div>
              </section>

              {/* Liquids & Cosmetics */}
              <section className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                  <span className="text-lg mr-2">🧴</span>
                  Bulk Liquids
                </h3>
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                  <ul className="list-disc list-inside space-y-1 text-cyan-800 text-sm">
                    <li>Nail polish, ink, or paint</li>
                    <li>Any liquid item in bulk</li>
                  </ul>
                </div>
              </section>

              {/* Fragile Items */}
              <section className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                  <span className="text-lg mr-2">⚠️</span>
                  Fragile Items
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
                    <li>Ceramic mugs and delicate glassware</li>
                    <li>Any item prone to damage will be shipped at your own risk</li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Unaccepted Shipments */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">📦</span>
                Unaccepted or Unknown Shipments
              </h2>
              <div className="space-y-4 text-foreground">
                <p>
                  If a shipment contains restricted items or if it lacks proper identification, GMT reserves the right
                  to:
                </p>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-destructive">
                    <li>Refuse delivery</li>
                    <li>Dispose of the item in accordance with local laws</li>
                    <li>Charge storage or handling fees for any special processing</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Compliance */}
            <section className="bg-card rounded-lg border border-border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="text-2xl mr-3">🔍</span>
                Compliance with Law
              </h2>
              <div className="space-y-4 text-foreground">
                <p>
                  You agree to follow all applicable international, national, and local regulations when shipping items.
                  Failure to comply may result in:
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-red-800">
                    <li>Seizure of items</li>
                    <li>Permanent account termination</li>
                    <li>Legal consequences in the destination or origin country</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Contact Section */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 sm:p-8 mt-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Questions?</h2>
            <p className="text-foreground mb-4">For inquiries or clarification about shipping eligibility:</p>
            <div className="space-y-2">
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
                  🌍 getmethis.world
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
