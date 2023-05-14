const express = require('express');
const { Configuration, OpenAIApi } = require("openai");

const app = express();

app.use(express.json());

app.post('/api/response', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const apiKey = req.body.key;
        const model = req.body.model;
    
        const configuration = new Configuration({
            apiKey,
        });
        
        const openai = new OpenAIApi(configuration);

        if (!configuration.apiKey) {
            res.status(500).json({
                error: {
                    message: "OpenAI API key not configured",
                }
            });
            return;
        }

        const requestBody = {
            model: model ? model:"gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}],
            temperature: 0.5,
            max_tokens: 200,
        }
  
        const response = await openai.createChatCompletion(requestBody);

        const answer = response.data?.choices[0]?.message?.content?.trim() || 'Произошла ошибка.';

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(answer);
    } catch (error) {
        res.status(500).json({ error: 'Произошла ошибка при обращении к GPT API', message: error });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started');
});
