
import { useEffect, useRef } from 'react';
import ConversationSidebar from '@/components/ConversationSidebar';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { useChat } from '@/hooks/use-chat';
import { ChatProvider } from '@/hooks/use-chat';

const ChatContent = () => {
  const { messages, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-chat-accent/20 p-6 rounded-xl mb-4">
              <h2 className="text-3xl font-semibold mb-2">Welcome to AI Chat</h2>
              <p className="text-muted-foreground max-w-lg">
                Start a conversation by typing a message below. Your AI assistant is ready to help with any questions.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>
      <ChatInput />
    </div>
  );
};

const Chat = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen overflow-hidden">
        <ConversationSidebar />
        <ChatContent />
      </div>
    </ChatProvider>
  );
};

export default Chat;
