import { CommentType, Cuisine, Difficulty, PartyMemberType, PartyPrefrenceType, PartyRecommendationType, PartyType, Price, RecipeType, TagsResponse, UserType } from "./types";
import { API_URL } from "@/env";

// Fetch all users
export const fetchUsers = async (): Promise<UserType[]> => {
  const response = await fetch(`${API_URL}/users`, {
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: UserType[] = await response.json();
  return data;
};

// Fetch user by id
export const fetchUser = async (userId: string): Promise<UserType> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: UserType = await response.json();
  return data;
}

// Fetch all recipes with query
export const fetchRecipes = async (
  filters?: any,
  search?: string
): Promise<RecipeType[]> => {
  const filterParams: string[] = [];

  if (filters.mealTypes?.length > 0) {
    filterParams.push(`mealTypes=${filters.mealTypes.join(",")}`);
  }
  if (filters.price) {
    filterParams.push(`price=${filters.price}`);
  }
  if (filters.difficulty) {
    filterParams.push(`difficulty=${filters.difficulty}`);
  }
  if (filters.cuisine?.length > 0) {
    filterParams.push(`cuisine=${filters.cuisine.join(",")}`);
  }
  if (filters.prepTimeMin) {
    filterParams.push(`prepTimeMin=${filters.prepTimeMin}`);
  }
  if (filters.prepTimeMax) {
    filterParams.push(`prepTimeMax=${filters.prepTimeMax}`);
  }
  if (filters.ingredients?.length > 0) {
    filterParams.push(`ingredients=${filters.ingredients.join(",")}`);
  }
  if (filters.allergens?.length > 0) {
    filterParams.push(`allergens=${filters.allergens.join(",")}`);
  }
  if (filters.sources?.length > 0) {
    filterParams.push(`sources=${filters.sources.join(",")}`);
  }
  if (filters.major) {
    filterParams.push(`major=${filters.major}`);
  }
  if (filters.dateMin) {
    filterParams.push(`dateMin=${filters.dateMin}`);
  }
  if (filters.dateMax) {
    filterParams.push(`dateMax=${filters.dateMax}`);
  }

  if (search) {
    filterParams.push(`search=${search}`)
  }

  const queryString = filterParams.length > 0 ? `?${filterParams.join("&")}` : '';
  const response = await fetch(`${API_URL}/feed${queryString}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }

  const data: RecipeType[] = await response.json();
  return data;
};

// Fetch all drafts
export const fetchDrafts = async (): Promise<RecipeType[]> => {
  const response = await fetch(`${API_URL}/user/drafts`, { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  
  const data: RecipeType[] = await response.json();
  return data;
};

// Fetch specific recipe
export const fetchRecipe = async (recipe_id: string | number): Promise<RecipeType> => {
  const response = await fetch(`${API_URL}/recipe/${recipe_id}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }

  const recipe: RecipeType = await response.json();
  return recipe;
};

// Like a recipe
export const likeRecipe = async (recipe_id: string | number): Promise<void> => {
  const response = await fetch(`${API_URL}/like/${recipe_id}`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
}

export const unlikeRecipe = async (recipe_id: string | number): Promise<void> => {
  const response = await fetch(`${API_URL}/like/${recipe_id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
}

// Bookmark routes
export const bookmarkRecipe = async (recipe_id: string | number): Promise<void> => {
  const response = await fetch(`${API_URL}/bookmark/${recipe_id}`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
}

export const unbookmarkRecipe = async (recipe_id: string | number): Promise<void> => {
  const response = await fetch(`${API_URL}/bookmark/${recipe_id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
}

// Delete recipe by id
export const deleteRecipe = async (recipe_id: number) : Promise<boolean> => {
  const response = await fetch(`${API_URL}/recipe/${recipe_id}`, {
    credentials: 'include',
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return true;
};

export const fetchLikes = async (): Promise<RecipeType[]> => {
  const response = await fetch(`${API_URL}/like/my`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const likes: RecipeType[] = await response.json();
  return likes;
}

export const fetchBookmarks = async (): Promise<RecipeType[]> => {
  const response = await fetch(`${API_URL}/bookmark/my`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const bookmarks: RecipeType[] = await response.json();
  return bookmarks;
}


// Publish a recipe
export const publishRecipe = async (id:number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/recipe/${id}/publish`, {
    method: "PUT",
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return true;
}

// Create a new recipe
export const createRecipe = async (
  title: string, 
  description: string, 
  ingredients: string[], 
  instructions: string[],
  id: string,
  mealTypes: string[],
  price: Price,
  cuisine: Cuisine,
  allergens: string[],
  difficulty: Difficulty,
  sources: string[],
  prepTime: number,
  image?: string
): Promise<RecipeType> => {

    const response = await fetch(`${API_URL}/recipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({
        title,
        ingredients,
        instructions,
        description,
        authorId: id,
        mealTypes,
        price,
        cuisine,
        allergens,
        difficulty,
        sources,
        prepTime,
        image
      }),
    });
    if (!response.ok) {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const data: RecipeType = await response.json();
    return data;
};

// Update a recipe
export const patchRecipe = async (
  id: number,
  title: string, 
  description: string, 
  ingredients: string[], 
  instructions: string[],
  published: boolean,
  mealTypes: string[],
  price: Price,
  cuisine: Cuisine,
  allergens: string[],
  difficulty: Difficulty,
  sources: string[],
  prepTime: number,
  image?: string
): Promise<RecipeType> => {
    const response = await fetch(`${API_URL}/recipe/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({
        title,
        ingredients,
        instructions,
        description,
        published,
        mealTypes,
        price,
        cuisine,
        allergens,
        difficulty,
        sources,
        prepTime,
        image
      }),
    });
    if (!response.ok) {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const data: RecipeType = await response.json();
    return data;
};

// Login
export const login = async ( email: string, password: string ): Promise<UserType> => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
    })
  });

  if (!res.ok) {
    // ZodError
    if (res.status === 400) {
      const json = await res.json();
      throw new Error(JSON.stringify(json['error']));
    }

    throw new Error(`Request failed with status ${res.status}`);
  }

  const { data }: { data: UserType } = await res.json();
  return data;
}


// get the allergens
export const fetchAllergen = async () => {
  const res = await fetch(`${API_URL}/allergens`, {
    credentials: 'include'
  });
  if (!res.ok) {
    throw new Error(`API request failed! with status: ${res.status}`);
  }
  const data = await res.json();
  return data;
}

// Fetch auto-generated tags
export const fetchTags = async (title: string, description: string, instructions: string[]): Promise<TagsResponse> => {
  const response = await fetch(`${API_URL}/gpt`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
      instructions: instructions,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.statusText}`);
  }

  const data: TagsResponse = await response.json();
  return data;
};


// Fetch similar recipes for a recipe
export const fetchSimilarRecipes = async (recipeId: number, limit: number = 3): Promise<RecipeType[]> => {
  const res = await fetch(`${API_URL}/recipe/${recipeId}/similar?limit=${limit}`, {
    credentials: 'include'
  });
  
  if (!res.ok) {
    throw new Error(`API request failed! with status: ${res.status}`);
  }
  
  const data: RecipeType[] = await res.json();
  return data;
};


// update the avatar url
export const editAvatarUrl = async (email: string, url: string): Promise<UserType> => {
  const res = await fetch(`${API_URL}/user/avatar`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      url,
    })
  });

  if (!res.ok) {
    throw new Error(`API request failed! with status: ${res.status}`);
  }

  const user: UserType = await res.json();
  return user;

}

// Mark a recipe as recently viewed
export const markRecipeAsViewed = async (recipeId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/user/recently-viewed/${recipeId}`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
};

// Fetch recently viewed recipes
export const fetchRecentlyViewed = async (): Promise<RecipeType[]> => {
  const response = await fetch(`${API_URL}/user/recently-viewed`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const recentlyViewed: RecipeType[] = await response.json();
  return recentlyViewed;
};

// Fetch user recommended recipes
export const fetchUserRecommendedRecipes = async (limit?: number): Promise<RecipeType[]> => {
  // Add the limit as a query parameter if provided
  const queryParams = limit ? `?limit=${limit}` : '';
  
  const response = await fetch(`${API_URL}/user/recommended${queryParams}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const recommendedRecipes: RecipeType[] = await response.json();
  return recommendedRecipes;
}

// Fetch all comments for a given recipe
export const fetchComments = async (recipe_id: string | number): Promise<CommentType[]> => {
  const response = await fetch(`${API_URL}/recipe/${recipe_id}/comments`, {
    method: 'GET',
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const comments: CommentType[] = await response.json();
  return comments;
};

// Create comment on a recipe
export const createComment = async (recipe_id: string | number, content: string, userId: string): Promise<CommentType> => {
  const response = await fetch(`${API_URL}/recipe/${recipe_id}/comments`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({
      content,
      id: recipe_id,
      authorId: userId,
    }),
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const comment: CommentType = await response.json();
  return comment;
};

// Delete comment on a recipe
export const deleteComment = async (recipe_id: string | number, commentId: number) : Promise<boolean> => {
  const response = await fetch(`${API_URL}/recipe/${recipe_id}/comments/${commentId}`, {
    credentials: 'include',
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return true;
};

// create a new party
export const createNewParty = async (title: string, expirationDate: String): Promise<PartyType> => {
  const response = await fetch(`${API_URL}/party/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({
      name: title,
      expiresAt: expirationDate,
    }),
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: PartyType = await response.json();
  return data;
}

// Delete party by id
export const deleteParty = async (party_id: string) : Promise<boolean> => {
  const response = await fetch(`${API_URL}/party/${party_id}`, {
    credentials: 'include',
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return true;
};

// Fetch followers
export const fetchFollowers = async (userId: string): Promise<UserType[]> => {
  const response = await fetch(`${API_URL}/users/${userId}/followers`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }

  const followers: UserType[] = await response.json();
  return followers;
};

// Fetch following
export const fetchFollowing = async (userId: string): Promise<UserType[]> => {
  const response = await fetch(`${API_URL}/users/${userId}/following`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }

  const following: UserType[] = await response.json();
  return following;
};

// Follow a user
export const followUser = async (targetUserId: string, followerId: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/users/${targetUserId}/follow`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({ followerId })
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }

  return true;
};

// Remove member from party by id
export const removeAPartyMember = async (party_id: string, user_id: string) : Promise<boolean> => {
  const response = await fetch(`${API_URL}/party/${party_id}/members/${user_id}`, {
    credentials: 'include',
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return true;
};

// Fetch all parties for a curr user
export const fetchParties = async (): Promise<PartyType[]> => {
  const response = await fetch(`${API_URL}/party/my`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const parties: PartyType[] = await response.json();
  return parties;
};

// Fetch specific party
export const fetchParty = async (share_link: string | number): Promise<PartyType> => {
  const response = await fetch(`${API_URL}/party/${share_link}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }

  const party: PartyType = await response.json();
  return party;
};

// Fetch specific party Prefs
export const fetchPartyPrefs = async (share_link: string | number): Promise<PartyPrefrenceType> => {
  const response = await fetch(`${API_URL}/party/pref/${share_link}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }

  const partyPref: PartyPrefrenceType = await response.json();
  return partyPref;
};

// Update a party prefrences
export const modPartyPrefrences = async (
  id: string,
  availableTime: number,
  preferredCuisines: Cuisine[],
  aggregatedIngredients: string[],
  excludedAllergens: string[],
  preferredPrice: Price,
  preferredDifficulty: Difficulty,
): Promise<PartyPrefrenceType> => {
    const response = await fetch(`${API_URL}/party/${id}/preferences`, {
      method: "PUT",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        availableTime,
        preferredCuisines,
        aggregatedIngredients,
        excludedAllergens,
        preferredPrice,
        preferredDifficulty,
      }),
    });
    if (!response.ok) {
      throw new Error(`API request failed! with status: ${response.status}`);
    }
    const data: PartyPrefrenceType = await response.json();
    return data;
};

// add a new member to a party
export const addPartyMember = async (
  share_link: string, 
  ingredients: string[],
  cookingAbility: Difficulty
): Promise<PartyMemberType> => {
  const response = await fetch(`${API_URL}/party/join/${share_link}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({
      ingredients,
      cookingAbility,
    }),
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  const data: PartyMemberType = await response.json();
  return data;
}

// Fetch specific party Recommendations
export const fetchPartyRecs = async (share_link: string | number): Promise<PartyRecommendationType[]> => {
  const response = await fetch(`${API_URL}/party/recommendations/${share_link}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }

  const partyRecs: PartyRecommendationType[] = await response.json();
  return partyRecs;
};

// call route to run party recommendation algorithm
export const runPartyRecommendedAlgo = async (partyId: string ): Promise<void> => {
  const response = await fetch(`${API_URL}/party/${partyId}/gen/recommendations`, {
    method: "POST",
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }
  return;
}

// Unfollow a user
export const unfollowUser = async (targetUserId: string, followerId: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/users/${targetUserId}/unfollow`, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({ followerId })
  });

  if (!response.ok) {
    throw new Error(`API request failed! with status: ${response.status}`);
  }

  return true;
};

// Types for messages
export interface Conversation {
  id: number;
  otherUser: {
    id: string;
    name: string;
    avatarImage?: string;
  };
  lastMessage: Message | null;
  updatedAt: string;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: string;
  conversationId: number;
  isRead: boolean;
  sender: {
    id: string;
    name: string;
    avatarImage?: string;
  };
  recipe?: {
    id: number;
    title: string;
    image?: string;
    difficulty?: string;
  };
}

// Fetch all conversations for current user
export const fetchConversations = async (): Promise<Conversation[]> => {
  const response = await fetch(`${API_URL}/message`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const conversations: Conversation[] = await response.json();
  return conversations;
};

// Fetch messages in a conversation with pagination
export const fetchMessages = async (conversationId: number, page = 0, limit = 20): Promise<Message[]> => {
  const response = await fetch(`${API_URL}/message/${conversationId}/messages?page=${page}&limit=${limit}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const messages: Message[] = await response.json();
  return messages;
};

// Send a message (text and/or recipe)
export const sendMessage = async (
  conversationId: number, 
  content?: string, 
  recipeId?: number
): Promise<Message> => {
  if (!content && !recipeId) {
    throw new Error('Message must have either content or a recipe');
  }

  const response = await fetch(`${API_URL}/message/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      content,
      recipeId
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const message: Message = await response.json();
  return message;
};

// Create a new conversation with another user
export const createConversation = async (otherUserId: string): Promise<{id: number, existing: boolean}> => {
  const response = await fetch(`${API_URL}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      otherUserId
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return await response.json();
};

// Get count of unread messages
export const getUnreadMessageCount = async (): Promise<number> => {
  const response = await fetch(`${API_URL}/message/unread/count`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.unreadCount;
};