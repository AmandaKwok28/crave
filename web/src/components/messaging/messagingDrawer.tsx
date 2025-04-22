import { Button, Text, CloseButton, Drawer, Portal, Input, Flex, Box, Center, Spinner, Badge, Avatar } from "@chakra-ui/react";
import { MessageSquare } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useMessaging } from "@/hooks/use-messaging";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";
import { Message, fetchRecipe } from "@/data/api"; // Import fetchRecipe from api.ts
import { useLayoutEffect } from "react";
import { useStore } from "@nanostores/react";
import { $drawerOpen, $selectedConvo, $selectedRecipeForMessage, setDrawerOpen, setSelectedConvo, setSelectedRecipeForMessage } from "@/lib/store";

// Update the recipe fetching function to use the correct API endpoint
const fetchRecipeById = async (recipeId: number) => {
  try {
    // Use the existing fetchRecipe function from api.ts
    const recipe = await fetchRecipe(recipeId);
    return recipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
};

// Define props interface for the MessageBubble component
interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  currentUser: any; // Add currentUser prop
}

// Simple message component similar to Comment component
const MessageBubble = ({ message, isCurrentUser, currentUser }: MessageBubbleProps) => {
  const align = isCurrentUser ? "flex-end" : "flex-start";
  const bgColor = isCurrentUser ? "cyan.100" : "gray.100";

  return (
    <Flex 
      direction="row" 
      alignItems="flex-start" 
      mb={3} 
      width="100%"
      justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
    >
      {/* Avatar for other users, shown on the left */}
      {!isCurrentUser && (
        <Avatar.Root size="sm" mr={2} mt={1}>
          <Avatar.Fallback name={message.sender.name} />
          <Avatar.Image src={message.sender.avatarImage || undefined} />
        </Avatar.Root>
      )}
      
      <Flex direction="column" alignItems={align} maxWidth="70%">
        {!isCurrentUser && (
          <Text fontSize="xs" fontWeight="medium" mb={1} color="gray.500">
            {message.sender.name}
          </Text>
        )}

        {/* Recipe card */}
        {message.recipe && (
          <Box 
            bg="white" 
            borderWidth="1px" 
            borderRadius="md" 
            p={2} 
            mb={1}
            onClick={() => {
              if (message.recipe) {
                openPage($router, "recipe", { recipe_id: message.recipe.id });
                setDrawerOpen(false);
              }
            }}
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

      {isCurrentUser && (
        <Avatar.Root size="sm" ml={2} mt={1}>
          <Avatar.Fallback name={currentUser.name || 'You'} />
          <Avatar.Image src={currentUser.avatarImage || undefined} />
        </Avatar.Root>
      )}
    </Flex>
  );
};

const MessagingDrawer = ({ hiddenButton = false }: {hiddenButton?: boolean}) => {
  const [open, setOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [selectedRecipeDetails, setSelectedRecipeDetails] = useState<any>(null);
  
  // Add a new state for sorted messages
  const [sortedMessages, setSortedMessages] = useState<Message[]>([]);

  const drawerOpen = useStore($drawerOpen);
  const selectedConvo = useStore($selectedConvo);
  const selectedRecipeForSharing = useStore($selectedRecipeForMessage);

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

  useEffect(() => {
    setOpen(drawerOpen);
    setSelectedConversationId(selectedConvo);
    if (selectedRecipeForSharing) {
      handleInputChange({
        target: {
          value: `@${selectedRecipeForSharing} `,
        },
      } as React.ChangeEvent<HTMLInputElement>);
      setSelectedRecipeForMessage(null);
    }
  }, [drawerOpen, selectedConvo, selectedRecipeForSharing]);

  // Load conversations when drawer opens
  useEffect(() => {
    if (open) {
      loadConversations();
    }
  }, [open, loadConversations]);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId, 0, 20, true);
      const intervalId = setInterval(() => {
        loadMessages(selectedConversationId, 0, 20, false);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [selectedConversationId, loadMessages]);

  useLayoutEffect(() => {
    if (messagesContainerRef.current && sortedMessages.length > 0) {
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      });
    }
  }, [sortedMessages]);
  

  const handleSendMessage = async () => {
    if (selectedConversationId && (messageText.trim() || selectedRecipeId)) {
      const messageToSend = messageText.trim();
      setMessageText('');
      const recipeId = selectedRecipeId;
      setSelectedRecipeId(null);
      setSelectedRecipeDetails(null);
      try {
        await sendNewMessage(selectedConversationId, messageToSend, recipeId || undefined);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageText(value);
    
    // If the last character typed is a space, check if previous content has a recipe tag
    if (value.endsWith(' ')) {
      const previousContent = value.slice(0, -1);
      const match = previousContent.match(/@(\d+)$/);
      
      if (match && match[1] && !selectedRecipeId) {
        console.log(match, match[1], !selectedRecipeId);
        const recipeId = parseInt(match[1], 10);
                
        // Fetch recipe details
        const recipeDetails = await fetchRecipeById(recipeId);
        if (recipeDetails) {
          setSelectedRecipeId(recipeId);
          setSelectedRecipeDetails(recipeDetails);
          
          // Remove the @recipeId pattern from the message text
          const newText = value.replace(/@\d+\s/, '').trim();
          setMessageText(newText);
        }
      }
    }
  }, [selectedRecipeId]);
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectConversation = async (conversationId: number) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <Drawer.Root open={open} onOpenChange={(e) => setDrawerOpen(e.open)}>
      <Drawer.Trigger asChild>
      {hiddenButton ? <span /> : (
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
        )}
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
                  <CloseButton 
                  size="sm"  
                  onClick={() => {
                    setSelectedConvo(null);
                    setSelectedRecipeId(null);
                    setSelectedRecipeDetails(null);
                  }} />
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
                            <Avatar.Image src={conversation.otherUser.avatarImage || undefined} />
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
                  <Box flex="1" overflowY="auto" ref={messagesContainerRef}>
                    {isLoading ? (
                      <Center><Spinner /></Center>
                    ) : sortedMessages.length > 0 ? (
                      sortedMessages.map((message) => (
                        <MessageBubble 
                          key={message.id} 
                          message={message} 
                          isCurrentUser={message.senderId === user.id}
                          currentUser={user}  // Pass the user object
                        />
                      ))
                    ) : (
                      <Text p={4} textAlign="center" color="gray.500">
                        No messages yet. Start the conversation!
                      </Text>
                    )}
                  </Box>
                </Flex>
              )}
            </Drawer.Body>
              <Drawer.Footer>
                {selectedConversationId && (
                  <>
                    {selectedRecipeDetails && (
                      <Box 
                        p={2} 
                        mb={2} 
                        borderWidth="1px" 
                        borderRadius="md"
                        position="relative"
                      >
                        <Flex alignItems="center" gap={2}>
                          {selectedRecipeDetails.image ? (
                            <Box width="40px" height="40px" borderRadius="md" overflow="hidden">
                              <img 
                                src={selectedRecipeDetails.image} 
                                alt={selectedRecipeDetails.title} 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </Box>
                          ) : (
                            <Box width="40px" height="40px" bg="gray.200" borderRadius="md"></Box>
                          )}
                          <Text fontSize="sm" fontWeight="medium">{selectedRecipeDetails.title}</Text>
                        </Flex>
                        <CloseButton 
                          size="sm" 
                          position="absolute" 
                          top="0" 
                          right="0"
                          onClick={() => {
                            setSelectedRecipeId(null);
                            setSelectedRecipeDetails(null);
                          }}
                        />
                      </Box>
                    )}
                    <Flex gap={2} width="100%">
                      <Input
                        flex="1"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        size="md"
                      />
                    </Flex>
                  </>
                )}
              </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default MessagingDrawer;