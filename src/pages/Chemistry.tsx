import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chemistry = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-suggestions', {
        body: { type: 'chemistry', query: input }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.suggestion
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto p-4">
      <div className="flex-1 space-y-4 backdrop-blur-xl bg-white/10 rounded-2xl p-6 mb-4 border border-white/10">
        <ScrollArea className="h-[calc(100vh-15rem)]">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Welcome to the Chemistry feature! 🧪</p>
              <p className="mt-2">Ask me about finding the perfect combination of subscriptions for your needs.</p>
              <p className="mt-1 text-sm">For example: "I need subscriptions for video editing and content creation"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'assistant' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'assistant'
                        ? 'bg-sapphire-600/20 text-white'
                        : 'bg-emerald-600/20 text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about subscription combinations..."
          className="flex-1 bg-white/10 border-white/10 text-white placeholder:text-white/50"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default Chemistry;