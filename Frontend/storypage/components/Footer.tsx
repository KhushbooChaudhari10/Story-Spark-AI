"use client";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20 bg-gradient-to-r from-purple-500 to-pink-400 text-white 
      pt-10 pb-6 px-6 rounded-t-3xl shadow-[0_-4px_25px_rgba(0,0,0,0.3)]">
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2 drop-shadow-lg">
            📖✨ Story <span className="text-yellow-200">Spark</span>
          </h2>
          <p className="mt-2 text-sm opacity-90">
            Where imagination meets AI magic.
          </p>
          <p className="mt-2 text-xs opacity-80">
            🛡️ Child-safe • No ads • No personal data stored
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-yellow-200">Quick Links</h3>
          <ul className="space-y-2 text-sm opacity-95">
            <li><Link href="/about" className="hover:text-yellow-200 transition">📘 About Us</Link></li>
            <li><Link href="/how-it-works" className="hover:text-yellow-200 transition">🏰 How It Works</Link></li>
            <li><Link href="/parents" className="hover:text-yellow-200 transition">👨‍👩‍👧 For Parents</Link></li>
            <li><Link href="/safety" className="hover:text-yellow-200 transition">🔐 Privacy & Safety</Link></li>
            <li><Link href="/contact" className="hover:text-yellow-200 transition">📩 Contact</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-yellow-200">Contact</h3>
          <p className="text-sm opacity-95">📬 support@storyspark.ai</p>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="text-center text-xs opacity-80 mt-10 border-t border-white/30 pt-4">
        © {new Date().getFullYear()} Story Spark AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
