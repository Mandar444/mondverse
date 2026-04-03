import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  FileText,
  Shield,
  Scale,
} from 'lucide-react';

const TermsPolicy = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="user" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/settings')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Button>

        <section className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center shadow-lg">
              <FileText className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Terms & Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Last updated: January 2024
          </p>
        </section>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Terms of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground mb-4">
                By accessing and using MindCare AI, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h3 className="text-lg font-semibold mb-3">2. Use of Service</h3>
              <p className="text-muted-foreground mb-4">
                MindCare AI is a mental health support platform designed to provide therapeutic assistance. Our services include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                <li>AI-powered chat therapy sessions</li>
                <li>Stress level monitoring and analysis</li>
                <li>Therapeutic games and relaxation exercises</li>
                <li>Mood tracking and progress reports</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">3. Medical Disclaimer</h3>
              <p className="text-muted-foreground mb-4">
                MindCare AI is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider with any questions you may have regarding a medical condition.
              </p>

              <h3 className="text-lg font-semibold mb-3">4. User Responsibilities</h3>
              <p className="text-muted-foreground mb-4">
                You agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the confidentiality of your account</li>
                <li>Use the service responsibly and ethically</li>
                <li>Not misuse or abuse the platform</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">5. Emergency Situations</h3>
              <p className="text-muted-foreground mb-4">
                If you are experiencing a medical or psychiatric emergency, immediately call your local emergency number (911 in the US) or go to the nearest emergency room. MindCare AI is not equipped to handle emergency situations.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
              <p className="text-muted-foreground mb-4">
                We collect information that you provide directly to us:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                <li>Personal information (name, email, phone number)</li>
                <li>Medical history and health information</li>
                <li>Chat conversations with Dr. Mind</li>
                <li>Mood tracking data and stress levels</li>
                <li>Usage patterns and preferences</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
              <p className="text-muted-foreground mb-4">
                Your information is used to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                <li>Provide personalized mental health support</li>
                <li>Track your progress and mood patterns</li>
                <li>Improve our AI algorithms and services</li>
                <li>Send you reminders and notifications</li>
                <li>Communicate important updates</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">3. Data Security</h3>
              <p className="text-muted-foreground mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                <li>End-to-end encryption for all conversations</li>
                <li>Secure data storage with regular backups</li>
                <li>HIPAA-compliant data handling practices</li>
                <li>Regular security audits and updates</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">4. Data Sharing</h3>
              <p className="text-muted-foreground mb-4">
                We do NOT sell your personal information. We may share data with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                <li>Healthcare providers (with your explicit consent)</li>
                <li>Service providers who assist our operations</li>
                <li>Law enforcement (when legally required)</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">5. Your Rights</h3>
              <p className="text-muted-foreground mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Export your data in a portable format</li>
                <li>Opt-out of data collection</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">6. Cookies and Tracking</h3>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and remember your preferences. You can control cookie settings through your browser.
              </p>

              <h3 className="text-lg font-semibold mb-3">7. Children's Privacy</h3>
              <p className="text-muted-foreground mb-4">
                MindCare AI is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>

              <h3 className="text-lg font-semibold mb-3">8. Changes to This Policy</h3>
              <p className="text-muted-foreground mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Contact Us</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about these Terms or our Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📧 Email: supportmindcare@gmail.com</p>
                <p>📱 Phone: +91 7895488616</p>
                <p>📍 Address: XYZ</p>
              </div>
            </CardContent>
          </Card>

          {/* Agreement */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Agreement</h3>
                  <p className="text-sm text-muted-foreground">
                    By using MindCare AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TermsPolicy;