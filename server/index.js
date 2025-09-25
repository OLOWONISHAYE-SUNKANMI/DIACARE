import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { openai } from './lib/openai.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

app.post('/predict', async (req, res) => {
  const { glucoseHistory } = req.body;

  const prompt = `
   Given the past glucose readings: ${glucoseHistory},
   predict the user sugar level for the next 30 minutes.
   Respond with just the number of mg/dL.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 300,
    });

    const prediction = completion.choices[0].message.content;
    res.json({ prediction: prediction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

app.post('/summarize', async (req, res) => {
  try {
    const { values } = req.body;

    if (!values) {
      return res.status(400).json({ message: 'No values provided' });
    }

    const systemPrompt = `
You are a health AI assistant. Always answer ONLY in the following format, with each item on a new line and no extra explanation:

Risk of Hypoglycemia: [probability %]
Forecast: BG may drop to [exact mg/dl] in [exact time].
Suggestions: Re-check in [exact time], and take [exact medication].

Do not add any extra text or explanation. Only output the summary in this format.
`;

    const userPrompt = `Health data: ${JSON.stringify(values)}`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 300,
    });

    const summary = chat.choices[0].message.content;

    res.json({ summary });
  } catch (error) {
    console.error(
      'Error something went wrong generating the summary',
      error.message
    );
    res.status(500).json({ message: 'Error generating summary' });
  }
});

app.get('/', (req, res) => {
  res.send('AI Summarization API is running.');
});

app.listen(port, () => {
  console.log(`AI server listening at http://localhost:${port}`);
});
