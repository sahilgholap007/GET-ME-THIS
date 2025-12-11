import Hero from "./components/Hero"
import WhatIsGetMeThis from "./components/WhatIsGetMeThis"
import HowItWorks from "./components/HowItWorks"
import AssistedShopping from "./components/AssistedShopping"
import WhyCustomersLoveIt from "./components/WhyCustomersLoveIt"
import WhatCustomersAreGetting from "./components/WhatCustomersAreGetting"
import GlobalAddresses from "./components/GlobalAddresses"
import FAQ from "./components/FAQ"
import GlobalNetwork from "./components/GlobalNetwork"
import PersonalShopperLanding from "./components/PersonalShopperLanding"

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Hero />
      <section id="personal-shopper" className="pt-4 sm:pt-8 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PersonalShopperLanding />
        </div>
      </section>
      <section id="about">
        <WhatIsGetMeThis />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="what-you-get">
        <WhatCustomersAreGetting />
      </section>
      <section id="why-customers-love-it">
        <WhyCustomersLoveIt />
      </section>
      <section id="faq">
        <FAQ />
      </section>
      <section id="contact">
        <GlobalNetwork />
      </section>
    </main>
  )
}
