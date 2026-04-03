import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Book,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const faqs = [
    {
      question: 'How do I start a conversation with Dr. Mind?',
      answer: 'Click on "Talk to Dr. Mind" from your dashboard. You can start typing your thoughts, feelings, or questions, and Dr. Mind will respond with empathetic, therapeutic guidance.',
    },
    {
      question: 'Is my conversation with Dr. Mind private?',
      answer: 'Yes, absolutely! All conversations are end-to-end encrypted and completely confidential. We follow HIPAA compliance guidelines to ensure your privacy is protected.',
    },
    {
      question: 'How does the stress detection feature work?',
      answer: 'Our stress detection analyzes your typing patterns, including speed, pauses, and corrections. This helps identify stress levels and provides personalized recommendations.',
    },
    {
      question: 'Can I export my mood tracking data?',
      answer: 'Yes! Go to Settings > Privacy & Security > Data Management and click "Export Your Data". You\'ll receive a JSON file with all your information.',
    },
    {
      question: 'How do I set up reminders?',
      answer: 'On your dashboard, find the "Today\'s Reminders" card. Click the "Add" button, then enter the time, title, and type of reminder you want to create.',
    },
    {
      question: 'What should I do in an emergency?',
      answer: 'MindCare AI is NOT for emergencies. If you\'re experiencing a crisis, please call your local emergency number (911 in the US) or contact the National Suicide Prevention Lifeline at 988.',
    },
    {
      question: 'Can I use MindCare on multiple devices?',
      answer: 'Yes! Your account syncs across devices. Simply log in with the same credentials on any device to access your data.',
    },
    {
      question: 'How do I change my theme to dark mode?',
      answer: 'Go to Settings > Appearance, then select "Dark" theme. You can also choose "System" to automatically match your device\'s theme.',
    },
    {
      question: 'Can I delete my account?',
      answer: 'Yes. Go to Settings, scroll to the "Danger Zone" section, and click "Delete Account". Please note this action is permanent and cannot be undone.',
    },
    {
      question: 'How often should I use MindCare?',
      answer: 'We recommend daily check-ins for best results. Even 5-10 minutes per day of mood tracking, breathing exercises, or chatting with Dr. Mind can make a significant difference.',
    },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: () => alert('Live chat feature coming soon!'),
      color: 'bg-blue-500',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'supportmindcare@gmail.com',
      action: () => window.location.href = 'mailto:supportmindcare@gmail.com',
      color: 'bg-green-500',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: '+91 7895488616',
      action: () => window.location.href = 'tel:+917895488616',
      color: 'bg-purple-500',
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-lg">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Help & Support
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help you get the most out of MindCare
          </p>
        </section>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-4">
            {contactOptions.map((option) => (
              <Card
                key={option.title}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={option.action}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl ${option.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <option.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-3">
                {filteredFaqs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No results found. Try a different search term.
                  </p>
                ) : (
                  filteredFaqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                      >
                        <span className="font-medium text-foreground pr-4">
                          {faq.question}
                        </span>
                        {expandedFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-4 pb-4 text-sm text-muted-foreground">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>
                Helpful resources and guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => navigate('/dashboard')}
                >
                  <div className="text-left">
                    <div className="font-semibold mb-1">Getting Started Guide</div>
                    <div className="text-xs text-muted-foreground">
                      Learn how to use MindCare effectively
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => navigate('/terms-policy')}
                >
                  <div className="text-left">
                    <div className="font-semibold mb-1">Terms & Privacy</div>
                    <div className="text-xs text-muted-foreground">
                      Read our policies and terms
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => alert('Video tutorials coming soon!')}
                >
                  <div className="text-left">
                    <div className="font-semibold mb-1">Video Tutorials</div>
                    <div className="text-xs text-muted-foreground">
                      Watch how-to videos
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => alert('Community forum coming soon!')}
                >
                  <div className="text-left">
                    <div className="font-semibold mb-1">Community Forum</div>
                    <div className="text-xs text-muted-foreground">
                      Connect with other users
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Resources */}
          <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Crisis Resources</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you're experiencing a mental health crisis, please contact:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-foreground">
                      🇺🇸 National Suicide Prevention Lifeline: <strong>988</strong>
                    </p>
                    <p className="font-medium text-foreground">
                      📱 Crisis Text Line: Text <strong>HELLO</strong> to <strong>741741</strong>
                    </p>
                    <p className="font-medium text-foreground">
                      🚨 Emergency: <strong>911</strong>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;