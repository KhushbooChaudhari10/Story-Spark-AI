export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-50 px-6 sm:px-12 py-16">
      
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-800 text-center mb-6 drop-shadow-sm">
        ✨ About Story Spark AI
      </h1>

      {/* Subtitle */}
      <p className="text-center text-lg text-purple-600 font-medium mb-12">
        Where imagination becomes a story. 🪄📖
      </p>

      {/* Content Box */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-purple-200">
        
        <p className="text-lg text-gray-700 leading-relaxed">
          <span className="text-purple-700 font-bold">Story Spark AI</span> transforms children's creativity 
          into magical digital storybooks. Inspired by classics like 
          <span className="font-semibold"> Cinderella 👑</span>, we believe every child deserves to feel 
          like the hero of their own adventure.
        </p>

        <div className="mt-6 space-y-3 text-gray-800 text-lg">
          <p>🖍️ <b>Draw</b> a character or object.</p>
          <p>🤖 <b>AI turns it into a story.</b></p>
          <p>🎙️ <b>Characters come alive with narration.</b></p>
        </div>

        <p className="mt-8 text-lg text-gray-700 leading-relaxed">
          Our mission is simple:
          <br />
          <span className="text-purple-700 font-bold text-xl">
            ✨ Help every child imagine, create, and tell their own story.
          </span>
        </p>

        <p className="mt-6 text-lg text-gray-700 leading-relaxed">
          Story Spark AI doesn’t just tell tales —
          <span className="text-pink-600 font-semibold"> it lets kids become the storytellers. 🌈</span>
        </p>
      </div>
    </div>
  );
}
