import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Download, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../contexts/AuthContext";
import RegistrationSlip from "./RegistrationSlip";

const STORAGE_KEY = "examportal_candidate_info";

export interface CandidateFormData {
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  gender: string;
  category: string;
  profession: string;
  institution: string;
  qualification: string;
  yearOfGraduation: string;
  abcId: string;
  localChapter: string;
  preferredCity: string;
  aadhaarNumber: string;
}

const DEFAULT_FORM: CandidateFormData = {
  fullName: "",
  mobile: "",
  email: "",
  dob: "",
  gender: "",
  category: "",
  profession: "",
  institution: "",
  qualification: "",
  yearOfGraduation: "",
  abcId: "",
  localChapter: "",
  preferredCity: "",
  aadhaarNumber: "",
};

export interface CandidateInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: {
    id: bigint;
    title: string;
    category: string;
    examDate: string;
  } | null;
  onConfirm: (examId: bigint) => Promise<void>;
}

type Step = "form" | "success";

export default function CandidateInfoModal({
  open,
  onOpenChange,
  exam,
  onConfirm,
}: CandidateInfoModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<CandidateFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CandidateFormData, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState("");

  // Pre-fill from localStorage or AuthContext when modal opens
  useEffect(() => {
    if (!open) return;
    setStep("form");
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(false);

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CandidateFormData;
        setFormData(parsed);
        return;
      } catch {
        // fall through
      }
    }
    setFormData({
      ...DEFAULT_FORM,
      fullName: user?.fullName ?? "",
      mobile: user?.mobile ?? "",
      email: user?.email ?? "",
    });
  }, [open, user]);

  const setField = (key: keyof CandidateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof CandidateFormData, string>> = {};
    if (!formData.fullName.trim()) errs.fullName = "Required";
    if (!/^\d{10}$/.test(formData.mobile))
      errs.mobile = "Must be exactly 10 digits";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email address";
    if (!formData.dob) errs.dob = "Required";
    if (!formData.gender) errs.gender = "Please select a gender";
    if (!formData.category) errs.category = "Please select a category";
    if (!formData.profession) errs.profession = "Please select a profession";
    if (!formData.institution.trim()) errs.institution = "Required";
    if (!formData.qualification)
      errs.qualification = "Please select a qualification";
    if (formData.yearOfGraduation && !/^\d{4}$/.test(formData.yearOfGraduation))
      errs.yearOfGraduation = "Must be a 4-digit year";
    if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber))
      errs.aadhaarNumber = "Must be exactly 12 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !exam) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      await onConfirm(exam.id);
      const regId = `EXAM-${exam.id.toString()}-${Date.now().toString().slice(-6)}`;
      setRegistrationId(regId);
      localStorage.setItem(
        `examportal_slip_${exam.id.toString()}`,
        JSON.stringify({
          registrationId: regId,
          candidateInfo: formData,
          examTitle: exam.title,
          examDate: exam.examDate,
          examCategory: exam.category,
        }),
      );
      setStep("success");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadSlip = () => {
    requestAnimationFrame(() => {
      window.print();
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("form");
      setErrors({});
      setSubmitError(null);
    }, 300);
  };

  const FieldError = ({ field }: { field: keyof CandidateFormData }) =>
    errors[field] ? (
      <p className="text-xs text-destructive mt-1" role="alert">
        {errors[field]}
      </p>
    ) : null;

  const Req = () => (
    <span className="text-destructive ml-0.5" aria-hidden="true">
      *
    </span>
  );

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) handleClose();
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[92vh] flex flex-col p-0 gap-0 rounded-2xl overflow-hidden">
          {step === "form" ? (
            <>
              {/* ── Header ── */}
              <DialogHeader className="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 via-accent/20 to-transparent shrink-0">
                <DialogTitle className="text-xl font-bold text-foreground">
                  Candidate Registration Form
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Registering for&nbsp;
                  <strong className="text-foreground font-semibold">
                    {exam?.title}
                  </strong>
                </p>
              </DialogHeader>

              {/* ── Scrollable Form Body + Sticky Footer ── */}
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col flex-1 min-h-0"
              >
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                  {/* ──── Section A: Personal Details ──── */}
                  <section aria-label="Personal Details">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                        A
                      </div>
                      <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">
                        Personal Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="sm:col-span-2">
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium"
                        >
                          Full Name
                          <Req />
                        </Label>
                        <Input
                          id="fullName"
                          className={`mt-1.5 ${errors.fullName ? "!border-destructive" : ""}`}
                          placeholder="As per official records"
                          value={formData.fullName}
                          onChange={(e) => setField("fullName", e.target.value)}
                          autoComplete="name"
                          data-ocid="candidate_form.fullName.input"
                        />
                        <FieldError field="fullName" />
                      </div>

                      {/* Mobile */}
                      <div>
                        <Label htmlFor="mobile" className="text-sm font-medium">
                          Mobile Number
                          <Req />
                        </Label>
                        <Input
                          id="mobile"
                          className={`mt-1.5 ${errors.mobile ? "!border-destructive" : ""}`}
                          placeholder="10-digit number"
                          value={formData.mobile}
                          onChange={(e) =>
                            setField(
                              "mobile",
                              e.target.value.replace(/\D/g, "").slice(0, 10),
                            )
                          }
                          inputMode="numeric"
                          autoComplete="tel"
                          data-ocid="candidate_form.mobile.input"
                        />
                        <FieldError field="mobile" />
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email ID
                          <Req />
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className={`mt-1.5 ${errors.email ? "!border-destructive" : ""}`}
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setField("email", e.target.value)}
                          autoComplete="email"
                          data-ocid="candidate_form.email.input"
                        />
                        <FieldError field="email" />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <Label htmlFor="dob" className="text-sm font-medium">
                          Date of Birth
                          <Req />
                        </Label>
                        <Input
                          id="dob"
                          type="date"
                          className={`mt-1.5 ${errors.dob ? "!border-destructive" : ""}`}
                          value={formData.dob}
                          onChange={(e) => setField("dob", e.target.value)}
                          max={new Date().toISOString().split("T")[0]}
                          data-ocid="candidate_form.dob.input"
                        />
                        <FieldError field="dob" />
                      </div>

                      {/* Gender */}
                      <div>
                        <Label className="text-sm font-medium">
                          Gender
                          <Req />
                        </Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(v) => setField("gender", v)}
                        >
                          <SelectTrigger
                            className={`mt-1.5 ${errors.gender ? "!border-destructive" : ""}`}
                            data-ocid="candidate_form.gender.select"
                          >
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError field="gender" />
                      </div>

                      {/* Category */}
                      <div>
                        <Label className="text-sm font-medium">
                          Category
                          <Req />
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(v) => setField("category", v)}
                        >
                          <SelectTrigger
                            className={`mt-1.5 ${errors.category ? "!border-destructive" : ""}`}
                            data-ocid="candidate_form.category.select"
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="OBC">OBC</SelectItem>
                            <SelectItem value="SC">SC</SelectItem>
                            <SelectItem value="ST">ST</SelectItem>
                            <SelectItem value="PwD">PwD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError field="category" />
                      </div>
                    </div>
                  </section>

                  <Separator />

                  {/* ──── Section B: Academic Details ──── */}
                  <section aria-label="Academic Details">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                        B
                      </div>
                      <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">
                        Academic Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Profession */}
                      <div>
                        <Label className="text-sm font-medium">
                          Profession
                          <Req />
                        </Label>
                        <Select
                          value={formData.profession}
                          onValueChange={(v) => setField("profession", v)}
                        >
                          <SelectTrigger
                            className={`mt-1.5 ${errors.profession ? "!border-destructive" : ""}`}
                            data-ocid="candidate_form.profession.select"
                          >
                            <SelectValue placeholder="Select profession" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Working Professional">
                              Working Professional
                            </SelectItem>
                            <SelectItem value="Others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError field="profession" />
                      </div>

                      {/* Qualification */}
                      <div>
                        <Label className="text-sm font-medium">
                          Educational Qualification
                          <Req />
                        </Label>
                        <Select
                          value={formData.qualification}
                          onValueChange={(v) => setField("qualification", v)}
                        >
                          <SelectTrigger
                            className={`mt-1.5 ${
                              errors.qualification ? "!border-destructive" : ""
                            }`}
                            data-ocid="candidate_form.qualification.select"
                          >
                            <SelectValue placeholder="Select qualification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="B.Tech">B.Tech</SelectItem>
                            <SelectItem value="M.Sc">M.Sc</SelectItem>
                            <SelectItem value="B.Sc">B.Sc</SelectItem>
                            <SelectItem value="XIIth Pass">
                              XIIth Pass
                            </SelectItem>
                            <SelectItem value="Diploma">Diploma</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError field="qualification" />
                      </div>

                      {/* Institution */}
                      <div className="sm:col-span-2">
                        <Label
                          htmlFor="institution"
                          className="text-sm font-medium"
                        >
                          Institution / Organization Name
                          <Req />
                        </Label>
                        <Input
                          id="institution"
                          className={`mt-1.5 ${
                            errors.institution ? "!border-destructive" : ""
                          }`}
                          placeholder="Your college, university, or organization"
                          value={formData.institution}
                          onChange={(e) =>
                            setField("institution", e.target.value)
                          }
                          data-ocid="candidate_form.institution.input"
                        />
                        <FieldError field="institution" />
                      </div>
                    </div>
                  </section>

                  <Separator />

                  {/* ──── Section C: Optional Details ──── */}
                  <section aria-label="Additional Details">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-border bg-muted text-muted-foreground text-xs font-bold shrink-0">
                        C
                      </div>
                      <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">
                        Additional Details
                      </h3>
                      <span className="text-xs bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium">
                        Optional
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Year of Graduation */}
                      <div>
                        <Label
                          htmlFor="yearOfGraduation"
                          className="text-sm font-medium"
                        >
                          Year of Graduation
                        </Label>
                        <Input
                          id="yearOfGraduation"
                          className={`mt-1.5 ${
                            errors.yearOfGraduation ? "!border-destructive" : ""
                          }`}
                          placeholder="e.g., 2024"
                          value={formData.yearOfGraduation}
                          onChange={(e) =>
                            setField(
                              "yearOfGraduation",
                              e.target.value.replace(/\D/g, "").slice(0, 4),
                            )
                          }
                          inputMode="numeric"
                          data-ocid="candidate_form.yearOfGraduation.input"
                        />
                        <FieldError field="yearOfGraduation" />
                      </div>

                      {/* ABC ID */}
                      <div>
                        <Label htmlFor="abcId" className="text-sm font-medium">
                          Academic Bank of Credits (ABC) ID
                        </Label>
                        <Input
                          id="abcId"
                          className="mt-1.5"
                          placeholder="If available"
                          value={formData.abcId}
                          onChange={(e) => setField("abcId", e.target.value)}
                          data-ocid="candidate_form.abcId.input"
                        />
                      </div>

                      {/* Local Chapter */}
                      <div>
                        <Label
                          htmlFor="localChapter"
                          className="text-sm font-medium"
                        >
                          Local Chapter
                        </Label>
                        <Input
                          id="localChapter"
                          className="mt-1.5"
                          placeholder="If your institution is part of one"
                          value={formData.localChapter}
                          onChange={(e) =>
                            setField("localChapter", e.target.value)
                          }
                          data-ocid="candidate_form.localChapter.input"
                        />
                      </div>

                      {/* Preferred Exam Center City */}
                      <div>
                        <Label
                          htmlFor="preferredCity"
                          className="text-sm font-medium"
                        >
                          Preferred Exam Center City
                        </Label>
                        <Input
                          id="preferredCity"
                          className="mt-1.5"
                          placeholder="City for certification exam"
                          value={formData.preferredCity}
                          onChange={(e) =>
                            setField("preferredCity", e.target.value)
                          }
                          data-ocid="candidate_form.preferredCity.input"
                        />
                      </div>

                      {/* Aadhaar Number */}
                      <div className="sm:col-span-2">
                        <Label
                          htmlFor="aadhaarNumber"
                          className="text-sm font-medium"
                        >
                          Aadhaar Number
                          <span className="text-xs text-muted-foreground ml-2 font-normal">
                            (12 digits — may be required at exam centre)
                          </span>
                        </Label>
                        <Input
                          id="aadhaarNumber"
                          className={`mt-1.5 ${
                            errors.aadhaarNumber ? "!border-destructive" : ""
                          }`}
                          placeholder="12-digit Aadhaar number"
                          value={formData.aadhaarNumber}
                          onChange={(e) =>
                            setField(
                              "aadhaarNumber",
                              e.target.value.replace(/\D/g, "").slice(0, 12),
                            )
                          }
                          inputMode="numeric"
                          autoComplete="off"
                          data-ocid="candidate_form.aadhaar.input"
                        />
                        <FieldError field="aadhaarNumber" />
                      </div>
                    </div>
                  </section>

                  {/* Submit error */}
                  {submitError && (
                    <Alert
                      variant="destructive"
                      data-ocid="candidate_form.error_state"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* ── Sticky Footer ── */}
                <div className="shrink-0 border-t border-border bg-white px-6 py-4 flex items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-destructive font-bold">*</span>{" "}
                    Required fields
                  </p>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      className="rounded-xl"
                      data-ocid="candidate_form.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                      data-ocid="candidate_form.submit_button"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering…
                        </>
                      ) : (
                        "Submit & Register"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            /* ── Step 2: Success ── */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="p-6 overflow-y-auto space-y-5"
            >
              {/* Checkmark */}
              <div className="text-center pt-2">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 14,
                    delay: 0.1,
                  }}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20 mb-3"
                >
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </motion.div>
                <h2 className="text-xl font-bold text-foreground">
                  Registration Successful!
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  You have been successfully registered for this exam.
                </p>
              </div>

              {/* Registration ID */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide font-medium">
                  Registration Number
                </p>
                <p className="text-xl font-mono font-bold text-primary tracking-[0.12em]">
                  {registrationId}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Exam Details
                  </h3>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Course
                      </span>
                      <p className="text-sm font-medium text-foreground leading-snug">
                        {exam?.title}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium text-foreground text-right max-w-[55%]">
                        {exam?.category}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exam Date</span>
                      <span className="font-medium text-foreground">
                        {exam?.examDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Candidate
                  </h3>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Name
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        {formData.fullName}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Email
                      </span>
                      <p className="text-sm font-medium text-foreground break-all">
                        {formData.email}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mobile</span>
                      <span className="font-medium text-foreground">
                        {formData.mobile}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pb-1">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={handleClose}
                  data-ocid="candidate_success.close_button"
                >
                  Close
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleDownloadSlip}
                  data-ocid="candidate_success.download_button"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Slip
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print portal — hidden on screen, visible only during @media print */}
      {step === "success" &&
        exam &&
        createPortal(
          <div className="print-slip">
            <RegistrationSlip
              exam={exam}
              candidateInfo={formData as unknown as Record<string, string>}
              registrationId={registrationId}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
