export default function GlobalNetwork() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-transparent text-black relative overflow-hidden flex flex-col items-center gap-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
<p className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-monument-regular text-gray-700 tracking-wide mb-3 sm:mb-4 md:mb-6 uppercase text-center px-2">
          Ready to start your global shopping journey? Join more than 50,000 Indians who already shop worldwide JUST SAY..
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-monument-ultrabold text-black mb-6 sm:mb-8 uppercase tracking-wide px-2 mt-12">
          GET<span className="text-white" style={{ WebkitTextStroke: "1px black" }}>
            ME
          </span>THIS<sup className="text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl align-super">®</sup>
        </h2>
      </div>
              
      {/* <div className="pointer-events-none hidden md:block ">
        <img
          src="/images/chrome-infinity.png"
          alt=""
          className="justify-center w-sm flex items-center"
        />
      </div> */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">


        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 md:mb-12">
          <button className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 font-monument-regular text-xs sm:text-sm cursor-pointer w-full sm:w-auto">
            START SHOPPING NOW
          </button>
          <button className="border-2 border-black text-black px-6 sm:px-8 py-3 sm:py-4 font-monument-regular text-xs sm:text-sm hover:bg-black hover:text-white transition-colors w-full sm:w-auto ">
            TALK OUR EXPERTS
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-monument text-black">
          <span>100% secure and insured</span>
          <span>Express delivery available</span>
          <span>98.5% success rate</span>
        </div>
      </div>
    </section>
  )
}
