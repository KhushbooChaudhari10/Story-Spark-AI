import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen px-6 sm:px-12 py-20 flex flex-col items-center">
    <Navbar />


      {/* 🌟 Magical Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/About us.png')" }}
      />

      {/* ✨ Soft Dark Overlay for readability */}
      {/* <div className="absolute inset-0 bg-purple-900/30 backdrop-blur-[2px]"></div> */}

      {/* 🌟 Floating sparkles */}
      <span className="absolute top-10 left-10 text-yellow-200 text-3xl animate-pulse">✨</span>
      <span className="absolute bottom-20 right-20 text-yellow-300 text-xl animate-bounce">⭐</span>
      <span className="absolute top-44 right-1/3 text-yellow-100 text-2xl animate-ping">🌟</span>

      {/* MAIN CONTENT */}
      <div className="relative z-20 w-full max-w-4xl text-center">

        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] mb-4">
          ✨ About Story Spark AI
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-white font-medium mb-12">
          Where imagination becomes a story. 🪄📖
        </p>

        {/* Content Box */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-12 border border-purple-200">
          
          <p className="text-lg text-gray-700 leading-relaxed">
            <span className="text-purple-700 font-bold">Story Spark AI</span> transforms children's drawings 
            and ideas into magical storybooks. Inspired by classics like 
            <span className="font-semibold"> Cinderella 👑</span>, we believe every child deserves to feel 
            like the hero of their own adventure.
          </p>

          <div className="mt-6 space-y-3 text-gray-800 text-lg">
            <p>🖍️ <b>Kids draw a character or scene.</b></p>
            <p>🤖 <b>AI turns imagination into a story.</b></p>
            <p>🎙️ <b>The story comes alive with narration.</b></p>
          </div>

          <p className="mt-8 text-lg text-gray-800 leading-relaxed">
            Our mission is simple:
            <br />
            <span className="text-purple-700 font-bold text-xl">
              ✨ Help every child imagine, create, and tell their own story.
            </span>
          </p>

          <p className="mt-6 text-lg text-gray-800 leading-relaxed">
            Story Spark AI doesn’t just tell tales — 
            <span className="text-pink-600 font-semibold"> it lets kids become the storytellers. 🌈</span>
          </p>
        </div>
      </div>
    </div>
  );
}
