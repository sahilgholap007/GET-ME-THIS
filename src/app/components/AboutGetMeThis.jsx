export default function AboutGetMeThis() {
  const stats = [
    { number: "5+", label: "years industry experience" },
    { number: "50,000+", label: "happy customers" },
    { number: "25+", label: "countries covered" },
    { number: "98.5%", label: "success rate" },
  ]

  return (
    <section className="py-24 bg-muted relative overflow-hidden">
      <div className="absolute top-10 right-10 w-48 h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-monument-ultrabold text-foreground mb-8 uppercase tracking-wide">
            About GETMETHIS
          </h2>
          <p className="font-monument-ultralight text-2xl text-muted-foreground mb-4 uppercase tracking-wide max-w-3xl mx-auto">
            Founded in 2025 to make global products accessible for everyone in India.
          </p>
          <p className="font-monument-ultralight text-lg text-muted-foreground uppercase tracking-wide max-w-2xl mx-auto">
            Bridging the gap between global commerce and local delivery
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <h3 className="font-monument-ultrabold text-5xl text-primary mb-4 uppercase tracking-wide group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </h3>
                  <p className="text-muted-foreground font-monument-ultralight uppercase tracking-wide leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="group bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 font-monument-regular text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 uppercase tracking-wider rounded-2xl border-2 border-primary hover:border-primary/90 relative overflow-hidden">
            <span className="relative z-10">Learn More About Us</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  )
}
