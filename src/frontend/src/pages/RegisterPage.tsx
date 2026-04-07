import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useActor } from "../hooks/useActor";

const FEATURES = [
  {
    icon: CheckCircle2,
    title: "Instant Access",
    desc: "Get immediate access to all 21 exam courses after registration.",
  },
  {
    icon: ShieldCheck,
    title: "100% Secure",
    desc: "Your data is encrypted and protected with industry standards.",
  },
  {
    icon: Clock,
    title: "Flexible Dates",
    desc: "Choose exam dates that work best for your schedule.",
  },
  {
    icon: Award,
    title: "Certified Results",
    desc: "Earn industry-recognized certificates on passing your exams.",
  },
  {
    icon: BookOpen,
    title: "21 Courses",
    desc: "Wide catalog spanning technology, management, arts, and more.",
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { actor } = useActor();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.mobile.trim()) errs.mobile = "Mobile number is required.";
    else if (!/^[0-9]{10}$/.test(form.mobile))
      errs.mobile = "Enter a valid 10-digit mobile number.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword)
      errs.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!actor) {
      toast.error("Not connected to backend. Please try again.");
      return;
    }
    setIsLoading(true);
    try {
      await actor.register(
        form.fullName.trim(),
        form.email.trim(),
        form.mobile.trim(),
        form.password,
      );
      sessionStorage.setItem(
        "register_success",
        "Account created successfully! Please log in.",
      );
      navigate({ to: "/login" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className="rounded-2xl shadow-lg border-border"
                data-ocid="register.card"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-extrabold">
                    Create Account
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Join ExamPortal and start your certification journey.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={form.fullName}
                          onChange={handleChange}
                          className="pl-10 h-11"
                          autoComplete="name"
                          data-ocid="register.fullname.input"
                        />
                      </div>
                      {errors.fullName && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid="register.fullname.error_state"
                        >
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className="pl-10 h-11"
                          autoComplete="email"
                          data-ocid="register.email.input"
                        />
                      </div>
                      {errors.email && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid="register.email.error_state"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="space-y-1.5">
                      <Label htmlFor="mobile" className="text-sm font-medium">
                        Mobile Number{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={form.mobile}
                          onChange={handleChange}
                          className="pl-10 h-11"
                          autoComplete="tel"
                          maxLength={10}
                          data-ocid="register.mobile.input"
                        />
                      </div>
                      {errors.mobile && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid="register.mobile.error_state"
                        >
                          {errors.mobile}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimum 6 characters"
                          value={form.password}
                          onChange={handleChange}
                          className="pl-10 pr-10 h-11"
                          autoComplete="new-password"
                          data-ocid="register.password.input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid="register.password.error_state"
                        >
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm Password{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          placeholder="Re-enter your password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          className="pl-10 pr-10 h-11"
                          autoComplete="new-password"
                          data-ocid="register.confirm_password.input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          aria-label={
                            showConfirm
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showConfirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid="register.confirm_password.error_state"
                        >
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg mt-2"
                      data-ocid="register.submit_button"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account…
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-primary font-medium hover:underline"
                        data-ocid="register.login.link"
                      >
                        Log in here
                      </Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right: Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6 pt-2"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
                  Why Choose <span className="text-primary">ExamPortal?</span>
                </h2>
                <p className="text-muted-foreground">
                  Everything you need for a smooth, credible exam experience.
                </p>
              </div>

              <div className="space-y-4">
                {FEATURES.map((feat, i) => (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent flex-shrink-0">
                      <feat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-0.5">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
