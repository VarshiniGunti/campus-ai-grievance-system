import { RequestHandler } from "express";
import { analyzeGrievance } from "../utils/ai-analysis";
import { sendStatusNotification } from "../utils/email-service";

// Mock database (replace with actual Firebase operations)
interface StoredGrievance {
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

const grievances: Map<string, StoredGrievance> = new Map();

/**
 * Submit a new grievance
 * POST /api/grievances
 */
export const submitGrievance: RequestHandler = async (req, res) => {
  try {
    const { studentName, studentEmail, complaint } = req.body;

    // Validation
    if (!studentName || !studentEmail || !complaint) {
      res.status(400).json({
        error: "Missing required fields: studentName, studentEmail, complaint",
      });
      return;
    }

    // Analyze the complaint using AI
    const analysis = await analyzeGrievance(complaint);

    // Create grievance record
    const grievanceId = `grievance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const grievance: StoredGrievance = {
      id: grievanceId,
      studentName,
      studentEmail,
      complaint,
      category: analysis.category,
      urgency: analysis.urgency,
      sentiment: analysis.sentiment,
      summary: analysis.summary,
      status: "submitted",
      createdAt: now,
      updatedAt: now,
    };

    // Store in mock database (would be Firebase in production)
    grievances.set(grievanceId, grievance);

    res.status(201).json({
      success: true,
      grievanceId,
      analysis: {
        category: analysis.category,
        urgency: analysis.urgency,
        sentiment: analysis.sentiment,
        summary: analysis.summary,
      },
    });
  } catch (error) {
    console.error("Error submitting grievance:", error);
    res.status(500).json({
      error: "Failed to submit grievance",
    });
  }
};

/**
 * Get all grievances with optional filtering
 * GET /api/grievances?category=Academics&urgency=High&startDate=2024-01-01&endDate=2024-12-31
 */
export const getGrievances: RequestHandler = (req, res) => {
  try {
    const { category, urgency, startDate, endDate } = req.query;

    let results = Array.from(grievances.values());

    // Apply filters if provided
    if (category && typeof category === "string") {
      results = results.filter((g) => g.category === category);
    }

    if (urgency && typeof urgency === "string") {
      results = results.filter((g) => g.urgency === urgency);
    }

    // Date range filter
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate as string) : new Date(0);
      const end = endDate ? new Date(endDate as string) : new Date();

      results = results.filter((g) => {
        const date = new Date(g.createdAt);
        return date >= start && date <= end;
      });
    }

    // Sort by creation date (newest first)
    results.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    res.json({
      count: results.length,
      grievances: results,
    });
  } catch (error) {
    console.error("Error fetching grievances:", error);
    res.status(500).json({
      error: "Failed to fetch grievances",
    });
  }
};

/**
 * Search grievance by ID
 * GET /api/grievances/search/:id
 */
export const searchGrievanceById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.trim().length === 0) {
      res.status(400).json({
        error: "Grievance ID is required",
      });
      return;
    }

    const grievance = grievances.get(id.trim());
    if (!grievance) {
      res.status(404).json({
        error: `Grievance with ID "${id}" not found`,
        grievanceId: id,
      });
      return;
    }

    res.json({
      success: true,
      grievance,
    });
  } catch (error) {
    console.error("Error searching grievance:", error);
    res.status(500).json({
      error: "Failed to search grievance",
    });
  }
};

/**
 * Update grievance status (viewed/cleared)
 * PATCH /api/grievances/:id/status
 */
export const updateGrievanceStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    // Validation
    if (!id) {
      res.status(400).json({
        error: "Grievance ID is required",
      });
      return;
    }

    if (!status || !["viewed", "cleared"].includes(status)) {
      res.status(400).json({
        error: "Status must be either 'viewed' or 'cleared'",
      });
      return;
    }

    const grievance = grievances.get(id);
    if (!grievance) {
      res.status(404).json({
        error: "Grievance not found",
      });
      return;
    }

    // Update grievance
    grievance.status = status;
    grievance.updatedAt = new Date().toISOString();
    grievances.set(id, grievance);

    // Send email notification
    const emailSent = await sendStatusNotification({
      to: grievance.studentEmail,
      studentName: grievance.studentName,
      grievanceId: grievance.id,
      status: status as "viewed" | "cleared",
      category: grievance.category,
      urgency: grievance.urgency,
      message,
    });

    res.json({
      success: true,
      grievance,
      emailNotificationSent: emailSent,
      message: `Grievance marked as ${status}. ${emailSent ? "Email notification sent." : "Email notification could not be sent."}`,
    });
  } catch (error) {
    console.error("Error updating grievance status:", error);
    res.status(500).json({
      error: "Failed to update grievance status",
    });
  }
};

/**
 * Delete a grievance
 * DELETE /api/grievances/:id
 */
export const deleteGrievance: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        error: "Grievance ID is required",
      });
      return;
    }

    const grievance = grievances.get(id);
    if (!grievance) {
      res.status(404).json({
        error: "Grievance not found",
      });
      return;
    }

    grievances.delete(id);

    res.json({
      success: true,
      message: "Grievance deleted successfully",
      deletedGrievanceId: id,
    });
  } catch (error) {
    console.error("Error deleting grievance:", error);
    res.status(500).json({
      error: "Failed to delete grievance",
    });
  }
};

/**
 * Get a single grievance by ID (legacy endpoint)
 * GET /api/grievances/:id
 */
export const getGrievanceById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const grievance = grievances.get(id);
    if (!grievance) {
      res.status(404).json({
        error: "Grievance not found",
      });
      return;
    }

    res.json({
      grievance,
    });
  } catch (error) {
    console.error("Error fetching grievance:", error);
    res.status(500).json({
      error: "Failed to fetch grievance",
    });
  }
};

/**
 * Get statistics for the dashboard
 * GET /api/grievances/stats
 */
export const getGrievanceStats: RequestHandler = (req, res) => {
  try {
    const allGrievances = Array.from(grievances.values());

    const stats = {
      total: allGrievances.length,
      byCategory: {} as Record<string, number>,
      byUrgency: {} as Record<string, number>,
      bySentiment: {} as Record<string, number>,
      byStatus: {
        submitted: 0,
        viewed: 0,
        cleared: 0,
      },
    };

    allGrievances.forEach((grievance) => {
      stats.byCategory[grievance.category] =
        (stats.byCategory[grievance.category] || 0) + 1;
      stats.byUrgency[grievance.urgency] =
        (stats.byUrgency[grievance.urgency] || 0) + 1;
      stats.bySentiment[grievance.sentiment] =
        (stats.bySentiment[grievance.sentiment] || 0) + 1;
      stats.byStatus[grievance.status] =
        (stats.byStatus[grievance.status] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      error: "Failed to fetch statistics",
    });
  }
};
