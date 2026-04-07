import { Link } from "react-router-dom";
import { Github, Twitter, Send, Mail, FileText, Shield, HelpCircle, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white mt-24">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Real Estate Booking"
                className="w-10 h-10 rounded-lg object-contain"
              />
              <span className="text-xl font-bold">
                <span className="text-foreground">Real Estate </span><span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-600 bg-clip-text text-transparent">Booking</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed max-w-md">
              Real Estate Booking helps you find homes, apartments, and land. Browse listings, save favorites, and connect with trusted agents.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 hover:scale-110 transition-all duration-300 text-muted-foreground hover:text-foreground border border-slate-200 hover:border-blue-400"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 hover:scale-110 transition-all duration-300 text-muted-foreground hover:text-foreground border border-slate-200 hover:border-blue-400"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 hover:scale-110 transition-all duration-300 text-muted-foreground hover:text-foreground border border-slate-200 hover:border-blue-400"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@mocorex.com"
                className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 hover:scale-110 transition-all duration-300 text-muted-foreground hover:text-foreground border border-slate-200 hover:border-blue-400"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products Section */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/listings" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Listings
                </Link>
              </li>
              <li>
                <Link to="/property" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Property Details
                </Link>
              </li>
              <li>
                <Link to="/saved" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Saved
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  For Agents
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
                  <HelpCircle className="w-3 h-3" />
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Risk Disclosure
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-muted-foreground text-sm">
              © {currentYear} Real Estate Booking. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Version 1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
