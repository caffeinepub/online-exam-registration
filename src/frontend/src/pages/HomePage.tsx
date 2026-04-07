import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  Cpu,
  GraduationCap,
  Palette,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { CATEGORY_COLORS, COURSES } from "../data/courses";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Secure & Proctored",
    desc: "Industry-grade proctoring ensures exam integrity and fair assessment.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    desc: "Choose exam dates that fit your schedule from our rolling calendar.",
  },
  {
    icon: Award,
    title: "Industry Certificates",
    desc: "Earn recognized certificates accepted by top employers nationwide.",
  },
  {
    icon: BookOpen,
    title: "21 Courses",
    desc: "Diverse catalog spanning technology, management, arts, and SWAYAM Plus.",
  },
  {
    icon: Users,
    title: "Expert Faculty",
    desc: "Learn from practitioners and academics with decades of experience.",
  },
  {
    icon: CheckCircle2,
    title: "Instant Registration",
    desc: "Complete your exam registration in under 2 minutes, any device.",
  },
];

const CATEGORY_HIGHLIGHTS = [
  {
    icon: Cpu,
    label: "Professional & Technology",
    count: 6,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Briefcase,
    label: "Management & Commerce",
    count: 5,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Palette,
    label: "Humanities, Arts & Education",
    count: 5,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Zap,
    label: "SWAYAM Plus",
    count: 5,
    color: "text-primary",
    bg: "bg-accent",
  },
];

const FEATURED_COURSES = COURSES.slice(0, 3);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Badge className="mb-4 bg-accent text-primary border-0 font-medium">
                  🎓 2026 Exam Registrations Now Open
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                  Prepare for Excellence,{" "}
                  <span className="text-primary">Register for Your Exam</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                  Access 21 certified courses across technology, management,
                  humanities, and SWAYAM Plus. Seamless registration, secure
                  proctoring, industry-recognized certificates.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 font-semibold shadow-lg"
                  >
                    <Link
                      to="/register"
                      data-ocid="hero.register.primary_button"
                    >
                      Create Free Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 font-semibold border-border hover:border-primary hover:text-primary"
                  >
                    <Link to="/login" data-ocid="hero.login.secondary_button">
                      Log In
                    </Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="mt-10 flex flex-wrap gap-6">
                  {[
                    { value: "21", label: "Courses" },
                    { value: "4", label: "Categories" },
                    { value: "2026", label: "Exam Year" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-extrabold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right: Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                className="relative flex items-center justify-center"
              >
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-0 rounded-full bg-accent opacity-40 scale-90 blur-3xl" />
                  <img
                    src="/assets/generated/hero-exam-illustration.dim_600x520.png"
                    alt="Student preparing for online exam"
                    className="relative w-full h-auto rounded-2xl"
                    loading="eager"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Category Highlights */}
        <section className="bg-muted py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORY_HIGHLIGHTS.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white rounded-xl p-5 border border-border shadow-sm flex items-center gap-4"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.bg} flex-shrink-0`}
                  >
                    <cat.icon className={`h-6 w-6 ${cat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-foreground">
                      {cat.count}
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {cat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-extrabold text-foreground mb-4"
              >
                Why Choose <span className="text-primary">ExamPortal?</span>
              </motion.h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything you need for a smooth, credible exam experience —
                from registration to certification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group rounded-xl border border-border bg-white p-6 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent mb-4 group-hover:bg-primary/10 transition-colors">
                    <feat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="bg-muted py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-foreground">
                  Featured Courses
                </h2>
                <p className="text-muted-foreground mt-1">
                  Explore our most popular exam offerings.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Link to="/courses" data-ocid="home.courses.secondary_button">
                  View All 21 Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {FEATURED_COURSES.map((course, i) => (
                <motion.div
                  key={course.id.toString()}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Badge
                    className={`mb-3 text-xs font-medium border-0 ${CATEGORY_COLORS[course.category]}`}
                  >
                    {course.category}
                  </Badge>
                  <h3 className="font-semibold text-foreground mb-2 leading-snug">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>Exam: {course.examDate}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students already registered for 2026 exams.
                Create your free account today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 rounded-full px-8 font-semibold shadow-lg"
                >
                  <Link to="/register" data-ocid="cta.register.primary_button">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 rounded-full px-8 font-semibold"
                >
                  <Link to="/courses" data-ocid="cta.courses.secondary_button">
                    Browse Courses
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
