
import { useState, KeyboardEvent } from 'react';
import { useChat } from '@/hooks/use-chat';
import { SendIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isLoading } = useChat();

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-chat-border bg-chat-dark p-4">
      <div className="max-w-4xl mx-auto relative">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 min-h-[60px] max-h-[200px] bg-chat-darker border border-chat-border rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none scrollbar-thin"
            disabled={isLoading}
          />
          <Button
            className="absolute right-3 bottom-3 h-9 w-9 p-0 bg-chat-accent hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
          >
            <SendIcon size={18} />
          </Button>
        </div>
        
        {isLoading && (
          <div className="absolute left-0 bottom-full mb-2 flex items-center gap-2 text-xs text-blue-400 animate-pulse-subtle">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span>AI is thinking...</span>
          </div>
        )}
        
        <div className="mt-1 text-xs text-center text-muted-foreground px-4">
          Press <kbd className="px-1.5 py-0.5 bg-chat-border rounded text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-chat-border rounded text-xs">Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
