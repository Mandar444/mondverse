import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Search,
  Send,
  MoreVertical,
  AlertCircle,
  CheckCheck,
} from 'lucide-react';

interface Message {
  id: string;
  patientId: string;
  patientName: string;
  avatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'normal' | 'urgent';
  sender: 'patient' | 'psychiatrist';
}

interface Conversation {
  patientId: string;
  patientName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  priority: 'low' | 'normal' | 'urgent';
}

const MessagesCenter = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPatient = searchParams.get('patient');
  const conversationId = searchParams.get('conversation');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [activeConversation, setActiveConversation] = useState(selectedPatient || conversationId || null);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const conversations: Conversation[] = [
    { patientId: 'p-3', patientName: 'Emily Davis', avatar: '👩‍🦰', lastMessage: 'I\'m having a really difficult day...', timestamp: '5 min ago', unread: 2, priority: 'urgent' },
    { patientId: 'p-7', patientName: 'Marcus Thompson', avatar: '👨‍🦲', lastMessage: 'Thank you for checking in...', timestamp: '15 min ago', unread: 1, priority: 'normal' },
    { patientId: 'p-1', patientName: 'Sarah Johnson', avatar: '👩', lastMessage: 'Just completed my breathing exercises...', timestamp: '30 min ago', unread: 1, priority: 'low' },
    { patientId: 'p-5', patientName: 'Lisa Anderson', avatar: '👱‍♀️', lastMessage: 'Need to reschedule tomorrow...', timestamp: '1 hour ago', unread: 0, priority: 'normal' },
    { patientId: 'p-2', patientName: 'Mike Chen', avatar: '👨', lastMessage: 'The new techniques are helping...', timestamp: '2 hours ago', unread: 0, priority: 'low' },
  ];

  const messages: Message[] = [
    { id: '1', patientId: 'p-3', patientName: 'Emily Davis', avatar: '👩‍🦰', content: 'I\'m having a really difficult day. Can we talk soon?', timestamp: '5 min ago', read: false, priority: 'urgent', sender: 'patient' },
    { id: '2', patientId: 'p-3', patientName: 'Emily Davis', avatar: '👩‍🦰', content: 'The anxiety is overwhelming today.', timestamp: '3 min ago', read: false, priority: 'urgent', sender: 'patient' },
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'normal': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="psychiatrist" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/psychiatrist')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">Communicate with your patients</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1 h-[calc(100vh-300px)]">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[calc(100vh-400px)]">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.patientId}
                  onClick={() => setActiveConversation(conv.patientId)}
                  className={`w-full p-4 border-b border-border hover:bg-muted/50 transition-colors text-left ${
                    activeConversation === conv.patientId ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{conv.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground truncate">{conv.patientName}</h3>
                        {conv.priority === 'urgent' && (
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                        {conv.unread > 0 && (
                          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 h-[calc(100vh-300px)] flex flex-col">
            {activeConversation ? (
              <>
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {conversations.find(c => c.patientId === activeConversation)?.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {conversations.find(c => c.patientId === activeConversation)?.patientName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Active now</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/psychiatrist/patient/${activeConversation}`)}
                      >
                        View Profile
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages
                    .filter(m => m.patientId === activeConversation)
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'psychiatrist' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender === 'psychiatrist'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs opacity-70">{msg.timestamp}</span>
                            {msg.sender === 'psychiatrist' && (
                              <CheckCheck className="w-3 h-3 opacity-70" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>

                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MessagesCenter;