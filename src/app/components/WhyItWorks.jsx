export default function WhyItWorks() {
  const features = [
    {
      icon: "/images/target.png",
      text: "Multiple country addresses you can use across thousands of stores",
    },
    {
      icon: "/images/bag.png",
      text: "Package consolidation to save up to 70% on international shipping",
    },
    {
      icon: "/images/lightning.png",
      text: "Express and economy options to match your budget",
    },
  ]

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-monument-ultrabold text-foreground mb-6 uppercase tracking-wide">
            Why it works
          </h2>
          <p className="text-xl font-monument-ultralight text-muted-foreground uppercase tracking-wide max-w-2xl mx-auto">
            The proven system behind our global delivery success
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img src={feature.icon || "/placeholder.svg"} alt="" className="w-12 h-12 object-contain" />
                    </div>
                    <p className="font-monument-ultralight text-xl text-foreground uppercase tracking-wide leading-relaxed flex-1">
                      {feature.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
