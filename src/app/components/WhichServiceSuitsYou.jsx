export default function WhichServiceSuitsYou() {
  return (
    <section className="py-24 bg-muted relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-monument-ultrabold text-foreground mb-6 uppercase tracking-wide">
            Which service suits you
          </h2>
          <p className="text-xl font-monument-ultralight text-muted-foreground uppercase tracking-wide max-w-2xl mx-auto">
            Compare our services to find the perfect fit for your needs
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
            <div className="bg-primary text-primary-foreground p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-monument-regular uppercase tracking-wide text-lg">Feature</div>
                <div className="text-center font-monument-regular uppercase tracking-wide text-lg">
                  Assisted Shopping
                </div>
                <div className="text-center font-monument-regular uppercase tracking-wide text-lg">Global Address</div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {[
                { feature: "You place the order", assisted: "No", global: "Yes" },
                { feature: "Foreign address provided", assisted: "Not needed", global: "Yes" },
                { feature: "Works with all websites", assisted: "Yes", global: "Yes" },
                { feature: "Best for beginners", assisted: "Yes", global: "Good with guidance" },
                { feature: "Package consolidation", assisted: "Automatic if needed", global: "Yes, on request" },
                { feature: "Personal shopping help", assisted: "Included", global: "Optional" },
                { feature: "Authenticity verification", assisted: "Included", global: "On receipt" },
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-6 hover:bg-muted/50 transition-colors">
                  <div className="font-monument-ultralight text-foreground uppercase tracking-wide">{row.feature}</div>
                  <div className="text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-monument-regular uppercase tracking-wide ${
                        row.assisted === "Yes" || row.assisted === "Included" || row.assisted === "Automatic if needed"
                          ? "bg-primary/10 text-primary"
                          : row.assisted === "No"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {row.assisted}
                    </span>
                  </div>
                  <div className="text-center">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-monument-regular uppercase tracking-wide ${
                        row.global === "Yes" || row.global === "On receipt" || row.global === "Yes, on request"
                          ? "bg-primary/10 text-primary"
                          : row.global === "Good with guidance" || row.global === "Optional"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {row.global}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
