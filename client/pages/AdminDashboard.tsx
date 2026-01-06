import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  LogOut
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
  createdAt: string;
}

interface Statistics {
  total: number;
  byCategory: Record<string, number>;
  byUrgency: Record<string, number>;
  bySentiment: Record<string, number>;
}

type FilterType = "category" | "urgency" | "none";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>("none");
  const [filterValue, setFilterValue] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const authenticatedAdmin = getAuthenticatedAdmin();

  const categories = ["Hostel", "Academics", "Mess", "Infrastructure", "Safety", "Health", "Other"];
  const urgencies = ["Low", "Medium", "High"];
  const sentiments = ["Neutral", "Angry", "Distressed"];

  const handleLogout = () => {
    logoutAdmin();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Fetch grievances and stats
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

  // Filter grievances
  const filteredGrievances = grievances.filter(g => {
    if (filterType === "category" && filterValue) {
      return g.category === filterValue;
    }
    if (filterType === "urgency" && filterValue) {
      return g.urgency === filterValue;
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
      "Hostel": "bg-blue-100 text-blue-800",
      "Academics": "bg-purple-100 text-purple-800",
      "Mess": "bg-orange-100 text-orange-800",
      "Infrastructure": "bg-green-100 text-green-800",
      "Safety": "bg-red-100 text-red-800",
      "Health": "bg-pink-100 text-pink-800",
      "Other": "bg-slate-100 text-slate-800",
    };
    return colors[category] || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
            <span className="font-semibold text-slate-900">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <span className="text-sm text-slate-600 font-semibold">Admin Dashboard</span>
          </div>
          <Button onClick={fetchData} variant="outline" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
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
                Total Grievances
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
              <p className="text-xs text-slate-500 mt-2">Require immediate action</p>
            </Card>

            <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-warning text-sm font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Medium Urgency
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.byUrgency["Medium"] || 0}</div>
              <p className="text-xs text-slate-500 mt-2">Scheduled for review</p>
            </Card>

            <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-slate-600 text-sm font-semibold mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Categories
              </div>
              <div className="text-3xl font-bold text-slate-900">{Object.keys(stats.byCategory).length}</div>
              <p className="text-xs text-slate-500 mt-2">Issue types found</p>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="p-6 border-slate-200 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-900 block mb-2">Filter By</label>
              <Select 
                value={filterType} 
                onValueChange={(value) => {
                  setFilterType(value as FilterType);
                  setFilterValue("");
                }}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Filter</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="urgency">Urgency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterType !== "none" && (
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  {filterType === "category" ? "Select Category" : "Select Urgency"}
                </label>
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder={`Choose ${filterType}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filterType === "category" ? (
                      categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))
                    ) : (
                      urgencies.map(urg => (
                        <SelectItem key={urg} value={urg}>{urg}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button 
              onClick={() => {
                setFilterType("none");
                setFilterValue("");
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
              {filterValue ? "No grievances match your filters" : "No grievances submitted yet"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredGrievances.map(grievance => (
              <Card
                key={grievance.id}
                className="p-6 border-slate-200 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setExpandedId(expandedId === grievance.id ? null : grievance.id)}
              >
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
                        <div className={`p-4 rounded-lg ${
                          grievance.urgency === "High" ? "bg-destructive/10" :
                          grievance.urgency === "Medium" ? "bg-warning/10" :
                          "bg-success/10"
                        }`}>
                          <p className="text-xs text-slate-600 font-semibold mb-1">URGENCY</p>
                          <p className={`text-lg font-bold ${
                            grievance.urgency === "High" ? "text-destructive" :
                            grievance.urgency === "Medium" ? "text-warning" :
                            "text-success"
                          }`}>
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
      </div>
    </div>
  );
}
