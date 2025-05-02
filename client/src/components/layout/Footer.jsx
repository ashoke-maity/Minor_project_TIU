import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="pt-8 flex flex-col md:flex-row justify-center content-center items-center bg-slate-950">
      <div className="container py-2 px-2 flex flex-col w-full ">
        <div className="grid grid-cols-2 md:grid-cols-4 md:px-2 md:py-2 gap-8 md:gap-2 ">
          <div className=" text-primary-100">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-primary-100">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-foreground">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-sm text-muted-foreground hover:text-foreground">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-100">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground">
                  Job Portal
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-sm text-muted-foreground hover:text-foreground">
                  Alumni Directory
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="text-sm text-muted-foreground hover:text-foreground">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-sm text-muted-foreground hover:text-foreground">
                  Donation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-100">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-100">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0 mr-10">
           <img
            src="/icons/logo3.png"
            alt="Logo"
            height="50"
            width="50"
           />
            <span className="text-lg font-bold text-white shadow-md">AlumniConnect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AlumniConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
