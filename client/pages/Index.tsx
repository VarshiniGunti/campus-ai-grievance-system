import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  AlertCircle, 
  BarChart3, 
  Zap, 
  Shield, 
  Brain, 
  ChevronRight,
  MessageSquare
} from "lucide-react";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900">Campus AI</span>
              <span className="text-xs text-primary">Grievance System</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/submit-grievance">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Submit Grievance
              </Button>
            </Link>
            <Link to="/admin-dashboard">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <BarChart3 className="w-4 h-4" />
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Campus AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Grievance Intelligence</span> System
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Empower students to voice concerns and enable administrators to act with AI-powered insights. Transform complaints into actionable intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/submit-grievance">
                <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2 w-full sm:w-auto">
                  <MessageSquare className="w-5 h-5" />
                  Submit a Grievance
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/admin-dashboard">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <BarChart3 className="w-5 h-5" />
                  View Dashboard
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <Card className="p-8 text-center border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-primary mb-2">AI-Powered</div>
              <p className="text-slate-600">Instant categorization and analysis of complaints</p>
            </Card>
            <Card className="p-8 text-center border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <p className="text-slate-600">Always available for students to submit concerns</p>
            </Card>
            <Card className="p-8 text-center border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl font-bold text-success mb-2">Transparent</div>
              <p className="text-slate-600">Clear tracking and resolution of grievances</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="w-8 h-8 text-primary" />
                For Students
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-slate-900 font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Submit Your Grievance</h4>
                    <p className="text-slate-300">Share your concern in plain text - no complicated forms</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-slate-900 font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Get Confirmation</h4>
                    <p className="text-slate-300">Receive immediate acknowledgment of your submission</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-slate-900 font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Track Resolution</h4>
                    <p className="text-slate-300">Follow the status of your grievance in real-time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-accent" />
                For Administrators
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-accent text-slate-900 font-bold">
                      A
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Smart Categorization</h4>
                    <p className="text-slate-300">AI automatically sorts complaints by category and urgency</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-accent text-slate-900 font-bold">
                      B
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Actionable Insights</h4>
                    <p className="text-slate-300">Get summaries and sentiment analysis for quick decisions</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-accent text-slate-900 font-bold">
                      C
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Advanced Filtering</h4>
                    <p className="text-slate-300">Filter by category, urgency, and sentiment for focused action</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Powered by Google Technologies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <Brain className="w-12 h-12 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Google Gemini AI</h3>
                  <p className="text-slate-600">
                    Advanced language model for understanding student grievances and generating intelligent categorization, urgency assessment, and sentiment analysis.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <Shield className="w-12 h-12 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Firebase Firestore</h3>
                  <p className="text-slate-600">
                    Scalable, real-time database for secure storage of grievances and AI-generated insights with enterprise-grade reliability.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Improve Campus Life?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start by submitting a grievance or access the admin dashboard to view insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit-grievance">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 gap-2 w-full sm:w-auto">
                Submit Grievance
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/admin-dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 gap-2 w-full sm:w-auto">
                Admin Dashboard
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Campus AI Grievance System</h4>
              <p className="text-sm">Transforming campus feedback into actionable intelligence</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Features</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-primary transition">AI-Powered Analysis</a></li>
                <li><a href="#" className="hover:text-primary transition">Real-time Dashboard</a></li>
                <li><a href="#" className="hover:text-primary transition">Secure Storage</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Technology</h4>
              <ul className="text-sm space-y-2">
                <li>Google Gemini API</li>
                <li>Firebase Firestore</li>
                <li>React & TypeScript</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2024 Campus AI Grievance System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
