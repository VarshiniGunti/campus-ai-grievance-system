import { RequestHandler } from 'express';
import { analyzeGrievance } from '../utils/ai-analysis';

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
  createdAt: string;
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
        error: 'Missing required fields: studentName, studentEmail, complaint'
      });
      return;
    }
    
    // Analyze the complaint using AI
    const analysis = await analyzeGrievance(complaint);
    
    // Create grievance record
    const grievanceId = `grievance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const grievance: StoredGrievance = {
      id: grievanceId,
      studentName,
      studentEmail,
      complaint,
      category: analysis.category,
      urgency: analysis.urgency,
      sentiment: analysis.sentiment,
      summary: analysis.summary,
      createdAt: new Date().toISOString(),
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
        summary: analysis.summary
      }
    });
  } catch (error) {
    console.error('Error submitting grievance:', error);
    res.status(500).json({
      error: 'Failed to submit grievance'
    });
  }
};

/**
 * Get all grievances with optional filtering
 * GET /api/grievances?category=Academics&urgency=High
 */
export const getGrievances: RequestHandler = (req, res) => {
  try {
    const { category, urgency } = req.query;
    
    let results = Array.from(grievances.values());
    
    // Apply filters if provided
    if (category && typeof category === 'string') {
      results = results.filter(g => g.category === category);
    }
    
    if (urgency && typeof urgency === 'string') {
      results = results.filter(g => g.urgency === urgency);
    }
    
    // Sort by creation date (newest first)
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json({
      count: results.length,
      grievances: results
    });
  } catch (error) {
    console.error('Error fetching grievances:', error);
    res.status(500).json({
      error: 'Failed to fetch grievances'
    });
  }
};

/**
 * Get a single grievance by ID
 * GET /api/grievances/:id
 */
export const getGrievanceById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    const grievance = grievances.get(id);
    if (!grievance) {
      res.status(404).json({
        error: 'Grievance not found'
      });
      return;
    }
    
    res.json({
      grievance
    });
  } catch (error) {
    console.error('Error fetching grievance:', error);
    res.status(500).json({
      error: 'Failed to fetch grievance'
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
    };
    
    allGrievances.forEach(grievance => {
      stats.byCategory[grievance.category] = (stats.byCategory[grievance.category] || 0) + 1;
      stats.byUrgency[grievance.urgency] = (stats.byUrgency[grievance.urgency] || 0) + 1;
      stats.bySentiment[grievance.sentiment] = (stats.bySentiment[grievance.sentiment] || 0) + 1;
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics'
    });
  }
};
