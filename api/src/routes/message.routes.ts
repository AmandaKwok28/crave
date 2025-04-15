import { Router } from 'express';
import { prisma } from '../../prisma/db.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

// Get all conversations for current user
router.get('/', authGuard, async (req, res) => {
  try {
    const userId = res.locals.user!.id;
    
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            avatarImage: true
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            avatarImage: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Transform data for frontend consumption
    const transformedConversations = conversations.map(conversation => {
      const isUser1 = conversation.user1Id === userId;
      const otherUser = isUser1 ? conversation.user2 : conversation.user1;
      
      return {
        id: conversation.id,
        otherUser: {
          id: otherUser.id,
          name: otherUser.name,
          avatarImage: otherUser.avatarImage
        },
        lastMessage: conversation.messages[0] || null,
        updatedAt: conversation.updatedAt
      };
    });

    res.json(transformedConversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages in a conversation
router.get('/:id/messages', authGuard, async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const userId = res.locals.user!.id;
    const page = parseInt(req.query.page?.toString() || '0');
    const limit = parseInt(req.query.limit?.toString() || '20');
    
    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    });
    
    if (!conversation) {
      res.status(403).json({ error: 'Not authorized to view these messages' });
      return;
    }
    
    // Get messages with pagination
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarImage: true
          }
        },
        recipe: {
          select: {
            id: true,
            title: true,
            image: true,
            difficulty: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: page * limit,
      take: limit
    });
    
    // Mark messages from other user as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false
      },
      data: { isRead: true }
    });
    
    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message (text or with recipe)
router.post('/:id/messages', authGuard, async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const userId = res.locals.user!.id;
    const { content, recipeId } = req.body;
    
    if (!content && !recipeId) {
      res.status(400).json({ error: 'Message must have content or a recipe' });
      return;
    }
    
    // Verify user is part of conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    });
    
    if (!conversation) {
      res.status(403).json({ error: 'Not authorized to send messages in this conversation' });
      return;
    }
    
    // Create message
    const message = await prisma.message.create({
      data: {
        content: content || '',
        senderId: userId,
        conversationId,
        recipeId: recipeId ? parseInt(recipeId) : null
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarImage: true
          }
        },
        recipe: recipeId ? {
          select: {
            id: true,
            title: true,
            image: true
          }
        } : undefined
      }
    });
    
    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Start a new conversation
router.post('/', authGuard, async (req, res) => {
  try {
    const userId = res.locals.user!.id;
    const { otherUserId } = req.body;
    
    if (!otherUserId) {
      res.status(400).json({ error: 'Must specify a user to message' });
      return;
    }
    
    if (userId === otherUserId) {
      res.status(400).json({ error: 'Cannot start a conversation with yourself' });
      return;
    }
    
    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: userId }
        ]
      }
    });
    
    if (existingConversation) {
      res.json({ 
        id: existingConversation.id, 
        existing: true 
      });
      return;
    }
    
    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        user1Id: userId,
        user2Id: otherUserId
      }
    });
    
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Get unread message count
router.get('/unread/count', authGuard, async (req, res) => {
  try {
    const userId = res.locals.user!.id;
    
    const unreadCount = await prisma.message.count({
      where: {
        conversation: {
          OR: [
            { user1Id: userId },
            { user2Id: userId }
          ]
        },
        senderId: { not: userId },
        isRead: false
      }
    });
    
    res.json({ unreadCount });
  } catch (error) {
    console.error('Error counting unread messages:', error);
    res.status(500).json({ error: 'Failed to count unread messages' });
  }
});

export default router;