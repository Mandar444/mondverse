import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Save,
  FileText,
  Clock,
  User,
  Calendar,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react';

interface Note {
  id: string;
  date: string;
  type: string;
  content: string;
  author: string;
  tags: string[];
}

const ClinicalNotes = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [note, setNote] = useState('');
  const [noteType, setNoteType] = useState('progress');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  // Mock patient info
  const patient = {
    id: patientId,
    name: 'Sarah Johnson',
    avatar: '👩',
    age: 28,
  };

  // Mock previous notes
  const previousNotes: Note[] = [
    {
      id: '1',
      date: 'Jan 15, 2026',
      type: 'Progress Note',
      content: 'Patient showing significant improvement in anxiety management. CBT techniques proving effective. Sleep quality has improved from 4/10 to 7/10. Patient reports using breathing exercises daily.',
      author: 'Dr. Smith',
      tags: ['anxiety', 'improvement', 'cbt'],
    },
    {
      id: '2',
      date: 'Jan 10, 2026',
      type: 'Session Note',
      content: 'Discussed work-related stress triggers. Patient identified key stressors: deadlines, presentations, and email overload. Created action plan for managing work stress.',
      author: 'Dr. Smith',
      tags: ['work-stress', 'triggers', 'action-plan'],
    },
    {
      id: '3',
      date: 'Jan 5, 2026',
      type: 'Follow-up',
      content: 'Check-in session. Patient compliant with medication (Sertraline 50mg). No adverse effects reported. Mood stable. Continues to practice mindfulness.',
      author: 'Dr. Smith',
      tags: ['medication', 'compliance', 'stable'],
    },
  ];

  const handleSave = () => {
    if (!note.trim()) {
      alert('Please enter note content before saving.');
      return;
    }

    const newNote = {
      date: sessionDate,
      type: noteType,
      content: note,
      tags: tags,
    };

    console.log('Saving note:', newNote);
    alert('Clinical note saved successfully!');
    
    // Clear form
    setNote('');
    setTags([]);
    
    // Navigate back to patient details
    navigate(`/psychiatrist/patient/${patientId}`);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUseTemplate = (template: string) => {
    const templates: { [key: string]: string } = {
      progress: `SUBJECTIVE:\n\nOBJECTIVE:\n\nASSESSMENT:\n\nPLAN:\n`,
      initial: `PRESENTING PROBLEM:\n\nHISTORY:\n\nMENTAL STATUS EXAM:\n\nDIAGNOSIS:\n\nTREATMENT PLAN:\n`,
      followup: `CURRENT STATUS:\n\nMEDICATION COMPLIANCE:\n\nSYMPTOM REVIEW:\n\nRECOMMENDATIONS:\n`,
    };

    setNote(templates[template] || '');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="psychiatrist" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/psychiatrist/patient/${patientId}`)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patient Profile
        </Button>

        <div className="flex items-center gap-4 mb-8">
          <div className="text-5xl">{patient.avatar}</div>
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground">
              Clinical Notes
            </h1>
            <p className="text-muted-foreground">
              {patient.name} • {patient.age} years old
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* New Note Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Note</CardTitle>
                <CardDescription>
                  Document session details and observations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Session Date
                    </label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      <FileText className="w-3 h-3 inline mr-1" />
                      Note Type
                    </label>
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value)}
                      className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="progress">Progress Note</option>
                      <option value="initial">Initial Assessment</option>
                      <option value="treatment">Treatment Plan</option>
                      <option value="followup">Follow-up</option>
                      <option value="crisis">Crisis Intervention</option>
                      <option value="medication">Medication Review</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Note Content</label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUseTemplate('progress')}
                      >
                        SOAP Template
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUseTemplate('initial')}
                      >
                        Assessment Template
                      </Button>
                    </div>
                  </div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={15}
                    placeholder="Enter detailed clinical notes..."
                    className="w-full p-3 border border-border rounded-lg resize-none bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {note.length} characters
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add tag (e.g., anxiety, improvement)"
                      className="flex-1 p-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={handleAddTag}>Add</Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button className="flex-1 gap-2" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Save Note
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/psychiatrist/patient/${patientId}`)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Dr. Smith</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Common Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Common Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {['anxiety', 'depression', 'improvement', 'medication', 'cbt', 'crisis', 'stable', 'follow-up'].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          if (!tags.includes(tag)) {
                            setTags([...tags, tag]);
                          }
                        }}
                        className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-500/50">
              <CardHeader>
                <CardTitle className="text-sm">Documentation Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs space-y-2 text-muted-foreground">
                  <li>• Be objective and factual</li>
                  <li>• Include relevant observations</li>
                  <li>• Document interventions used</li>
                  <li>• Note patient's response</li>
                  <li>• Record any safety concerns</li>
                  <li>• Sign and date all entries</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Previous Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Previous Notes</CardTitle>
            <CardDescription>
              Recent session documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previousNotes.map((prevNote) => (
                <Card key={prevNote.id} className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {prevNote.type}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              by {prevNote.author}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {prevNote.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {prevNote.content}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {prevNote.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-background rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClinicalNotes;