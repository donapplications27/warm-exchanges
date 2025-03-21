
import { useState } from 'react';
import { useChat } from '@/hooks/use-chat';
import { Conversation } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { 
  PlusIcon, 
  XIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  LogOutIcon,
  MapIcon,
  Settings,
  HardHat
} from 'lucide-react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MapModal } from '@/components/MapModal';
import { SettingsModal } from '@/components/SettingsModal';
import { TechnicianModal } from '@/components/TechnicianModal';

const ConversationSidebar = () => {
  const { conversations, currentSessionId, selectConversation, startNewConversation } = useChat();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTechnicianOpen, setIsTechnicianOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, h:mm a');
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`relative h-screen ${
        collapsed ? 'w-16' : 'w-80'
      } bg-chat-dark border-r border-chat-border flex flex-col transition-all duration-300 ease-in-out`}
    >
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-chat-dark border border-chat-border shadow-md"
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between p-4 border-b border-chat-border">
        {!collapsed && <h2 className="text-lg font-semibold">Conversations</h2>}
        <Button
          variant="outline"
          size={collapsed ? "icon" : "default"}
          className={`${collapsed ? 'mx-auto w-10 h-10' : ''} bg-chat-accent text-white hover:bg-blue-700`}
          onClick={startNewConversation}
        >
          <PlusIcon className="h-5 w-5" />
          {!collapsed && <span className="ml-2">New Chat</span>}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {conversations.length === 0 ? (
          <div className={`p-4 text-center text-muted-foreground ${collapsed ? 'hidden' : ''}`}>
            No conversations yet
          </div>
        ) : (
          <ul className="space-y-1 p-2">
            {conversations.map((conversation: Conversation) => (
              <li
                key={conversation.session_id}
                className={`group cursor-pointer rounded-lg transition-all duration-200 ${
                  currentSessionId === conversation.session_id
                    ? 'bg-chat-accent/20'
                    : 'hover:bg-secondary/40'
                }`}
                onClick={() => selectConversation(conversation.session_id)}
              >
                <div className={`p-2 ${collapsed ? 'justify-center' : 'justify-between'} flex items-center`}>
                  {!collapsed ? (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{conversation.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(conversation.last_message_at)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                      {conversation.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-chat-border">
        <div className="flex flex-col space-y-2">
          <TooltipProvider delayDuration={300}>
            <div className="flex justify-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon" 
                    className="h-10 w-10"
                    onClick={() => setIsMapOpen(true)}
                  >
                    <MapIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Map</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon" 
                    className="h-10 w-10"
                    onClick={() => setIsTechnicianOpen(true)}
                  >
                    <HardHat className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Technician Coordinates</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={`${collapsed ? 'mx-auto w-10 h-10' : 'w-full'} justify-start`}
            onClick={signOut}
          >
            <LogOutIcon className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>

      <MapModal open={isMapOpen} onOpenChange={setIsMapOpen} />
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <TechnicianModal open={isTechnicianOpen} onOpenChange={setIsTechnicianOpen} />
    </div>
  );
};

export default ConversationSidebar;
