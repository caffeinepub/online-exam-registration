import { Link } from "@tanstack/react-router";
import { GraduationCap, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer className="bg-footer text-footer-fg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-footer-fg">
                ExamPortal
              </span>
            </Link>
            <p className="text-sm text-footer-muted leading-relaxed">
              Your trusted platform for online exam registration. Access 21
              courses across 4 key disciplines.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-footer-fg mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" as const },
                { label: "Course Catalog", to: "/courses" as const },
                { label: "Register", to: "/register" as const },
                { label: "Log In", to: "/login" as const },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-footer-muted hover:text-footer-fg transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-footer-fg mb-4 text-sm uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2">
              {[
                "Professional & Technology",
                "Management & Commerce",
                "Humanities, Arts & Education",
                "SWAYAM Plus",
              ].map((cat) => (
                <li key={cat}>
                  <span className="text-sm text-footer-muted">{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-footer-fg mb-4 text-sm uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-footer-muted">
                21 Courses Available
              </li>
              <li className="text-sm text-footer-muted">Exams Jun–Sep 2026</li>
              <li className="text-sm text-footer-muted">Online Proctored</li>
              <li className="text-sm text-footer-muted">
                Certificate on Completion
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-footer flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-footer-muted">
            © {year} ExamPortal. All rights reserved.
          </p>
          <p className="text-sm text-footer-muted flex items-center gap-1">
            Built with{" "}
            <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" /> using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-footer-fg transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
