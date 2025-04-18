// web/src/hooks/use-messaging.tsx
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage, 
  createConversation, 
  getUnreadMessageCount,
  Conversation,
  Message 
} from '@/data/api';
import { useAuth } from './use-auth';

interface UseMessagingReturn {
  conversations: Conversation[];
  currentConversation: number | null;
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: number, page?: number, limit?: number, isInitialLoad?: boolean) => Promise<void>;
  sendNewMessage: (conversationId: number, content?: string, recipeId?: number) => Promise<void>;
  startConversation: (otherUserId: string) => Promise<number>;
  setCurrentConversation: (id: number | null) => void;
}

export function useMessaging(): UseMessagingReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Load all conversations
  const loadConversations = useCallback(async () => {
    if (!user.id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load conversations'));
      console.error('Error loading conversations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  const loadMessages = useCallback(async (conversationId: number, page = 0, limit = 20, isInitialLoad = true) => {
    if (!user.id) return;
    
    // Only show loading state on initial load, not during polling updates
    if (isInitialLoad) {
      setIsLoading(true);
    }
    
    setError(null);
    try {
      const data = await fetchMessages(conversationId, page, limit);
      setMessages(data);
      setCurrentConversation(conversationId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load messages'));
      console.error('Error loading messages:', err);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  }, [user.id]);

  // Send a new message
  const sendNewMessage = useCallback(async (conversationId: number, content?: string, recipeId?: number) => {
    if (!user.id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const newMessage = await sendMessage(conversationId, content, recipeId);
      setMessages(prev => [newMessage, ...prev]);
      // Update conversation last message
      setConversations(prev => {
        return prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: newMessage,
              updatedAt: new Date().toISOString()
            };
          }
          return conv;
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  // Start a new conversation
  const startConversation = useCallback(async (otherUserId: string): Promise<number> => {
    if (!user.id) throw new Error('User not authenticated');
    
    setIsLoading(true);
    setError(null);
    try {
      const { id, existing } = await createConversation(otherUserId);
      if (!existing) {
        await loadConversations(); // Reload conversations to include the new one
      }
      return id;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start conversation'));
      console.error('Error starting conversation:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user.id, loadConversations]);

  // Fetch unread message count
  const fetchUnreadCount = useCallback(async () => {
    if (!user.id) return;
    
    try {
      const count = await getUnreadMessageCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, [user.id]);

  // Initial load of conversations and unread count
  useEffect(() => {
    if (user.id) {
      loadConversations();
      fetchUnreadCount();
      
      // Could add polling here for real-time updates
      const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user.id, loadConversations, fetchUnreadCount]);

  return {
    conversations,
    currentConversation,
    messages,
    unreadCount,
    isLoading,
    error,
    loadConversations,
    loadMessages,
    sendNewMessage,
    startConversation,
    setCurrentConversation
  };
}