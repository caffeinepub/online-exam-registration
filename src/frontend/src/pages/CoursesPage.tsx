import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CalendarDays, GraduationCap, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import CandidateInfoModal from "../components/CandidateInfoModal";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  COURSES,
  type CourseItem,
} from "../data/courses";
import {
  useAllExams,
  useMyRegistrations,
  useRegisterForExam,
  useUnregisterFromExam,
} from "../hooks/useQueries";

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [modalExam, setModalExam] = useState<CourseItem | null>(null);

  const { data: backendExams, isLoading: examsLoading } = useAllExams();
  const { data: registrations, isLoading: regsLoading } = useMyRegistrations();
  const { mutateAsync: registerExamAsync } = useRegisterForExam();
  const {
    mutate: unregisterExam,
    isPending: isUnregistering,
    variables: unregisteringId,
  } = useUnregisterFromExam();

  const allExams: CourseItem[] = useMemo(() => {
    if (backendExams && backendExams.length > 0) {
      return backendExams.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        examDate: e.examDate,
      }));
    }
    return COURSES;
  }, [backendExams]);

  const registeredIds = useMemo(
    () => new Set((registrations ?? []).map((r) => r.examId.toString())),
    [registrations],
  );

  const filteredExams = useMemo(() => {
    if (activeCategory === "All") return allExams;
    return allExams.filter((e) => e.category === activeCategory);
  }, [allExams, activeCategory]);

  const isLoading = examsLoading || regsLoading;

  const handleConfirmRegister = async (examId: bigint) => {
    await registerExamAsync(examId);
  };

  const handleUnregister = (examId: bigint, title: string) => {
    unregisterExam(examId, {
      onSuccess: () => toast.success(`Unregistered from "${title}".`),
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Unregistration failed.",
        ),
    });
  };

  const isBusy = (examId: bigint) =>
    isUnregistering && unregisteringId === examId;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 bg-muted">
        {/* Page Header */}
        <div className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-foreground">
                  Course Catalog
                </h1>
              </div>
              <p className="text-muted-foreground">
                Browse and register for {allExams.length} exams across 4
                categories.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="flex flex-wrap h-auto gap-1 bg-white border border-border p-1 rounded-xl w-full sm:w-auto">
                {CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                    data-ocid={`courses.${cat
                      .toLowerCase()
                      .replace(/[^a-z0-9]/g, "_")
                      .replace(/_+/g, "_")
                      .replace(/^_|_$/g, "")}.tab`}
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <p className="text-sm text-muted-foreground mt-3">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredExams.length}
              </span>{" "}
              exam
              {filteredExams.length !== 1 ? "s" : ""}
              {activeCategory !== "All" && (
                <>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-foreground">
                    {activeCategory}
                  </span>
                </>
              )}
            </p>
          </motion.div>

          {/* Course Grid */}
          {isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              data-ocid="courses.list.loading_state"
            >
              {Array.from({ length: 6 }, (_, i) => i).map((i) => (
                <Skeleton key={`skeleton-${i}`} className="h-52 rounded-2xl" />
              ))}
            </div>
          ) : filteredExams.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20"
              data-ocid="courses.list.empty_state"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                No courses found in this category.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                data-ocid="courses.list.table"
              >
                {filteredExams.map((exam, i) => {
                  const registered = registeredIds.has(exam.id.toString());
                  const busy = isBusy(exam.id);

                  return (
                    <motion.div
                      key={exam.id.toString()}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="group bg-white rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col"
                      data-ocid={`courses.list.item.${i + 1}`}
                    >
                      <div className="h-1.5 rounded-t-2xl bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="p-5 flex flex-col flex-1">
                        <Badge
                          className={`mb-3 text-xs font-medium border-0 w-fit ${
                            CATEGORY_COLORS[exam.category] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {exam.category}
                        </Badge>

                        <h3 className="font-semibold text-foreground leading-snug mb-3 flex-1">
                          {exam.title}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <CalendarDays className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>
                            Exam:{" "}
                            <span className="font-medium text-foreground">
                              {exam.examDate}
                            </span>
                          </span>
                        </div>

                        {registered && (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-3">
                            <GraduationCap className="h-3.5 w-3.5" />
                            Registered
                          </div>
                        )}

                        {registered ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busy}
                            onClick={() =>
                              handleUnregister(exam.id, exam.title)
                            }
                            className="w-full rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
                            data-ocid={`courses.list.item.${i + 1}.delete_button`}
                          >
                            {busy ? (
                              <>
                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                Unregistering…
                              </>
                            ) : (
                              "Unregister"
                            )}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => setModalExam(exam)}
                            className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white"
                            data-ocid={`courses.list.item.${i + 1}.primary_button`}
                          >
                            Register
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />

      {/* Candidate info modal — opens when Register is clicked */}
      <CandidateInfoModal
        open={modalExam !== null}
        onOpenChange={(o) => {
          if (!o) setModalExam(null);
        }}
        exam={modalExam}
        onConfirm={handleConfirmRegister}
      />
    </div>
  );
}
