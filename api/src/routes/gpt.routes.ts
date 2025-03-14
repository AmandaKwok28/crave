import { Router } from "express";

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { title, description, instructions } = req.body;
        const apiKey = process.env.OPENAI_API_KEY;
        const prompt = 
        `
        You are an expert chef and food critic. Based on the following recipe details, categorize it accordingly:  

        **Title:** ${title}  
        **Description:** ${description}  
        **Instructions:** ${instructions}  

        ### **Your Task:**  
        1. **Price Category**: Determine if the recipe is **$**, **$$**, **$$$**, **$$$$**, based on the cost of ingredients and preparation effort.  
        2. **Cuisine Type**: Identify the most relevant cuisine type from the following list: **ITALIAN, MEXICAN, CHINESE, INDIAN, JAPANESE, FRENCH, MEDITERRANEAN, AMERICAN**.  
        3. **Difficulty Level**: Categorize the difficulty as **EASY, MEDIUM, or HARD** based on the complexity of preparation and number of steps.  
        4. **Prep Time**: Provide an estimated preparation time in minutes. Please give a slightly overestimated value to ensure there is enough time for preparation and cooking
        5. **Ingredients** Provide a list of 10 ingredients for this recipe in a CSV format. Include all the ingredients needed, but exclude quantities and measurements. List the ingredients in simple, concise terms. 
        6. **General Tags**: Provide 5 relevant tags in CSV format that describe the dish (e.g., **spicy, vegetarian, one-pot, gluten-free**).  

        ### **Example Response Format (JSON)**  
        Provide the results in JSON format. Do not include introductory or closing remarks. Here is an example.
        {
        "price": "$$",
        "cuisine": "THAI",
        "difficulty": "MEDIUM",
        "prepTime": 60
        "ingredients": ["Coconut milk", "Chicken breasts", "Thai red curry paste", "Basil leaves", "Fish sauce", "Palm sugar", "Kaffir lime leaves", "Bamboo shoots", "Thai eggplant", "Jasmine rice"]
        "tags": ["spicy", "coconut", "chicken", "curry", "dairy-free"]
        }
        `
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
            res.status(200).json({ response: JSON.parse(data.choices[0].message.content) });
        } else {
            res.status(400).json({ error: data.error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;