
import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import supabase from '@/lib/supabase';
import { Message, MessageRecord, Conversation } from '@/types';
import { toast } from 'sonner';

interface ChatContextType {
  messages: Message[];
  conversations: Conversation[];
  currentSessionId: string | null;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  startNewConversation: () => void;
  selectConversation: (sessionId: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    fetchConversations();
    
    // Cleanup subscription when component unmounts
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Set up subscription when sessionId changes
  useEffect(() => {
    if (!currentSessionId) return;
    
    // Clear any existing subscription
    if (subscription) {
      subscription.unsubscribe();
    }
    
    // Get messages for current session
    fetchMessagesForSession(currentSessionId);
    
    // Subscribe to new messages for this session
    const newSubscription = supabase
      .channel(`messages-${currentSessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `session_id=eq.${currentSessionId}`,
      }, (payload) => {
        const newMessage = payload.new as MessageRecord;
        if (newMessage.session_id === currentSessionId) {
          const formattedMessage: Message = {
            id: newMessage.id,
            created_at: newMessage.created_at,
            content: newMessage.message.content,
            type: newMessage.message.type,
          };
          setMessages((prev) => [...prev, formattedMessage]);
        }
      })
      .subscribe();
    
    setSubscription(newSubscription);
  }, [currentSessionId]);

  const fetchMessagesForSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      const formattedMessages: Message[] = data.map((record: MessageRecord) => ({
        id: record.id,
        created_at: record.created_at,
        content: record.message.content,
        type: record.message.type,
      }));
      
      setMessages(formattedMessages);
    } catch (error: any) {
      toast.error(`Error fetching messages: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      // Get all unique session_ids with their earliest human message
      const { data, error } = await supabase
        .from('messages')
        .select('session_id, created_at, message')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      const sessionsMap = new Map<string, { title: string; last_message_at: string }>();
      
      data.forEach((record: MessageRecord) => {
        const sessionId = record.session_id;
        const messageTime = new Date(record.created_at);
        
        // If this is the first human message for this session_id, use it for the title
        if (!sessionsMap.has(sessionId) && record.message.type === 'human') {
          // Truncate message to first 100 chars for title
          const title = record.message.content.slice(0, 100) + 
                        (record.message.content.length > 100 ? '...' : '');
          
          sessionsMap.set(sessionId, { 
            title, 
            last_message_at: record.created_at 
          });
        } else if (sessionsMap.has(sessionId)) {
          // Update the last message time if this message is newer
          const existing = sessionsMap.get(sessionId)!;
          if (new Date(existing.last_message_at) < messageTime) {
            sessionsMap.set(sessionId, {
              ...existing,
              last_message_at: record.created_at
            });
          }
        }
      });
      
      // Convert map to array and sort by last message time (newest first)
      const conversationsList: Conversation[] = Array.from(sessionsMap.entries())
        .map(([session_id, { title, last_message_at }]) => ({
          session_id,
          title,
          last_message_at
        }))
        .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
      
      setConversations(conversationsList);
      
      // If we have conversations but no current session, select the most recent one
      if (conversationsList.length > 0 && !currentSessionId) {
        await selectConversation(conversationsList[0].session_id);
      }
    } catch (error: any) {
      toast.error(`Error fetching conversations: ${error.message}`);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Generate a session ID if we don't have one yet
    const sessionId = currentSessionId || uuidv4();
    if (!currentSessionId) {
      setCurrentSessionId(sessionId);
    }
    
    // Generate a unique request ID
    const requestId = uuidv4();
    
    try {
      setIsLoading(true);
      
      // Add the user message to the UI immediately
      const userMessage: Message = {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        content,
        type: 'human'
      };
      
      setMessages((prev) => [...prev, userMessage]);
      
      // Send the message to the API
      const response = await fetch('http://localhost:8001/api/pydantic-github-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: content,
          user_id: 'NA', // No authentication for now
          request_id: requestId,
          session_id: sessionId,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Failed to get a response from the agent');
      }
      
      // We don't need to add the AI message here since it will come through the Supabase subscription
      
      // Refresh conversations after sending a message
      fetchConversations();
    } catch (error: any) {
      toast.error(`Error sending message: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setCurrentSessionId(null);
    setMessages([]);
  };

  const selectConversation = async (sessionId: string) => {
    if (sessionId === currentSessionId) return;
    setCurrentSessionId(sessionId);
    await fetchMessagesForSession(sessionId);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        conversations,
        currentSessionId,
        isLoading,
        sendMessage,
        startNewConversation,
        selectConversation,
        fetchConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
