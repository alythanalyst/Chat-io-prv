import { useState } from "react"; // Keep if you use useState elsewhere in your component
// import { useAuthStore } from "../store/useAuthStore"; // Keep if component uses it

// 1. Remove react-icons imports
// import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaDiscord, FaGithub, FaReddit } from "react-icons/fa";
// import { FaXTwitter, FaSquareGithub } from "react-icons/fa6";

// 2. Import Lucide icons
import {
  Facebook, // For Facebook
  Twitter, // Common for X/Twitter
  Instagram, // For Instagram
  Linkedin, // For LinkedIn
  Youtube, // For YouTube
  Discord, // For Discord
  Github, // For GitHub
  // Lucide doesn't have a specific "Reddit" icon that matches the logo very well,
  // but you can use "MessageSquareText" or "Speech" or just skip it if it doesn't fit
  // Alternatively, you can use a generic icon like "Globe" or "Link" for less common ones.
  // For Reddit, if you really want it, you might need to find a custom SVG or fallback to react-icons just for it,
  // or use a more generic icon. Let's use a generic 'MessageSquare' for demo.
  MessageSquare, // Example for Reddit if no exact match
} from "lucide-react";

const socialMediaLinks = [
  { icon: Facebook, url: "https://www.facebook.com/aliabdelrahmanjr" },
  { icon: Twitter, url: "https://x.com/Alythanalyst" }, // Often uses Twitter icon
  { icon: Instagram, url: "https://instagram.com/mostofaly" },
  { icon: Linkedin, url: "https://www.linkedin.com/in/alyanalyzed/" },
  { icon: Youtube, url: "https://www.youtube.com/@mostofaly" },
  { icon: Discord, url: "https://discord.com/users/465995269738332161" },
  { icon: Github, url: "https://github.com/Sir-Aly" }, // You can use Github for both if you only want one unique icon per platform
  // { icon: Github, url: "https://github.com/alythanalyst" }, // No need for two GitHub icons unless unique context
  {
    icon: MessageSquare,
    url: "https://www.reddit.com/user/Unlucky_Meringue9835/e",
  }, // Using a generic icon for Reddit
];

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {socialMediaLinks.map((social, i) => (
            <a
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`aspect-square rounded-2xl bg-primary/10 flex items-center justify-center transition-colors hover:bg-primary/20
                ${i % 2 === 0 ? "animate-pulse" : ""}
              `}
            >
              {/* Lucide icons take a 'size' prop or can be styled with Tailwind classes */}
              <social.icon size={48} className="text-primary" />{" "}
              {/* Changed to size=48 for a slightly larger look */}
            </a>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
