"use client"
import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Send, User, MessageSquare } from "lucide-react"

const Contact = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage("Message sent successfully! We'll get back to you soon.")
      setIsSubmitting(false)
      setFormData({ name: "", email: "", subject: "", message: "" })

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(""), 5000)
    }, 2000)
  }

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "Email Us",
      details: "hello@kosharo.com",
      description: "Send us an email anytime",
    },
    {
      icon: <Phone size={24} />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 5pm",
    },
    {
      icon: <MapPin size={24} />,
      title: "Visit Us",
      details: "123 Luxury Avenue",
      description: "New York, NY 10001",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-luxury-pulse"></div>
        <div className="absolute top-40 right-32 w-80 h-80 bg-gray-300 rounded-full blur-3xl animate-luxury-pulse-delayed"></div>
        <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-gray-400 rounded-full blur-3xl animate-luxury-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl animate-luxury-pulse-reverse"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div
              className={`transition-all duration-2000 ease-out ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h1 className="text-5xl md:text-7xl font-extralight text-white mb-8 tracking-[0.3em] animate-luxury-glow">
                GET IN
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white font-light mt-4">
                  TOUCH
                </span>
              </h1>
              <div
                className={`w-32 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8 transition-all duration-1000 delay-500 ${
                  isLoaded ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                }`}
              ></div>
              <p
                className={`text-gray-400 text-xl font-extralight tracking-[0.15em] max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                HAVE A QUESTION, PARTNERSHIP IDEA, OR JUST WANT TO SAY HELLO?
                <br className="hidden lg:block" />
                WE'RE HERE TO LISTEN AND PROVIDE EXCEPTIONAL SERVICE
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Information */}
            <div
              className={`transition-all duration-1500 delay-1000 ${
                isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-extralight text-white mb-6 tracking-[0.2em]">
                  REACH OUT TO US
                </h2>
                <div className="w-24 h-px bg-gradient-to-r from-white to-transparent mb-8"></div>
                <p className="text-gray-400 font-extralight text-lg leading-relaxed tracking-wide">
                  WE'RE COMMITTED TO PROVIDING YOU WITH THE HIGHEST LEVEL OF SERVICE AND SUPPORT. CONTACT US THROUGH ANY
                  OF THE CHANNELS BELOW.
                </p>
              </div>

              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className={`group transition-all duration-1000 ${
                      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${1200 + index * 200}ms` }}
                  >
                    <div
                      className="p-8 relative transition-all duration-700 hover:scale-105 overflow-hidden"
                      style={{
                        background: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      {/* Glassmorphism overlay on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          backdropFilter: "blur(25px) saturate(200%)",
                          WebkitBackdropFilter: "blur(25px) saturate(200%)",
                        }}
                      ></div>

                      {/* Subtle shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                      <div className="relative z-10 flex items-start gap-6">
                        <div className="p-3 border border-gray-700 group-hover:border-white transition-colors duration-500">
                          <div className="text-white group-hover:scale-110 transition-transform duration-300">
                            {info.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-extralight tracking-[0.15em] text-white mb-2 group-hover:text-gray-200 transition-colors duration-500">
                            {info.title.toUpperCase()}
                          </h3>
                          <p className="text-white font-light text-lg mb-1">{info.details}</p>
                          <p className="text-gray-400 font-extralight text-sm tracking-wide group-hover:text-gray-300 transition-colors duration-500">
                            {info.description.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div
              className={`transition-all duration-1500 delay-1200 ${
                isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div
                className="p-12 relative"
                style={{
                  background: "rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Subtle Luxury Accent Lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-20"></div>
                <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-20"></div>

                {/* Elegant Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transform -skew-x-12 animate-luxury-shine"></div>

                <div className="relative z-10">
                  <div className="mb-10">
                    <h2 className="text-3xl font-extralight text-white mb-4 tracking-[0.2em]">SEND MESSAGE</h2>
                    <div className="w-16 h-px bg-gradient-to-r from-white to-transparent"></div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-extralight text-gray-300 mb-3 tracking-[0.1em]">
                          NAME
                        </label>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors duration-300"
                            size={18}
                          />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="w-full bg-black/30 border border-gray-700 text-white pl-12 pr-4 py-4 text-sm font-extralight focus:border-white focus:outline-none transition-all duration-500 group-hover:bg-black/40 group-hover:border-gray-600"
                            style={{
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                            }}
                            required
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 group-focus-within:w-full"></div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-extralight text-gray-300 mb-3 tracking-[0.1em]">
                          EMAIL
                        </label>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors duration-300"
                            size={18}
                          />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="w-full bg-black/30 border border-gray-700 text-white pl-12 pr-4 py-4 text-sm font-extralight focus:border-white focus:outline-none transition-all duration-500 group-hover:bg-black/40 group-hover:border-gray-600"
                            style={{
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                            }}
                            required
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 group-focus-within:w-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-extralight text-gray-300 mb-3 tracking-[0.1em]">
                        SUBJECT
                      </label>
                      <div className="relative">
                        <MessageSquare
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors duration-300"
                          size={18}
                        />
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What's this about?"
                          className="w-full bg-black/30 border border-gray-700 text-white pl-12 pr-4 py-4 text-sm font-extralight focus:border-white focus:outline-none transition-all duration-500 group-hover:bg-black/40 group-hover:border-gray-600"
                          style={{
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                          }}
                          required
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 group-focus-within:w-full"></div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-extralight text-gray-300 mb-3 tracking-[0.1em]">
                        MESSAGE
                      </label>
                      <div className="relative">
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          placeholder="Tell us more about your inquiry..."
                          className="w-full bg-black/30 border border-gray-700 text-white px-4 py-4 text-sm font-extralight focus:border-white focus:outline-none transition-all duration-500 group-hover:bg-black/40 group-hover:border-gray-600 resize-none"
                          style={{
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                          }}
                          required
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 group-focus-within:w-full"></div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-black px-8 py-4 font-extralight tracking-[0.2em] hover:bg-gray-100 transition-all duration-500 text-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 transition-all duration-300 group-hover:tracking-[0.3em]">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            SENDING...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            SEND MESSAGE
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>
                    </button>

                    {submitMessage && (
                      <div
                        className="text-center py-4 px-6 animate-luxury-fade-in"
                        style={{
                          background: "rgba(34, 197, 94, 0.1)",
                          border: "1px solid rgba(34, 197, 94, 0.3)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <p className="text-green-400 font-extralight text-sm tracking-wide">{submitMessage}</p>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div
        className={`text-center pb-20 transition-all duration-1500 delay-2000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="inline-flex items-center space-x-6 text-sm font-extralight text-gray-500 tracking-[0.3em]">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-400"></div>
          <span>LUXURY REDEFINED</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-400"></div>
        </div>
      </div>
    </div>
  )
}

export default Contact
