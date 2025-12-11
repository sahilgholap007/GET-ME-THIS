export default function RecentlyDelivered() {
  const products = [
    { name: "MacBook Pro", savings: "₹35,000", category: "Electronics" },
    { name: "Sony camera", savings: "₹28,000", category: "Photography" },
    { name: "PlayStation 5", savings: "₹15,000", category: "Gaming" },
    { name: "Apple Watch", savings: "₹12,000", category: "Wearables" },
    { name: "Nike shoes", savings: "₹8,000", category: "Fashion" },
    { name: "Art supplies", savings: "₹5,000", category: "Creative" },
  ]

  return (
    <section className="py-24 bg-muted relative overflow-hidden">
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-monument-ultrabold text-foreground mb-6 uppercase tracking-wide">
            Recently delivered products
          </h2>
          <p className="text-xl font-monument-ultralight text-muted-foreground uppercase tracking-wide max-w-2xl mx-auto">
            Fresh deliveries with amazing savings for our customers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <div key={index} className="group">
              <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/20 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-monument-ultralight uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>

                <div className="pt-8">
                  <h3 className="font-monument-regular text-xl text-foreground mb-3 uppercase tracking-wide">
                    {product.name}
                  </h3>

                  <div className="bg-primary/10 rounded-xl p-3 text-center">
                    <p className="text-primary font-geist-sans text-lg uppercase tracking-wide font-bold">
                      Saved {product.savings}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-card border border-border rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-muted-foreground font-monument-ultralight uppercase tracking-wide">
              Savings are based on the order date and source store price.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
