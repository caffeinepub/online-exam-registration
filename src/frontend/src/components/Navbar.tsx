import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
    setMobileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-primary"
        : "text-foreground/70 hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-foreground"
            data-ocid="nav.link"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span>ExamPortal</span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            <Link
              to="/"
              className={navLinkClass("/")}
              data-ocid="nav.home.link"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={navLinkClass("/dashboard")}
                  data-ocid="nav.dashboard.link"
                >
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </span>
                </Link>
                <Link
                  to="/courses"
                  className={navLinkClass("/courses")}
                  data-ocid="nav.courses.link"
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    Courses
                  </span>
                </Link>
              </>
            ) : (
              <Link
                to="/courses"
                className={navLinkClass("/courses")}
                data-ocid="nav.courses.link"
              >
                Courses
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Hi,{" "}
                  <span className="font-medium text-foreground">
                    {user?.fullName.split(" ")[0]}
                  </span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-full gap-1.5"
                  data-ocid="nav.logout.button"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-full border-border hover:border-primary hover:text-primary"
                >
                  <Link to="/login" data-ocid="nav.login.link">
                    Log In
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="rounded-full bg-primary hover:bg-primary/90 text-white"
                >
                  <Link to="/register" data-ocid="nav.register.link">
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-foreground/70 hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-ocid="nav.menu.toggle"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block text-sm font-medium text-foreground/70 hover:text-foreground py-1"
            onClick={() => setMobileOpen(false)}
            data-ocid="nav.mobile.home.link"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="block text-sm font-medium text-foreground/70 hover:text-foreground py-1"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.mobile.dashboard.link"
              >
                Dashboard
              </Link>
              <Link
                to="/courses"
                className="block text-sm font-medium text-foreground/70 hover:text-foreground py-1"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.mobile.courses.link"
              >
                Courses
              </Link>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Signed in as {user?.fullName}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full rounded-full"
                  data-ocid="nav.mobile.logout.button"
                >
                  Log Out
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-full"
              >
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.mobile.login.link"
                >
                  Log In
                </Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="rounded-full bg-primary text-white"
              >
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.mobile.register.link"
                >
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
