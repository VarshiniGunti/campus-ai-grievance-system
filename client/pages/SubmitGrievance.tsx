import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Video,
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
  preview?: string;
}

interface SubmissionResult {
  success: boolean;
  grievanceId?: string;
  analysis?: {
    category: string;
    urgency: string;
    sentiment: string;
    summary: string;
  };
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/webm",
];

export default function SubmitGrievance() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    studentEmail: "",
    complaint: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(
          `File type not allowed: ${file.name}. Please use JPG, PNG, GIF, MP4, or WebM.`,
        );
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        continue;
      }

      // Check total files
      if (uploadedFiles.length + newFiles.length >= 5) {
        toast.error("Maximum 5 files allowed per grievance");
        break;
      }

      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview = e.target?.result as string;
          const fileToAdd = { ...newFiles[i], preview };
          setUploadedFiles((prev) => [...prev, fileToAdd]);
        };
        reader.readAsDataURL(file);
      }

      newFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        preview,
      });
    }

    if (newFiles.length > 0 && !newFiles[0].preview) {
      setUploadedFiles((prev) => [
        ...prev,
        ...newFiles.filter((f) => f.type.startsWith("video/")),
      ]);
    }

    toast.success(`${newFiles.length} file(s) added`);
    e.currentTarget.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData with files
      const submitData = new FormData();
      submitData.append("studentName", formData.studentName);
      submitData.append("studentEmail", formData.studentEmail);
      submitData.append("complaint", formData.complaint);

      // Note: In a real app, you would append actual File objects here
      // For now, we're just sending metadata
      submitData.append("attachmentCount", uploadedFiles.length.toString());

      const response = await fetch("/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result: SubmissionResult = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit grievance");
      }

      setSubmissionResult(result);
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
                attach images or videos to support your grievance.
              </p>
            </div>

            <Card className="p-8 border-slate-200 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
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

                {/* Email Field */}
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

                {/* Complaint Field */}
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
                    placeholder="Describe your grievance in detail. Be as specific as possible to help us understand and resolve your concern..."
                    value={formData.complaint}
                    onChange={handleInputChange}
                    rows={6}
                    className={`resize-none ${validationErrors.complaint ? "border-destructive" : ""}`}
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

                {/* File Upload Field */}
                <div>
                  <label
                    htmlFor="files"
                    className="block text-sm font-semibold text-slate-900 mb-2"
                  >
                    Attach Images or Videos{" "}
                    <span className="text-slate-500 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary transition bg-slate-50 hover:bg-slate-100/50">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 mb-2">
                      Drag and drop your files here, or click to browse
                    </p>
                    <Input
                      id="files"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                      className="hidden"
                    />
                    <label htmlFor="files" className="inline-block">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                      >
                        Choose Files
                      </Button>
                    </label>
                    <p className="text-xs text-slate-500 mt-3">
                      Max 5MB per file, up to 5 files. Formats: JPG, PNG, GIF,
                      MP4, WebM
                    </p>
                  </div>
                </div>

                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-3">
                      Attached Files ({uploadedFiles.length})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          {file.type.startsWith("image/") ? (
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
                          ) : (
                            <div className="bg-slate-100 rounded-lg aspect-square flex items-center justify-center">
                              <Video className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
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

                {/* Action Buttons */}
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

            {/* Info Alert */}
            <Alert className="mt-8 border-accent/20 bg-accent/5">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertTitle>Why be specific?</AlertTitle>
              <AlertDescription>
                The more details and supporting evidence you provide, the better
                our AI system can understand and categorize your grievance,
                leading to faster resolution.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <Card className="p-8 border-success/20 bg-success/5 border-2">
              <div className="flex items-start gap-4 mb-6">
                <CheckCircle2 className="w-8 h-8 text-success flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Grievance Submitted Successfully!
                  </h2>
                  <p className="text-slate-600">
                    Your grievance has been received
                    {uploadedFiles.length > 0 &&
                      ` with ${uploadedFiles.length} attachment(s)`}{" "}
                    and our AI system is analyzing it right now.
                  </p>
                </div>
              </div>
            </Card>

            {/* Grievance ID */}
            {submissionResult?.grievanceId && (
              <Card className="p-6 border-slate-200">
                <div className="mb-2">
                  <p className="text-sm text-slate-600 font-medium">
                    Your Grievance ID
                  </p>
                </div>
                <p className="font-mono text-lg text-primary bg-slate-100 p-4 rounded-lg break-all">
                  {submissionResult.grievanceId}
                </p>
                <p className="text-sm text-slate-600 mt-3">
                  Keep this ID for your reference. You can use it to track your
                  grievance.
                </p>
              </Card>
            )}

            {/* AI Analysis Results */}
            {submissionResult?.analysis && (
              <Card className="p-8 border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  AI Analysis Results
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">
                      Category
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {submissionResult.analysis.category}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">
                      Urgency
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          submissionResult.analysis.urgency === "High"
                            ? "bg-destructive"
                            : submissionResult.analysis.urgency === "Medium"
                              ? "bg-warning"
                              : "bg-success"
                        }`}
                      ></span>
                      <p className="text-lg font-bold text-slate-900">
                        {submissionResult.analysis.urgency}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">
                      Sentiment
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {submissionResult.analysis.sentiment}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">
                      Status
                    </p>
                    <p className="text-lg font-bold text-success">Submitted</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <p className="text-sm text-slate-600 font-semibold mb-2 uppercase">
                    Summary for Admin
                  </p>
                  <p className="text-slate-800 leading-relaxed">
                    {submissionResult.analysis.summary}
                  </p>
                </div>
              </Card>
            )}

            {/* Next Steps */}
            <Card className="p-8 border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                What Happens Next?
              </h3>
              <ol className="space-y-3 text-slate-700">
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-6">1.</span>
                  <span>
                    Our administrators will review your grievance using the
                    AI-generated summary
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-6">2.</span>
                  <span>
                    The grievance will be prioritized based on the urgency level
                    (Low, Medium, High)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-6">3.</span>
                  <span>
                    You'll receive updates via email as your grievance is
                    processed
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-6">4.</span>
                  <span>Once resolved, you'll be notified of the outcome</span>
                </li>
              </ol>
            </Card>

            {/* Action Buttons */}
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
