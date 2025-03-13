import { Router } from "express";

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { recipeDescription } = req.body;

        const apiKey = process.env.OPENAI_API_KEY;
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
                        content: `Generate five tags for this recipe in a CSV list: ${recipeDescription} `
                    }
                ],
            }),
        });

        const data: any = await response.json();

        if (response.ok) {
            res.status(200).json({ tags: data });
        } else {
            res.status(400).json({ error: data.error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;