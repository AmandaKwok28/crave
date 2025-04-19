import express from 'express'
import { z } from 'zod';

const pdf_route = express.Router();

const pdfSchema = z.object({
    content : z.string().nonempty() 
});

pdf_route.post('/pdf-text', async (req, res) => {
    try {
        const result = pdfSchema.safeParse(req.body)
        if (!result.success) {
            res.status(400).json({
                message: 'Error in parsing pdf text content',
                error: result.error.flatten().fieldErrors
            });
        
            return;
        }

        const { content } = result.data;
        const apiKey = process.env.OPENAI_API_KEY;

        // define the api prompt
        const prompt = `You are an expert chef, food critic, and culinary content analyst. 
        You will be given raw extracted text from a PDF containing a recipe. Your task is to 
        analyze this unstructured text and extract structured, accurate metadata for the recipe.
        ### **Input Text**
        ${content}

        ### **Your Task**
        From this unstructured input, extract and generate the following information. Be intelligent about inferring missing parts, and use your culinary expertise to interpret noisy or inconsistent text.

        1. **Title**: Generate a concise and relevant title for the recipe.
        2. **Description**: Write a short, engaging description summarizing what the recipe is, what it tastes like, and when it might be served.
        3. **Ingredients**: Generate a list of **10 ingredients** in CSV format. Include only the main components required to make the dish. Do **not** include quantities or measurements. Use clean, simple names (e.g., "olive oil", not "2 tbsp of extra virgin olive oil").
        4. **Instructions**: Extract or summarize the key preparation steps from the input text. Keep this concise but clear.
        5. **Price Category**: Choose from **$, $$, $$$, $$$$** based on ingredient cost and preparation effort.
        6. **Cuisine Type**: Choose the most likely cuisine from this list: **ITALIAN, MEXICAN, CHINESE, INDIAN, JAPANESE, FRENCH, MEDITERRANEAN, AMERICAN**.
        7. **Difficulty Level**: Categorize the difficulty as **EASY, MEDIUM, or HARD**.
        8. **Prep Time**: Estimate the total preparation and cooking time in minutes. Slight overestimation is encouraged.
        9. **General Tags**: Provide **5 descriptive tags** in CSV format that summarize key features of the dish (e.g., “vegetarian, spicy, one-pot, gluten-free, low-carb”).
        10. **Meal Type**: Categorize the dish into one or more of the following: **Breakfast, Lunch, Dinner, Snack, Dessert, Brunch, Appetizer, Side Dish**.

        ### **Output Format**
        Respond in clean JSON. Do **not** include any extra commentary or markdown formatting. Example:

        {
        "title": "Thai Red Curry Chicken",
        "description": "A rich and aromatic Thai curry made with tender chicken, creamy coconut milk, and spicy red curry paste. Perfect for a cozy weeknight dinner.",
        "ingredients": ["Chicken breast", "Coconut milk", "Red curry paste", "Fish sauce", "Bamboo shoots", "Kaffir lime leaves", "Basil", "Garlic", "Ginger", "Jasmine rice"],
        "instructions": "Heat oil in a pan, sauté garlic and curry paste, add chicken and cook thoroughly. Add coconut milk, vegetables, and simmer until done. Serve with jasmine rice.",
        "price": "$$",
        "cuisine": "THAI",
        "difficulty": "MEDIUM",
        "prepTime": 45,
        "tags": ["spicy", "dairy-free", "curry", "one-pot", "gluten-free"],
        "mealTypes": ["Dinner", "Lunch"]
        }`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
            }),
        });

        const data: any = await response.json();

        if (response.ok) {
            const parsed = JSON.parse(data.choices[0].message.content);
            res.status(200).json({ response: parsed });
        } else {
            res.status(400).json({ error: data.error });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

export default pdf_route;

