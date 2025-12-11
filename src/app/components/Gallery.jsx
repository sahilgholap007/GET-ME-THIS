"use client"

const Gallery = () => {
  const chromeElements = [
    { src: "/images/chrome-infinity.png", title: "Infinite Possibilities" },
    { src: "/images/chrome-wave.png", title: "Fluid Experience" },
    { src: "/images/chrome-globe.png", title: "Connected Commerce" },
    { src: "/images/chrome-hand.png", title: "Personal Touch" },
    { src: "/images/chrome-game-controller.png", title: "Interactive Shopping" },
  ]

  return (
    <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-monument-ultrabold text-gray-900 mb-6 uppercase tracking-wide">
            Design Excellence
          </h2>
          <p className="text-lg text-gray-600 font-monument-ultralight max-w-3xl mx-auto leading-relaxed">
            Every element crafted with precision and attention to detail, reflecting our commitment to premium quality.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {chromeElements.map((element, index) => (
            <div
              key={index}
              className="group relative bg-white p-12 rounded-3xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="text-center">
                <img
                  src={element.src || "/placeholder.svg"}
                  alt={element.title}
                  className="w-32 h-32 object-contain mx-auto mb-6 group-hover:scale-110 transition-transform duration-500"
                />
                <h3 className="text-lg font-monument-regular text-gray-900 uppercase tracking-wide">{element.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
