
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { UserIcon, BotIcon } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Add a small delay before showing the message to create a staggered effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const formattedTime = format(new Date(message.created_at), 'h:mm a');

  return (
    <div
      className={cn(
        "py-6 transition-all duration-300 ease-out",
        message.type === 'human' ? 'bg-accent/40' : 'bg-secondary/40',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      <div className="container max-w-4xl mx-auto px-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            {message.type === 'human' ? (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <BotIcon className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-medium">
                {message.type === 'human' ? 'You' : 'AI Assistant'}
              </h3>
              <span className="text-xs text-muted-foreground">{formattedTime}</span>
            </div>
            
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {message.type === 'ai' ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
