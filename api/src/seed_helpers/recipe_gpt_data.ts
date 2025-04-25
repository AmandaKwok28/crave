import { faker } from '@faker-js/faker';

faker.seed(42)

const number_recipes = 50;
    
const apiKey = process.env.OPENAI_API_KEY;

interface Recipe {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    mealTypes: string[];
    price: string;
    cuisine: string;
    allergens: string[];
    difficulty: string;
    sources: string[];
    prepTime: number;
}
  



const getPrompt = (
    title: string
) => {

const prompt = `
You are an expert chef and food critic helping to populate a recipe database. 

Generate a recipe titled ${title} and follow these strict rules:

### ENUM OPTIONS (USE EXACTLY THESE — NO OTHER VALUES):
- "difficulty": "EASY", "MEDIUM", "HARD"
- "price": "CHEAP", "MODERATE", "PRICEY", "EXPENSIVE"
- "cuisine": "ITALIAN", "MEXICAN", "CHINESE", "INDIAN", "JAPANESE", "FRENCH", "MEDITERRANEAN", "AMERICAN"
- "mealTypes": "Breakfast", "Lunch", "Dinner", "Snack" (choose 1 or 2 per recipe)
- "sources": Choose 2 or 3 per recipe from: "Safeway", "CharMar", "Giant", "WholeFoods", "Costco", "SamsClub", "Streets Market"

### OUTPUT FORMAT:
Return ONLY a single valid JSON object — no array, no markdown, no additional text. The output must be directly parsable.

### THE RECIPE OBJECT MUST INCLUDE:
- "title": A short, creative dish name
- "description": 1-2 sentence summary of the dish
- "ingredients": Array of EXACTLY 10 distinct items (simple terms, no quantities)
- "instructions": Array of 5-10 clear, numbered steps
- "mealTypes": Array of 1 or 2 items from allowed list
- "price": One of the allowed "price" values
- "cuisine": One of the allowed "cuisine" values
- "difficulty": One of the allowed "difficulty" values
- "prepTime": Integer between 10-90 (in minutes)
- "sources": Array of 2-3 store names from the allowed list
- "allergens": Array of 2-5 likely allergens (e.g., "Peanuts", "Dairy", "Wheat", etc.)

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
    "mealTypes": ["Dinner", "Lunch"],
    "allergens": ["Peanuts", "soy", "wheat", "milk"]
}`;

return prompt;

}


const titles = [
    "Creamy Tuscan Chicken",
    "Classic Margherita Pizza",
    "Spinach and Ricotta Cannelloni",
    "Sicilian Caponata",
    "Lemon Risotto with Asparagus",
    "Italian Meatball Sub",
    "Pesto Gnocchi Bake",
  
    "Spicy Chicken Tinga Tacos",
    "Beef Enchiladas Verde",
    "Vegetarian Chiles Rellenos",
    "Carne Asada Quesadillas",
    "Mole Chicken with Rice",
    "Mexican Street Corn Salad",
    "Pozole Rojo",
  
    "Kung Pao Tofu",
    "Sweet and Sour Chicken",
    "Dan Dan Noodles",
    "Eggplant in Garlic Sauce",
    "Crispy Peking Duck Wraps",
    "Shrimp Fried Rice",
    "Scallion Pancake Rolls",
  
    "Butter Chicken Masala",
    "Chana Masala with Basmati",
    "Saag Paneer",
    "Lamb Rogan Josh",
    "Aloo Gobi Stir-Fry",
    "Spiced Lentil Dal",
    "Tandoori Grilled Vegetables",
  
    "Teriyaki Glazed Salmon",
    "Vegetable Tempura Udon",
    "Chicken Katsu Curry",
    "Spicy Tuna Onigiri",
    "Miso Ramen with Egg",
    "Ginger Pork Donburi",
    "Yakisoba Noodles",
  
    "Beef Bourguignon",
    "Ratatouille Provençal",
    "French Onion Soup",
    "Duck à l'Orange",
    "Herbed Goat Cheese Tart",
    "Salmon en Papillote",
    "Coq au Vin",
  
    "Grilled Halloumi Couscous Bowl",
    "Falafel Pita Wraps",
    "Shakshuka with Feta",
    "Lemon Herb Quinoa Salad",
    "Roasted Red Pepper Hummus Bowl",
    "Lamb Kofta Skewers",
  
    "Southern BBQ Pulled Pork",
    "Mac and Cheese Casserole",
    "Buffalo Cauliflower Bites",
    "Classic BLT Sandwich",
    "Maple-Glazed Chicken and Waffles",
    "Stuffed Bell Pepper Boats",
    "Cajun Shrimp and Grits"
];
  


const generateRecipes = async (): Promise<Recipe[]> => {

    let recipes = [];

    for (let i=0; i < 25; i++) {

        const prompt = getPrompt(titles[i])
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
        // Extract the content from the response
        const content = data.choices[0].message.content;
        
        try {
            recipes.push(JSON.parse(content));
        } catch (err) {
            console.log('failed to seed the database');
        }

    }

    return recipes;
};

  
export default generateRecipes;