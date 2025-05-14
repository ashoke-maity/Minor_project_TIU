import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm text-center sm:text-left">
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-[1.2rem]">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/events" className="hover:text-white transition">Events</Link></li>
              <li><Link to="/success-stories" className="hover:text-white transition">Success Stories</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-[1.2rem]">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="hover:text-white transition">Job Portal</Link></li>
              <li><Link to="/directory" className="hover:text-white transition">Alumni Directory</Link></li>
              <li><Link to="/mentorship" className="hover:text-white transition">Mentorship</Link></li>
              <li><Link to="/donate" className="hover:text-white transition">Donation</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-[1.2rem]">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-[1.2rem]">Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition">Twitter</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition">LinkedIn</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition">Instagram</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src="/icons/logo3.png" alt="Logo" width="32" height="32" />
            <span className="font-semibold text-white">AlumniConnect</span>
          </div>
          <p className="text-center md:text-right">© {new Date().getFullYear()} AlumniConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
