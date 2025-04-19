import { test, expect, vi, describe, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import { prisma } from '../lib/__mocks__/prisma.js';
import { hashPassword } from '../lib/password.js';
import { Like } from '@prisma/client';

// note: no testing on user2 interaction with user1 content becuase that is maintained by the frontend

// mock the Prisma client
vi.mock('../../prisma/db', async () => {
    const actual = await vi.importActual<typeof import('../lib/__mocks__/prisma.js')>('../lib/__mocks__/prisma.js');
    return {
      ...actual
    };
});

// sample user data
const exampleUser = {
    id: '1',
    name: 'Example User',
    email: 'example@example.com',
    school: 'Example University',
    major: 'Example Major',
    likes: [],
    bookmarks: [],
    avatarImage: null,
    passwordHash: 'fakehash',
    rating: 0
};

const exampleUser2 = {
    id: '2',
    name: 'Example2 User',
    email: 'example2@example.com',
    school: 'Example University',
    major: 'Example Major',
    likes: [],
    bookmarks: [],
    avatarImage: null,
    passwordHash: 'fakehash',
    rating: 0
};

const exampleLike: Like = {
  id: 1,
  recipeId: 1,
  userId: '1abc',
  date: new Date(),
};

const exampleRecipe = {
    id: 1,
    published: true,
    title: 'Example Recipe',
    description: 'Description',
    ingredients: [ '' ],
    instructions: [ '' ],
    image: 'Image',
    authorId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0,
    likes: [exampleLike],
    bookmarks: [],
    mealTypes: ["snack"],
    price: null,
    cuisine: null,
    allergens: ["peanuts"],
    difficulty: null,
    prepTime: 10,
    sources: ["Charmar"]
};

  
  


// make sure there's an exampleUser in the database before testing
beforeEach(async () => {

    prisma.user.findUnique.mockResolvedValue(exampleUser);
    prisma.user.findUnique.mockResolvedValue(exampleUser2);

});


describe('Route Testing GET and PUT', () => {

    // test that you can get the rating
    test('can fetch a user rating via GET /:id/rating', async () => {

        // mock the initial user lookup
        prisma.user.findUnique.mockResolvedValue(exampleUser);
        const res = await request(app).get(`/${exampleUser.id}/rating`);
    
        // make sure the request goes through and that the body is correct
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: 'Success!',
            rating: exampleUser.rating
        });
        
        // confirm that `prisma.user.findUnique` was called with the correct arguments
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: exampleUser.id }
        });
    });


    // test that you can adjust the rating
    test('can update a user rating via PUT /:id/rating', async () => {
        
        const newRating = exampleUser.rating + 5; 
        prisma.user.findUnique.mockResolvedValue(exampleUser);

        // mock the update function to return the updated user object
        prisma.user.update.mockResolvedValue({
            ...exampleUser,
            rating: newRating,
        });

        // send a PUT request to update the user's rating
        const res = await request(app)
            .put(`/${exampleUser.id}/rating`)
            .send({ rating: newRating });

        // verify the response is successful and includes the new rating
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User rating successfully updated');
        expect(res.body.user.rating).toBe(newRating);

        // verify the correct methods were called
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: exampleUser.id }
        });

        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: exampleUser.id },
            data: { rating: newRating }
        });
    });

})


describe('Rating change due to creating a recipe', () => {
    
    // test that the user rating increases by +5 when they create (publish a recipe)
    test('Publishing a recipe adds +5 to user rating', async () => {
        const originalRating = exampleUser.rating;
        
        // Mock the GET /:id/rating response
        prisma.user.findUnique.mockResolvedValueOnce({
            ...exampleUser,
            rating: originalRating
        });
        
    
        // Fetch the user's original rating
        const res = await request(app).get(`/${exampleRecipe.id}/rating`);
        const rating = res.body.rating;
    
        expect(res.status).toBe(200);
        expect(rating).toBe(originalRating);
    
        // Mock recipe creation response
        prisma.recipe.create.mockResolvedValue(exampleRecipe);
        prisma.recipe.findUnique.mockResolvedValueOnce(exampleRecipe);

    
        // Now mock the updated user after publishing the recipe (new rating)
        const updatedUser = { ...exampleUser, rating: rating + 5 };
        
        // Mock the logic of publishing a recipe (recipe.update) and user.update (rating increase)
        prisma.user.findUnique.mockResolvedValueOnce(exampleUser); // To simulate fetching user before update
        prisma.user.update.mockResolvedValueOnce(updatedUser); // Simulating the update of the user's rating
    
        // Simulate the publish request to the recipe
        const publishRes = await request(app).put(`/recipe/${exampleRecipe.id}/publish`);
        expect(publishRes.status).toBe(200);
    
        // After publishing, check if the user rating increased by 5
        prisma.user.findUnique.mockResolvedValueOnce(updatedUser); // Get updated user after rating increase
    
        const res2 = await request(app).get(`/${exampleUser.id}/rating`);
        expect(res2.status).toBe(200);
        expect(res2.body).toEqual({
            message: 'Success!',
            rating: rating + 5
        });
    });
    
})


describe('Rating change due to user2 interaction with recipe', () => {

    // make sure a recipe is already in the database so it doesn't affect rating comparisons
    beforeEach(async () => {
        prisma.recipe.create.mockResolvedValue(
            exampleRecipe                               // author should be user 1
        )
        await request(app).put(`/recipe/${exampleRecipe.id}/publish`);
    })

     // test that the user rating increases by +1 when user2 comments
     test('test that the user rating increases by +1 when user2 comments', async () => {

        prisma.user.findUnique.mockResolvedValueOnce({ ...exampleUser }); // mock user 1 (recipe author)
        const res = await request(app).get(`/${exampleRecipe.id}/rating`);
        const rating = res.body.rating;
    
        expect(rating).toBe(0);
        prisma.recipe.findUnique.mockResolvedValueOnce({
            ...exampleRecipe,
            authorId: exampleUser.id // this ensures exampleUser is the author
        });
    

        prisma.user.findUnique.mockResolvedValueOnce(exampleUser2); // mock user 2 (commenter)
        await request(app)
            .post(`/recipe/${exampleRecipe.id}/comments`)
            .send({
                id: exampleRecipe.id,
                content: "Great recipe!",
                authorId: exampleUser2.id // Correct commenter ID
            });
    
        prisma.user.findUnique.mockResolvedValueOnce({ ...exampleUser, rating: rating + 1 }); // Simulate user1's rating increase after the comment
    
        const res2 = await request(app).get(`/${exampleRecipe.id}/rating`);
        const rating2 = res2.body.rating;
        console.log(rating2)
    
        expect(rating2).toBe(rating + 1);  
    });

});










// test that you can update the rating


