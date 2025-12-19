import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen px-6 sm:px-12 py-32 flex flex-col items-center text-center">
      <Navbar />

      {/* Magical Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-95"
        style={{ backgroundImage: "url('/About us.png')" }}
      />

      {/* Gentle overlay for readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      {/* Corner Sparkles */}
      <span className="absolute top-24 left-10 text-yellow-200 text-3xl animate-pulse">✨</span>
      <span className="absolute bottom-24 right-16 text-yellow-300 text-3xl animate-bounce">⭐</span>

      {/* Main Content */}
      <div className="relative z-20 max-w-3xl flex flex-col items-center">

        {/* Heading */}
        <h1 className="
          text-5xl font-extrabold 
          text-white 
          drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]
        ">
          ✨ Contact Us
        </h1>

        <p className="
          text-xl mt-2 
          text-[#F4EAFE] 
          drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]
          font-medium
        ">
          We’d love to hear from you! 🌈💌  
        </p>

        {/* Contact Details */}
        <div className="space-y-10 text-xl text-white mt-12 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">

          <p>
            <span className="text-yellow-100 font-semibold text-2xl">📬 Email</span>
            <br />
            support@storyspark.com
          </p>

          <p>
            <span className="text-yellow-100 font-semibold text-2xl">🪄 Business Inquiries</span>
            <br />
            hello@storyspark.ai
          </p>

          <p>
            <span className="text-yellow-100 font-semibold text-2xl">🌟 Feedback & Suggestions</span>
            <br />
            feedback@storyspark.com
          </p>

          <p className="text-[#F6EEFF] text-lg mt-10 max-w-xl mx-auto">
            Our team will respond within 24–48 hours.  
            Until then… keep imagining, keep creating, and keep the magic alive! ✨📖
          </p>

        </div>
      </div>
    </div>
  );
}
