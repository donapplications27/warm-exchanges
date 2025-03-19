
export interface Message {
  id: string;
  created_at: string;
  content: string;
  type: 'human' | 'ai';
}

export interface MessageRecord {
  id: string;
  created_at: string;
  session_id: string;
  message: {
    content: string;
    type: 'human' | 'ai';
  };
}

export interface Conversation {
  session_id: string;
  title: string;
  last_message_at: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AgentRequest {
  query: string;
  user_id: string;
  request_id: string;
  session_id: string;
}

export interface AgentResponse {
  success: boolean;
}
