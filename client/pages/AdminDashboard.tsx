import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  BarChart3,
  Loader2,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  Filter,
  LogOut,
  Search,
  Trash2,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { logoutAdmin, getAuthenticatedAdmin } from "@/utils/admin-auth";

interface Grievance {
  id: string;
  studentName: string;
  studentEmail: string;
  complaint: string;
  category: string;
  urgency: string;
  sentiment: string;
  summary: string;
  status: "submitted" | "viewed" | "cleared";
  createdAt: string;
  updatedAt: string;
}

interface Statistics {
  total: number;
  byCategory: Record<string, number>;
  byUrgency: Record<string, number>;
  bySentiment: Record<string, number>;
  byStatus?: Record<string, number>;
}

type FilterType = "category" | "urgency" | "status" | "date" | "none";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>("none");
  const [filterValue, setFilterValue] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchId, setSearchId] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showStatusModal, setShowStatusModal] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const authenticatedAdmin = getAuthenticatedAdmin();

  const categories = ["Hostel", "Academics", "Mess", "Infrastructure", "Safety", "Health", "Other"];
  const urgencies = ["Low", "Medium", "High"];
  const sentiments = ["Neutral", "Angry", "Distressed"];
  const statuses = ["submitted", "viewed", "cleared"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [grievancesRes, statsRes] = await Promise.all([
        fetch("/api/grievances"),
        fetch("/api/grievances/stats"),
      ]);

      if (!grievancesRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const grievancesData = await grievancesRes.json();
      const statsData = await statsRes.json();

      setGrievances(grievancesData.grievances || []);
      setStats(statsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load data";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      toast.error("Please enter a grievance ID");
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(`/api/grievances/search/${searchId.trim()}`);
      if (!response.ok) {
        throw new Error("Grievance not found");
      }
      const result = await response.json();
      setGrievances([result.grievance]);
      toast.success("Grievance found!");
    } catch (error) {
      toast.error("Grievance not found with this ID");
      setGrievances([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchId("");
    fetchData();
  };

  const handleUpdateStatus = async (grievanceId: string, status: "viewed" | "cleared") => {
    try {
      const response = await fetch(`/api/grievances/${grievanceId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, message: statusMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const result = await response.json();
      toast.success(
        `Grievance marked as ${status}. ${result.emailNotificationSent ? "✉️ Email sent to student." : ""}`
      );

      setShowStatusModal(null);
      setStatusMessage("");
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (grievanceId: string) => {
    if (!confirm("Are you sure you want to delete this grievance? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/grievances/${grievanceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete grievance");
      }

      toast.success("Grievance deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete grievance");
    }
  };

  const filteredGrievances = grievances.filter((g) => {
    if (filterType === "category" && filterValue) {
      return g.category === filterValue;
    }
    if (filterType === "urgency" && filterValue) {
      return g.urgency === filterValue;
    }
    if (filterType === "status" && filterValue) {
      return g.status === filterValue;
    }
    if (filterType === "date" && (startDate || endDate)) {
      const gDate = new Date(g.createdAt);
      if (startDate) {
        const start = new Date(startDate);
        if (gDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (gDate > end) return false;
      }
      return true;
    }
    return true;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "Low":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Angry":
        return "bg-destructive/10 text-destructive";
      case "Distressed":
        return "bg-warning/10 text-warning";
      case "Neutral":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Hostel: "bg-blue-100 text-blue-800",
      Academics: "bg-purple-100 text-purple-800",
      Mess: "bg-orange-100 text-orange-800",
      Infrastructure: "bg-green-100 text-green-800",
      Safety: "bg-red-100 text-red-800",
      Health: "bg-pink-100 text-pink-800",
      Other: "bg-slate-100 text-slate-800",
    };
    return colors[category] || "bg-slate-100 text-slate-800";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "viewed":
        return "bg-yellow-100 text-yellow-800";
      case "cleared":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
            <span className="font-semibold text-slate-900">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <span className="text-sm text-slate-600 font-semibold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {authenticatedAdmin && (
              <span className="text-sm text-slate-600 hidden sm:inline">
                Logged in as: <span className="font-semibold text-slate-900">{authenticatedAdmin.email}</span>
              </span>
            )}
            <Button onClick={fetchData} variant="outline" disabled={isLoading} size="sm">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Grievance Dashboard</h1>
          <p className="text-lg text-slate-600">
            View and manage all campus grievances with AI-powered insights
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-slate-600 text-sm font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Total
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
              <p className="text-xs text-slate-500 mt-2">All submissions</p>
            </Card>

            <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-destructive text-sm font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                High Urgency
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.byUrgency["High"] || 0}</div>
              <p className="text-xs text-slate-500 mt-2">Immediate action needed</p>
            </Card>

            <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-blue-600 text-sm font-semibold mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Viewed
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.byStatus?.viewed || 0}</div>
              <p className="text-xs text-slate-500 mt-2">Under review</p>
            </Card>

            <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-success text-sm font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Cleared
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.byStatus?.cleared || 0}</div>
              <p className="text-xs text-slate-500 mt-2">Resolved</p>
            </Card>
          </div>
        )}

        {/* Search Section */}
        <Card className="p-6 border-slate-200 mb-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-900 block mb-2">Search by Grievance ID</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., grievance_1234567890_abc123"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  disabled={searchLoading}
                />
                <Button type="submit" disabled={searchLoading} className="gap-2">
                  {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span className="hidden sm:inline">Search</span>
                </Button>
                {searchId && (
                  <Button type="button" variant="outline" onClick={handleClearSearch} disabled={searchLoading}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Card>

        {/* Filters */}
        <Card className="p-6 border-slate-200 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 min-w-0">
              <label className="text-sm font-semibold text-slate-900 block mb-2">Filter By</label>
              <Select
                value={filterType}
                onValueChange={(value) => {
                  setFilterType(value as FilterType);
                  setFilterValue("");
                  setStartDate("");
                  setEndDate("");
                }}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Filter</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="urgency">Urgency</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="date">Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterType === "category" && (
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-900 block mb-2">Select Category</label>
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Choose category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterType === "urgency" && (
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-900 block mb-2">Select Urgency</label>
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Choose urgency..." />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencies.map((urg) => (
                      <SelectItem key={urg} value={urg}>
                        {urg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterType === "status" && (
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-900 block mb-2">Select Status</label>
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Choose status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterType === "date" && (
              <div className="flex gap-2 flex-1 min-w-0">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-slate-900 block mb-2">From Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-slate-900 block mb-2">To Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                setFilterType("none");
                setFilterValue("");
                setStartDate("");
                setEndDate("");
              }}
              variant="outline"
              className="sm:mt-6"
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Grievances List */}
        {isLoading ? (
          <Card className="p-12 text-center border-slate-200">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
            <p className="text-slate-600">Loading grievances...</p>
          </Card>
        ) : filteredGrievances.length === 0 ? (
          <Card className="p-12 text-center border-slate-200">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">
              {searchId ? "No grievance found with this ID" : filterValue ? "No grievances match your filters" : "No grievances submitted yet"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredGrievances.map((grievance) => (
              <Card key={grievance.id} className="p-6 border-slate-200 hover:shadow-md transition-all cursor-pointer" onClick={() => setExpandedId(expandedId === grievance.id ? null : grievance.id)}>
                <div className="flex flex-col gap-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 truncate">
                        From: {grievance.studentName}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">{grievance.studentEmail}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(grievance.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap justify-end">
                      <Badge className={`whitespace-nowrap ${getCategoryColor(grievance.category)}`}>
                        {grievance.category}
                      </Badge>
                      <Badge className={`whitespace-nowrap border ${getUrgencyColor(grievance.urgency)}`}>
                        {grievance.urgency}
                      </Badge>
                      <Badge className={`whitespace-nowrap ${getStatusColor(grievance.status)}`}>
                        {grievance.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Summary Row */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-700 line-clamp-2">{grievance.summary}</p>
                  </div>

                  {/* Sentiment Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Sentiment:</span>
                    <Badge className={`whitespace-nowrap ${getSentimentColor(grievance.sentiment)}`}>
                      {grievance.sentiment}
                    </Badge>
                  </div>

                  {/* Expanded Content */}
                  {expandedId === grievance.id && (
                    <div className="border-t pt-4 mt-4 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">Full Complaint</p>
                        <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                          {grievance.complaint}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-xs text-slate-600 font-semibold mb-1">CATEGORY</p>
                          <p className="text-lg font-bold text-blue-900">{grievance.category}</p>
                        </div>
                        <div
                          className={`p-4 rounded-lg ${
                            grievance.urgency === "High"
                              ? "bg-destructive/10"
                              : grievance.urgency === "Medium"
                                ? "bg-warning/10"
                                : "bg-success/10"
                          }`}
                        >
                          <p className="text-xs text-slate-600 font-semibold mb-1">URGENCY</p>
                          <p
                            className={`text-lg font-bold ${
                              grievance.urgency === "High"
                                ? "text-destructive"
                                : grievance.urgency === "Medium"
                                  ? "text-warning"
                                  : "text-success"
                            }`}
                          >
                            {grievance.urgency}
                          </p>
                        </div>
                        <div className={`p-4 rounded-lg ${getSentimentColor(grievance.sentiment)}`}>
                          <p className="text-xs text-slate-600 font-semibold mb-1">SENTIMENT</p>
                          <p className="text-lg font-bold">{grievance.sentiment}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">ADMIN SUMMARY</p>
                        <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                          {grievance.summary}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-xs font-semibold text-slate-600 mb-2">GRIEVANCE ID</p>
                        <p className="font-mono text-sm text-slate-700 break-all">{grievance.id}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {grievance.status !== "viewed" && (
                          <Button
                            size="sm"
                            className="gap-2 flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowStatusModal(grievance.id);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                            Mark as Viewed
                          </Button>
                        )}
                        {grievance.status !== "cleared" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowStatusModal(`${grievance.id}-clear`);
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark as Cleared
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(grievance.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Expand Indicator */}
                  <p className="text-xs text-primary text-center mt-2">
                    {expandedId === grievance.id ? "Click to collapse" : "Click to view details"}
                  </p>
                </div>
              </Card>
            ))}

            <div className="text-center pt-4">
              <p className="text-sm text-slate-600">
                Showing {filteredGrievances.length} of {grievances.length} grievances
              </p>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Mark as {showStatusModal.includes("-clear") ? "Cleared" : "Viewed"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Optional Message (will be sent to student)
                  </label>
                  <textarea
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="e.g., Issue has been resolved. Please contact if you need further assistance."
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleUpdateStatus(
                        showStatusModal.replace("-clear", ""),
                        showStatusModal.includes("-clear") ? "cleared" : "viewed"
                      )
                    }
                    className="flex-1"
                  >
                    Confirm
                  </Button>
                  <Button variant="outline" onClick={() => setShowStatusModal(null)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
