export default function Footer() {
  return (
    <footer className="w-full py-2 text-center bg-gradient-to-r from-purple-600/40 via-pink-500/40 to-purple-700/40 backdrop-blur-md border-t border-white/20 mt-0">
      <p className="text-white text-sm sm:text-base drop-shadow-md">
        © {new Date().getFullYear()} 
        <span className="font-semibold text-yellow-200"> Story Spark AI </span>
        — Keeping imagination alive ✨📚
      </p>
    </footer>
  );
}
