import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Download,
  GraduationCap,
  Inbox,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import RegistrationSlip from "../components/RegistrationSlip";
import { useAuth } from "../contexts/AuthContext";
import { CATEGORY_COLORS, COURSES } from "../data/courses";
import { useAllExams, useMyRegistrations } from "../hooks/useQueries";

interface PrintSlipData {
  exam: { id: bigint; title: string; category: string; examDate: string };
  candidateInfo: Record<string, string>;
  registrationId: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: backendExams, isLoading: examsLoading } = useAllExams();
  const { data: registrations, isLoading: regsLoading } = useMyRegistrations();
  const [printData, setPrintData] = useState<PrintSlipData | null>(null);

  const allExams = useMemo(() => {
    if (backendExams && backendExams.length > 0) return backendExams;
    return COURSES;
  }, [backendExams]);

  const registeredExams = useMemo(() => {
    if (!registrations || registrations.length === 0) return [];
    const ids = new Set(registrations.map((r) => r.examId.toString()));
    return allExams.filter((e) => ids.has(e.id.toString()));
  }, [registrations, allExams]);

  const isLoading = examsLoading || regsLoading;

  // Trigger print after printData renders into the portal
  useEffect(() => {
    if (!printData) return;
    const timer = setTimeout(() => {
      window.print();
    }, 80);
    return () => clearTimeout(timer);
  }, [printData]);

  // Clear printData after the print dialog is dismissed
  useEffect(() => {
    const handler = () => setPrintData(null);
    window.addEventListener("afterprint", handler);
    return () => window.removeEventListener("afterprint", handler);
  }, []);

  const handleDownloadSlip = (exam: {
    id: bigint;
    title: string;
    category: string;
    examDate: string;
  }) => {
    const slipKey = `examportal_slip_${exam.id.toString()}`;
    const savedSlip = localStorage.getItem(slipKey);

    if (savedSlip) {
      try {
        const slipData = JSON.parse(savedSlip) as {
          registrationId: string;
          candidateInfo: Record<string, string>;
        };
        setPrintData({
          exam,
          candidateInfo: slipData.candidateInfo,
          registrationId: slipData.registrationId,
        });
        return;
      } catch {
        // fall through
      }
    }

    // Fallback: build from general candidate info
    const rawInfo = localStorage.getItem("examportal_candidate_info");
    const candidateInfo: Record<string, string> = rawInfo
      ? (JSON.parse(rawInfo) as Record<string, string>)
      : {
          fullName: user?.fullName ?? "",
          email: user?.email ?? "",
          mobile: user?.mobile ?? "",
        };

    if (
      !candidateInfo.fullName &&
      !candidateInfo.email &&
      !candidateInfo.mobile
    ) {
      toast.error(
        "No registration details found. Please register via the Courses page.",
      );
      return;
    }

    const regId = `EXAM-${exam.id.toString()}-${Date.now().toString().slice(-6)}`;
    setPrintData({ exam, candidateInfo, registrationId: regId });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-extrabold text-foreground">
              Welcome back,{" "}
              <span className="text-primary">
                {user?.fullName.split(" ")[0]}
              </span>
              ! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s your exam dashboard overview.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card
                className="rounded-2xl shadow-sm border-border"
                data-ocid="dashboard.profile.card"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold">
                    My Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20 flex-shrink-0">
                      <span className="text-2xl font-bold text-primary">
                        {user?.fullName?.[0]?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Registered Student
                      </p>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Full Name
                        </p>
                        <p className="font-medium text-foreground">
                          {user?.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground break-all">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Mobile</p>
                        <p className="font-medium text-foreground">
                          {user?.mobile}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                    <div className="bg-muted rounded-xl p-3 text-center">
                      <p className="text-2xl font-extrabold text-primary">
                        {registeredExams.length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Registered
                      </p>
                    </div>
                    <div className="bg-muted rounded-xl p-3 text-center">
                      <p className="text-2xl font-extrabold text-foreground">
                        21
                      </p>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
                    data-ocid="dashboard.browse_courses.primary_button"
                  >
                    <Link to="/courses">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse All Courses
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Registered Exams */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-2"
            >
              <Card
                className="rounded-2xl shadow-sm border-border h-full"
                data-ocid="dashboard.exams.card"
              >
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold">
                    My Registered Exams
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {registeredExams.length} / 21
                  </Badge>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div
                      className="space-y-3"
                      data-ocid="dashboard.exams.loading_state"
                    >
                      {[1, 2, 3].map((n) => (
                        <Skeleton key={n} className="h-20 w-full rounded-xl" />
                      ))}
                    </div>
                  ) : registeredExams.length === 0 ? (
                    <div
                      className="flex flex-col items-center justify-center py-16 text-center"
                      data-ocid="dashboard.exams.empty_state"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                        <Inbox className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        No Exams Registered Yet
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                        You haven&apos;t registered for any exams. Browse the
                        catalog to get started.
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                        data-ocid="dashboard.empty.browse.secondary_button"
                      >
                        <Link to="/courses">
                          Browse Courses
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {registeredExams.map((exam, i) => (
                        <motion.div
                          key={exam.id.toString()}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          className="rounded-xl border border-border bg-muted p-4 hover:border-primary/30 hover:shadow-sm transition-all flex flex-col"
                          data-ocid={`dashboard.exams.item.${i + 1}`}
                        >
                          <Badge
                            className={`mb-2 text-xs font-medium border-0 w-fit ${
                              CATEGORY_COLORS[exam.category] ??
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {exam.category}
                          </Badge>
                          <h3 className="font-semibold text-sm text-foreground mb-2 leading-snug flex-1">
                            {exam.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                            <CalendarDays className="h-3.5 w-3.5 text-primary" />
                            <span>Exam: {exam.examDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mb-3">
                            <GraduationCap className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-medium text-primary">
                              Registered ✓
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadSlip(exam)}
                            className="w-full rounded-lg text-xs border-primary/30 text-primary hover:bg-primary/5 hover:border-primary gap-1.5 mt-auto"
                            data-ocid={`dashboard.exams.item.${i + 1}.download_button`}
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download Slip
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Print slip portal — hidden on screen, visible during @media print */}
      {printData &&
        createPortal(
          <div className="print-slip">
            <RegistrationSlip
              exam={printData.exam}
              candidateInfo={printData.candidateInfo}
              registrationId={printData.registrationId}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
