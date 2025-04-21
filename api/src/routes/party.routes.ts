import { Router } from 'express';
import { prisma } from '../../prisma/db.js';
import { authGuard } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { PartyStatus } from '@prisma/client';
import { recommendedPartyRecipes } from '../services/background-vector-update.js';

const router = Router();

// Get all parties for the current user (as host or member)
router.get('/my', authGuard, async (req, res) => {
  try {
    const parties = await prisma.cookingParty.findMany({
      where: {
        OR: [
          { hostId: res.locals.user!.id },
          { members: { some: { userId: res.locals.user!.id } } }
        ]
      },
      include: {
        members: {
          include: {
            user: true
          }
        },
        host: {
          select: {
            id: true,
            name: true,
            avatarImage: true
          }
        },
        preferences: true
      }
    });
    
    // Add a field to each party indicating if the user is the host
    const partiesWithRole = parties.map(party => ({
      ...party,
      isHost: party.hostId === res.locals.user!.id
    }));
    
    res.json(partiesWithRole);
  } catch (error) {
    console.error('Error fetching parties:', error);
    res.status(500).json({ message: 'Failed to fetch parties' });
  }
});

// Create a new cooking party
router.post('/', authGuard, async (req, res) => {
  try {
    const { name, expiresAt } = req.body;
    
    if (!name) {
      res.status(400).json({ message: 'Party name is required' });
      return;
    }
    
    const newParty = await prisma.cookingParty.create({
      data: {
        id: uuidv4(),
        name,
        hostId: res.locals.user!.id,
        shareLink: uuidv4(), // Generate a unique share link
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        status: PartyStatus.PENDING
      }
    });
    
    // Automatically add the host as a member
    await prisma.partyMember.create({
      data: {
        partyId: newParty.id,
        userId: res.locals.user!.id,
        hasAccepted: true // Host automatically accepts
      }
    });
    
    res.status(201).json(newParty);
  } catch (error) {
    console.error('Error creating party:', error);
    res.status(500).json({ message: 'Failed to create party' });
  }
});

// Delete a cooking party
router.delete('/:id', authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    
    // First verify the user is the host
    const party = await prisma.cookingParty.findUnique({
      where: {
        id,
        hostId: res.locals.user!.id
      }
    });
    
    if (!party) {
      res.status(404).json({ 
        message: 'Party not found or you are not authorized to delete it' 
      });
      return;
    }
    
    // Delete the party (cascade will handle related records)
    await prisma.cookingParty.delete({
      where: { id }
    });
    
    res.json({ message: 'Party deleted successfully' });
  } catch (error) {
    console.error('Error deleting party:', error);
    res.status(500).json({ message: 'Failed to delete party' });
  }
});

// Add a user to a party (join via invite link)
router.post('/join/:shareLink', authGuard, async (req, res) => {
  try {
    const { shareLink } = req.params;
    const { ingredients, cookingAbility } = req.body;
    
    // Find the party by share link
    const party = await prisma.cookingParty.findUnique({
      where: { shareLink }
    });
    
    if (!party) {
      res.status(404).json({ message: 'Party not found or invite link is invalid' });
      return;
    }
    
    // Check if the party has expired
    if (party.expiresAt && new Date(party.expiresAt) < new Date()) {
      res.status(400).json({ message: 'This invite has expired' });
      return;
    }
    
    // Check if user is already a member
    const existingMember = await prisma.partyMember.findFirst({
      where: {
        partyId: party.id,
        userId: res.locals.user!.id
      }
    });
    
    if (existingMember) {
      res.status(400).json({ message: 'You are already a member of this party' });
      return;
    }
    
    // Add user to party
    const newMember = await prisma.partyMember.create({
      data: {
        partyId: party.id,
        userId: res.locals.user!.id,
        hasAccepted: true,
        ingredients: ingredients || [],
        cookingAbility: cookingAbility || undefined
      }
    });
    
    res.status(201).json({
      message: 'Successfully joined the cooking party',
      member: newMember
    });
  } catch (error) {
    console.error('Error joining party:', error);
    res.status(500).json({ message: 'Failed to join the party' });
  }
});

// Get a singular party by share link
router.get('/:shareLink', authGuard, async (req, res) => {
  try {
    const { shareLink } = req.params;
    
    // Find the party by share link
    const party = await prisma.cookingParty.findUnique({
      where: { shareLink },
      include: {
        members: {
          select: {
            userId: true,
            hasAccepted: true,
            cookingAbility: true,
            user: {
              select: {
                id: true,
                name: true,
                avatarImage: true
              }
            }
          }
        },
        host: {
          select: {
            id: true,
            name: true,
            avatarImage: true
          }
        },
        preferences: true
      }
    });
    
    if (!party) {
      res.status(404).json({ message: 'Party not found or invite link is invalid' });
      return;
    }
    
    // Check if the party has expired
    if (party.expiresAt && new Date(party.expiresAt) < new Date()) {
      res.status(400).json({ message: 'This invite has expired' });
      return;
    }
    
    // Check if the user is already a member
    const isUserMember = party.members.some(member => member.userId === res.locals.user!.id);
    
    // Return the party with additional context for the user
    res.json({
      ...party,
      isUserMember,
      isHost: party.hostId === res.locals.user!.id,
      memberCount: party.members.length
    });
    
  } catch (error) {
    console.error('Error fetching party by share link:', error);
    res.status(500).json({ message: 'Failed to fetch party details' });
  }
});

// Get party prefrences by share link
router.get('/pref/:shareLink', authGuard, async (req, res) => {
  try {
    const { shareLink } = req.params;
    
    // Find the party by share link
    const partyPrefs = await prisma.cookingParty.findUnique({
      where: { shareLink },
      include: {
        preferences: {
          select: {
            availableTime: true,
            preferredCuisines: true,
            aggregatedIngredients: true,
            excludedAllergens: true,
            preferredPrice: true,
            preferredDifficulty: true,
          }
        }
      }
    });
    
    if (!partyPrefs) {
      res.status(404).json({ message: 'Party not found or invite link is invalid' });
      return;
    }

    // Return the partyPrefs with additional context for the user
    res.json({
      ...partyPrefs.preferences,
    });
    
  } catch (error) {
    console.error('Error fetching partyPrefs by share link:', error);
    res.status(500).json({ message: 'Failed to fetch partyPref details' });
  }
});

// Update party preferences
router.put('/:id/preferences', authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      availableTime, 
      preferredCuisines, 
      preferredPrice, 
      aggregatedIngredients, 
      excludedAllergens, 
      preferredDifficulty 
    } = req.body;
    
    // Prepare data for upsert
    const preferencesData = {
      availableTime,
      preferredCuisines,
      preferredPrice,
      aggregatedIngredients,
      excludedAllergens,
      preferredDifficulty,
      partyId: id
    };
    
    // Upsert the preferences (update if exists, create if not)
    const updatedPreferences = await prisma.partyPreference.upsert({
      where: { 
        partyId: id 
      },
      update: preferencesData,
      create: preferencesData
    });
    
    res.json(updatedPreferences);
  } catch (error) {
    console.error('Error updating party preferences:', error);
    res.status(500).json({ message: 'Failed to update party preferences' });
  }
});

// Remove a user from a party
router.delete('/:partyId/members/:userId', authGuard, async (req, res) => {
  try {
    const { partyId, userId } = req.params;
    const currentUserId = res.locals.user!.id;
    
    // Check if the party exists
    const party = await prisma.cookingParty.findUnique({
      where: { id: partyId }
    });
    
    if (!party) {
      res.status(404).json({ message: 'Party not found' });
      return;
    }
    
    // Users can remove themselves, or the host can remove anyone
    if (userId !== currentUserId && party.hostId !== currentUserId) {
      res.status(403).json({ 
        message: 'You do not have permission to remove this user' 
      });
      return;
    }
    
    // Check if the user is a member
    const memberToRemove = await prisma.partyMember.findFirst({
      where: {
        partyId,
        userId
      }
    });
    
    if (!memberToRemove) {
      res.status(404).json({ message: 'User is not a member of this party' });
      return;
    }
    
    // Remove the user from the party
    await prisma.partyMember.delete({
      where: { id: memberToRemove.id }
    });
    
    res.json({ message: 'User removed from party successfully' });
  } catch (error) {
    console.error('Error removing user from party:', error);
    res.status(500).json({ message: 'Failed to remove user from party' });
  }
});

// Get party recommendations by share link
router.get('/recommendations/:shareLink', authGuard, async (req, res) => {
  try {
    const { shareLink } = req.params;
    
    // Find the party by share link
    const partyRecs = await prisma.cookingParty.findUnique({
      where: { shareLink },
      include: {
        recommendations: {
          select: {
            id: true,
            partyId: true,
            recipeId: true,
            createdAt: true,
            recipe: true,
          }
        }
      }
    });
    
    if (!partyRecs) {
      res.status(404).json({ message: 'Recomendations not found or invite link is invalid' });
      return;
    }
    // Return the partyRecomendations
    res.json({
      ...partyRecs.recommendations,
    });
    
  } catch (error) {
    console.error('Error fetching partyPrefs by share link:', error);
    res.status(500).json({ message: 'Failed to fetch partyPref details' });
  }
});

// Add new party recommendation
router.post('/:partyId/add/:recipeID/recommendation', authGuard, async (req, res) => {
  try {
    const recipeId = parseInt(req.params.recipeID, 10);
    const { partyId } = req.params;
    const { 
      matchScore
    } = req.body;

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId }
    });
    // Check if party exists
    const party = await prisma.cookingParty.findUnique({
      where: { id: partyId }
    });

    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }
    if (!party) {
      res.status(404).json({ message: 'Party not found' });
      return;
    }

    // Create or update recently viewed entry
    await prisma.partyRecommendation.upsert({
      where: {
        partyId_recipeId: { partyId, recipeId }
      },
      update: {
        matchScore: matchScore,
      },
      create: {
        partyId,
        recipeId,
        matchScore: matchScore,
      }
    });

    res.status(200).json({ message: 'Party Recommendations updated successfully' });
    return;
  } catch (error) {
    console.error('Error updating party recommendations:', error);
    res.status(500).json({ message: 'Failed to update party recommendation' });
  }
});


// call python script to update recommended recipes
router.post('/:partyId/gen/recommendations', authGuard, async (req, res) => {
  try {
    const { partyId } = req.params;
    // Check if party exists
    const party = await prisma.cookingParty.findUnique({
      where: { id: partyId }
    });
    if (!party) {
      res.status(404).json({ message: 'Party not found' });
      return;
    }
    //call generate party recommendations algorithm
    recommendedPartyRecipes(partyId);
    res.status(200).json({ message: 'Party Recommendations updated successfully' });
    return;
  } catch (error) {
    console.error('Error updating party recommendations:', error);
    res.status(500).json({ message: 'Failed to update party recommendation' });
  }
});

export default router;