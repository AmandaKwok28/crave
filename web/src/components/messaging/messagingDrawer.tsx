import { Button, Text, CloseButton, Drawer, Portal, Input, Flex, Box, Center, Spinner, Badge, Avatar } from "@chakra-ui/react";
import { MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMessaging } from "@/hooks/use-messaging";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";
import { Message } from "@/data/api"; // Make sure to import the Message type


// Define props interface for the MessageBubble component
interface MessageBubbleProps {
    message: Message;
    isCurrentUser: boolean;
  }

// Simple message component similar to Comment component
const MessageBubble = ({ message, isCurrentUser }: MessageBubbleProps) => {
  const align = isCurrentUser ? "flex-end" : "flex-start";
  const bgColor = isCurrentUser ? "cyan.100" : "gray.100";

  return (
    <Flex direction="column" alignItems={align} mb={3} width="100%">
      {!isCurrentUser && (
        <Text fontSize="xs" fontWeight="medium" mb={1} color="gray.500">
          {message.sender.name}
        </Text>
      )}
      
      <Flex direction="column" alignItems={align} maxWidth="70%">
        {/* Recipe card */}
        {message.recipe && (
          <Box 
            bg="white" 
            borderWidth="1px" 
            borderRadius="md" 
            p={2} 
            mb={1}
            onClick={() => message.recipe && openPage($router, "recipe", { recipe_id: message.recipe.id })}
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
          >
            <Flex alignItems="center" gap={2}>
              {message.recipe.image ? (
                <Box width="40px" height="40px" borderRadius="md" overflow="hidden">
                  <img 
                    src={message.recipe.image} 
                    alt={message.recipe.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              ) : (
                <Box width="40px" height="40px" bg="gray.200" borderRadius="md"></Box>
              )}
              <Text fontSize="sm" fontWeight="medium">{message.recipe.title}</Text>
            </Flex>
          </Box>
        )}

        {/* Message content */}
        {message.content && (
          <Box bg={bgColor} borderRadius="lg" py={2} px={3}>
            <Text fontSize="sm">{message.content}</Text>
          </Box>
        )}

        <Text fontSize="xs" color="gray.500" mt={1}>
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </Text>
      </Flex>
    </Flex>
  );
};

const MessagingDrawer = () => {
  const [open, setOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Add a new state for sorted messages
  const [sortedMessages, setSortedMessages] = useState<Message[]>([]);

  const { 
    conversations,
    messages,
    loadConversations, 
    loadMessages,
    sendNewMessage,
    unreadCount,
    isLoading
  } = useMessaging();

  // Sort messages only when they change
  useEffect(() => {
    if (messages.length > 0) {
      const sorted = [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setSortedMessages(sorted);
    } else {
      setSortedMessages([]);
    }
  }, [messages]);

  // Load conversations when drawer opens (similar to how comments work)
  useEffect(() => {
    if (open) {
      loadConversations();
    }
  }, [open, loadConversations]);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    }
  }, [selectedConversationId, loadMessages]);

  // Scroll to bottom of messages only when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sortedMessages]); // Changed from messages to sortedMessages

  // Send message handler (similar to handleCreateComment)
  const handleSendMessage = async () => {
    if (messageText.trim() && selectedConversationId) {
      try {
        await sendNewMessage(selectedConversationId, messageText);
        setMessageText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to select a conversation
  const selectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Drawer.Trigger asChild>
        <Button 
          position="fixed"
          bottom="4"
          right="4"
          borderRadius="full"
          bgGradient="to-r"
          gradientFrom="cyan.400"
          gradientTo="purple.600"
          color="white"
          size="lg"
          zIndex="10"
        >
          <MessageSquare size={24} />
          {unreadCount > 0 && (
            <Badge 
              position="absolute"
              top="-2"
              right="-2"
              borderRadius="full"
              bg="red.500"
              color="white"
              fontSize="xs"
              minW="5"
              minH="5"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Flex direction="row" justifyContent="space-between">
                <Drawer.Title>
                  {selectedConversationId ? 
                    conversations.find(c => c.id === selectedConversationId)?.otherUser.name || "Messages" : 
                    "Messages"}
                </Drawer.Title>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Flex>
            </Drawer.Header>
            <Drawer.Body display="flex" flexDirection="column" height="full">
              {!selectedConversationId ? (
                // Conversation list (when no conversation is selected)
                <Flex direction="column">
                  {isLoading ? (
                    <Center p={4}><Spinner size="sm" /></Center>
                  ) : conversations.length > 0 ? (
                    conversations.map((conversation) => (
                      <Box 
                        key={conversation.id}
                        p={3}
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                        cursor="pointer"
                        _hover={{ bg: "gray.50" }}
                        onClick={() => selectConversation(conversation.id)}
                      >
                        <Flex alignItems="center">
                          <Avatar.Root size="sm" mr={3}>
                            <Avatar.Fallback name={conversation.otherUser.name} />
                            <Avatar.Image src={conversation.otherUser.avatarImage || ''} />
                          </Avatar.Root>
                          <Box flex="1">
                            <Text fontWeight="medium">{conversation.otherUser.name}</Text>
                            <Text fontSize="sm" color="gray.500" lineClamp={1}>
                              {conversation.lastMessage?.content || "No messages yet"}
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                    ))
                  ) : (
                    <Text p={4}>No conversations yet.</Text>
                  )}
                </Flex>
              ) : (
                // Messages view (when conversation is selected)
                <Flex direction="column" flex="1" height="full">
                  {/* Back button */}
                  <Button 
                    variant="ghost" 
                    justifyContent="flex-start" 
                    mb={2}
                    onClick={() => setSelectedConversationId(null)}
                  >
                    <Flex gap={2} alignItems="center">
                      <span>←</span>
                      <span>Back to conversations</span>
                    </Flex>
                  </Button>
                
                  {/* Messages */}
                  <Box flex="1" overflowY="auto">
                    {isLoading ? (
                      <Center><Spinner /></Center>
                    ) : sortedMessages.length > 0 ? (
                      sortedMessages.map((message) => (
                        <MessageBubble 
                          key={message.id} 
                          message={message} 
                          isCurrentUser={message.senderId === user.id} 
                        />
                      ))
                    ) : (
                      <Text p={4} textAlign="center" color="gray.500">
                        No messages yet. Start the conversation!
                      </Text>
                    )}
                    <div ref={messagesEndRef} />
                  </Box>
                </Flex>
              )}
            </Drawer.Body>
            <Drawer.Footer>
              {selectedConversationId && (
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              )}
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default MessagingDrawer;