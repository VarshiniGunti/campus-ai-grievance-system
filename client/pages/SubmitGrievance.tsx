import { submitGrievance } from "@/config/firebase";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Upload,
  X,
  Image,
} from "lucide-react";
import { toast } from "sonner";

interface FormData {
  studentName: string;
  studentEmail: string;
  complaint: string;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  preview?: string; // base64
}

interface SubmissionResult {
  success: boolean;
  grievanceId?: string;
  error?: string;
}

const MAX_IMAGE_SIZE = 200 * 1024; // ✅ 200KB (Firestore safe)
const MAX_FILES = 5;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

/* -----------------------------------------
 ✅ Local AI Analyzer (No Gemini key needed)
------------------------------------------ */
function localAnalyzeComplaint(text: string) {
  const t = text.toLowerCase();

  // CATEGORY
  let category = "Other";

  if (t.includes("hostel") || t.includes("room") || t.includes("warden")) {
    category = "Hostel";
  } else if (t.includes("mess") || t.includes("food") || t.includes("rice")) {
    category = "Mess";
  } else if (
    t.includes("exam") ||
    t.includes("attendance") ||
    t.includes("class") ||
    t.includes("teacher") ||
    t.includes("grades")
  ) {
    category = "Academics";
  } else if (
    t.includes("wifi") ||
    t.includes("internet") ||
    t.includes("electricity") ||
    t.includes("water") ||
    t.includes("lift") ||
    t.includes("projector") ||
    t.includes("fan") ||
    t.includes("power")
  ) {
    category = "Infrastructure";
  } else if (
    t.includes("unsafe") ||
    t.includes("harassment") ||
    t.includes("theft") ||
    t.includes("security") ||
    t.includes("fight") ||
    t.includes("threat")
  ) {
    category = "Safety";
  } else if (
    t.includes("health") ||
    t.includes("doctor") ||
    t.includes("medicine") ||
    t.includes("hospital") ||
    t.includes("fever") ||
    t.includes("injury")
  ) {
    category = "Health";
  }

  // URGENCY
  let urgency: "Low" | "Medium" | "High" = "Low";

  if (
    t.includes("urgent") ||
    t.includes("immediately") ||
    t.includes("emergency") ||
    t.includes("danger") ||
    t.includes("serious") ||
    t.includes("accident")
  ) {
    urgency = "High";
  } else if (
    t.includes("soon") ||
    t.includes("not working") ||
    t.includes("issue") ||
    t.includes("problem") ||
    t.includes("delay")
  ) {
    urgency = "Medium";
  }

  // SENTIMENT
  let sentiment: "Neutral" | "Angry" | "Distressed" = "Neutral";
  if (
    t.includes("frustrated") ||
    t.includes("angry") ||
    t.includes("worst") ||
    t.includes("very bad") ||
    t.includes("annoyed")
  ) {
    sentiment = "Angry";
  }
  if (
    t.includes("scared") ||
    t.includes("unsafe") ||
    t.includes("panic") ||
    t.includes("distressed") ||
    t.includes("cry")
  ) {
    sentiment = "Distressed";
  }

  // SUMMARY
  const summary =
    text.length > 120 ? text.slice(0, 120).trim() + "..." : text.trim();

  return { category, urgency, sentiment, summary };
}

export default function SubmitGrievance() {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    studentEmail: "",
    complaint: "",
  });

  // ✅ UI + base64 stored here
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.studentName.trim()) {
      errors.studentName = "Name is required";
    }

    if (!formData.studentEmail.trim()) {
      errors.studentEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
      errors.studentEmail = "Please enter a valid email address";
    }

    if (!formData.complaint.trim()) {
      errors.complaint = "Please describe your grievance";
    } else if (formData.complaint.trim().length < 20) {
      errors.complaint =
        "Grievance description should be at least 20 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // ✅ Upload handler (Firestore base64 attachments only)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const pickedFiles = Array.from(files);

    for (const file of pickedFiles) {
      // ✅ Only images allowed for Firestore
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Only images are supported in demo mode (JPG/PNG/GIF).");
        continue;
      }

      // ✅ Size safety for Firestore doc limit
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(
          `${file.name} is too large. Please upload images under 200KB.`,
        );
        continue;
      }

      // ✅ Limit max attachments
      if (uploadedFiles.length >= MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} images allowed`);
        break;
      }

      // convert to base64
      const base64 = await fileToBase64(file);

      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          type: file.type,
          size: file.size,
          preview: base64,
        },
      ]);
    }

    toast.success("Image(s) added");
    e.currentTarget.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Submit grievance to Firestore with base64 attachments + local AI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ AI Analysis (local rule-based)
      const analysis = localAnalyzeComplaint(formData.complaint);

      const grievanceId = await submitGrievance({
        studentName: formData.studentName,
        studentEmail: formData.studentEmail,
        complaint: formData.complaint,

        // ✅ Save AI fields in Firestore
        category: analysis.category,
        urgency: analysis.urgency,
        sentiment: analysis.sentiment,
        summary: analysis.summary,

        // ✅ attachments in Firestore (base64)
        attachments: uploadedFiles.map((f) => ({
          name: f.name,
          type: f.type,
          size: f.size,
          base64: f.preview || "",
        })),
      } as any);

      setSubmissionResult({
        success: true,
        grievanceId,
      });

      setSubmitted(true);
      toast.success("Grievance submitted successfully!");

      setTimeout(() => {
        setFormData({
          studentName: "",
          studentEmail: "",
          complaint: "",
        });
        setUploadedFiles([]);
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
      setSubmissionResult({
        success: false,
        error: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
            <span className="font-semibold text-slate-900">Back to Home</span>
          </Link>
          <span className="text-sm text-slate-600">Submit Grievance</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!submitted ? (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Submit Your Grievance
              </h1>
              <p className="text-lg text-slate-600">
                Share your concern or complaint with us. You can optionally
                attach images to support your grievance.
              </p>
            </div>

            <Card className="p-8 border-slate-200 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="studentName"
                    className="block text-sm font-semibold text-slate-900 mb-2"
                  >
                    Your Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="studentName"
                    name="studentName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    className={
                      validationErrors.studentName ? "border-destructive" : ""
                    }
                    disabled={isLoading}
                  />
                  {validationErrors.studentName && (
                    <p className="mt-1 text-sm text-destructive">
                      {validationErrors.studentName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="studentEmail"
                    className="block text-sm font-semibold text-slate-900 mb-2"
                  >
                    Your Email Address{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="studentEmail"
                    name="studentEmail"
                    type="email"
                    placeholder="john@university.edu"
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                    className={
                      validationErrors.studentEmail ? "border-destructive" : ""
                    }
                    disabled={isLoading}
                  />
                  {validationErrors.studentEmail && (
                    <p className="mt-1 text-sm text-destructive">
                      {validationErrors.studentEmail}
                    </p>
                  )}
                </div>

                {/* Complaint */}
                <div>
                  <label
                    htmlFor="complaint"
                    className="block text-sm font-semibold text-slate-900 mb-2"
                  >
                    Your Grievance <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="complaint"
                    name="complaint"
                    placeholder="Describe your grievance in detail..."
                    value={formData.complaint}
                    onChange={handleInputChange}
                    rows={6}
                    className={`resize-none ${
                      validationErrors.complaint ? "border-destructive" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <div className="flex justify-between mt-2">
                    {validationErrors.complaint && (
                      <p className="text-sm text-destructive">
                        {validationErrors.complaint}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 ml-auto">
                      {formData.complaint.length} characters
                    </p>
                  </div>
                </div>

                {/* Upload Images */}
                <div>
                  <label
                    htmlFor="files"
                    className="block text-sm font-semibold text-slate-900 mb-2"
                  >
                    Attach Images (Optional)
                    <span className="text-slate-500 font-normal">
                      {" "}
                      – Demo mode stores images in Firestore
                    </span>
                  </label>

                  <div
                    className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary transition bg-slate-50 hover:bg-slate-100/50 cursor-pointer block"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 mb-2">
                      Click to browse images
                    </p>

                    <Input
                      ref={fileInputRef}
                      id="files"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                      className="hidden"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Choose Images
                    </Button>

                    <p className="text-xs text-slate-500 mt-3">
                      Max 200KB per image, up to {MAX_FILES} images. Formats:
                      JPG, PNG, GIF
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {uploadedFiles.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-3">
                      Attached Images ({uploadedFiles.length})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="bg-slate-100 rounded-lg overflow-hidden aspect-square">
                            {file.preview ? (
                              <img
                                src={file.preview}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full">
                                <Image className="w-6 h-6 text-slate-400" />
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <p className="text-xs text-slate-600 mt-1 truncate">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Grievance"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        studentName: "",
                        studentEmail: "",
                        complaint: "",
                      });
                      setUploadedFiles([]);
                      setValidationErrors({});
                    }}
                    disabled={isLoading}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </Card>

            {/* Info */}
            <Alert className="mt-8 border-accent/20 bg-accent/5">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertTitle>Why be specific?</AlertTitle>
              <AlertDescription>
                The more details and supporting evidence you provide, the better
                our system can understand and resolve your concern.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-8 border-success/20 bg-success/5 border-2">
              <div className="flex items-start gap-4 mb-6">
                <CheckCircle2 className="w-8 h-8 text-success flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Grievance Submitted Successfully!
                  </h2>
                  <p className="text-slate-600">
                    Your grievance has been received.
                  </p>
                </div>
              </div>
            </Card>

            {submissionResult?.grievanceId && (
              <Card className="p-6 border-slate-200">
                <p className="text-sm text-slate-600 font-medium mb-2">
                  Your Grievance ID
                </p>
                <p className="font-mono text-lg text-primary bg-slate-100 p-4 rounded-lg break-all">
                  {submissionResult.grievanceId}
                </p>
              </Card>
            )}

            <div className="flex gap-4">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
              <Link to="/submit-grievance" className="flex-1">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmissionResult(null);
                    setFormData({
                      studentName: "",
                      studentEmail: "",
                      complaint: "",
                    });
                    setUploadedFiles([]);
                  }}
                >
                  Submit Another
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}