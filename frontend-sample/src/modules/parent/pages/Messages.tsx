import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Messages() {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const teachers = [
    { id: '1', name: 'Mr. John Smith', subject: 'Mathematics', avatar: '👨‍🏫' },
    { id: '2', name: 'Ms. Sarah Johnson', subject: 'Science', avatar: '👩‍🏫' },
    { id: '3', name: 'Mr. David Brown', subject: 'English', avatar: '👨‍🏫' },
    { id: '4', name: 'Ms. Emily Davis', subject: 'History', avatar: '👩‍🏫' },
  ];

  const conversations = [
    {
      teacherId: '1',
      messages: [
        { from: 'teacher', text: 'Your child is doing great in Mathematics!', time: '2 hours ago' },
        { from: 'parent', text: 'Thank you for the update. Any areas we should focus on?', time: '1 hour ago' },
        { from: 'teacher', text: 'Practice more word problems. That will help a lot.', time: '30 mins ago' },
      ]
    },
    {
      teacherId: '2',
      messages: [
        { from: 'teacher', text: 'Please ensure homework is submitted on time.', time: '1 day ago' },
        { from: 'parent', text: 'Will do. Thank you for letting me know.', time: '1 day ago' },
      ]
    },
  ];

  const selectedConversation = conversations.find(c => c.teacherId === selectedTeacher);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-r from-[#0F1C2E] via-[#1a2744] to-[#1E2A55] p-10 text-primary-foreground"
      >
        <h1 className="text-4xl font-bold mb-2">Messages</h1>
        <p className="text-primary-foreground/90 text-lg">
          Communicate with your child's teachers
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teachers List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {teachers.map((teacher) => (
                <motion.div
                  key={teacher.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTeacher === teacher.id ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
                  }`}
                  onClick={() => setSelectedTeacher(teacher.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{teacher.avatar}</div>
                    <div>
                      <h3 className="font-semibold text-sm">{teacher.name}</h3>
                      <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversation Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {selectedTeacher ? teachers.find(t => t.id === selectedTeacher)?.name : 'Select a teacher'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTeacher ? (
              <div className="space-y-4">
                {/* Messages */}
                <div className="h-96 overflow-y-auto space-y-3 p-4 bg-accent/20 rounded-lg">
                  {selectedConversation?.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.from === 'parent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.from === 'parent'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-white border'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 opacity-60" />
                          <p className="text-xs opacity-60">{message.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-24"
                  />
                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Select a teacher to start messaging</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="p-4 border rounded-lg">
                <div className="text-3xl mb-2">{teacher.avatar}</div>
                <h3 className="font-semibold text-sm">{teacher.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{teacher.subject}</p>
                <Button size="sm" variant="outline" className="w-full">
                  <MessageSquare className="w-3 h-3 mr-2" />
                  Message
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
