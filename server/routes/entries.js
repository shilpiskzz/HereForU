// const express = require('express');
// const Sentiment = require('sentiment');
// const Entry = require('../models/Entry');

// const router = express.Router();
// const sentiment = new Sentiment();

// // POST: Create a new journal entry with sentiment analysis
// router.post('/', async (req, res) => {
//     try {
//         const { text } = req.body;

//         if (!text) {
//             return res.status(400).json({ error: 'Text is required' });
//         }

//         const result = sentiment.analyze(text);
//         const score = result.score;

//         let mood = 'Neutral';
//         if (score > 1) mood = 'Positive';
//         else if (score < -1) mood = 'Negative';

//         const newEntry = new Entry({ text, mood });
//         const savedEntry = await newEntry.save();

//         res.status(201).json(savedEntry);
//     } catch (err) {
//         console.error('❌ Failed to save entry:', err);
//         res.status(500).json({ error: 'Failed to save entry' });
//     }
// });

// // GET: Retrieve all journal entries
// router.get('/', async (req, res) => {
//     try {
//         const entries = await Entry.find().sort({ createdAt: -1 });
//         res.json(entries);
//     } catch (err) {
//         console.error('❌ Failed to fetch entries:', err);
//         res.status(500).json({ error: 'Failed to fetch entries' });
//     }
// });

// // GET: Mood streak (consecutive journaling days)
// router.get('/streak', async (req, res) => {
//     try {
//         const entries = await Entry.find().sort({ createdAt: -1 });

//         let streak = 0;
//         let today = new Date();
//         today.setHours(0, 0, 0, 0);

//         for (let entry of entries) {
//             const entryDate = new Date(entry.createdAt);
//             entryDate.setHours(0, 0, 0, 0);

//             if (entryDate.getTime() === today.getTime()) {
//                 streak++;
//                 today.setDate(today.getDate() - 1);
//             } else if (entryDate.getTime() === today.getTime() - 86400000) {
//                 streak++;
//                 today.setDate(today.getDate() - 1);
//             } else {
//                 break;
//             }
//         }

//         res.json({ streak });
//     } catch (err) {
//         console.error('❌ Failed to calculate streak:', err);
//         res.status(500).json({ error: 'Failed to calculate streak' });
//     }
// });

// module.exports = router;


// server/routes/entries.js
const express = require('express');
const Sentiment = require('sentiment');
const Entry = require('../models/Entry');

const router = express.Router();
const sentiment = new Sentiment();

// POST: Create new journal entry
router.post('/', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const result = sentiment.analyze(text);
        const score = result.score;

        let mood = 'Neutral';
        if (score > 1) mood = 'Positive';
        else if (score < -1) mood = 'Negative';

        const newEntry = new Entry({ text, mood });
        await newEntry.save();

        res.status(201).json({
            text: savedEntry.text,
            mood: savedEntry.mood,
            date: savedEntry.date,
        });
    } catch (err) {
        console.error('❌ Failed to save entry:', err);
        res.status(500).json({ error: 'Failed to save entry' });
    }
});

// GET: Fetch all entries
router.get('/', async (req, res) => {
    try {
        const entries = await Entry.find().sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        console.error('❌ Failed to fetch entries:', err);
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

// GET: Mood streak (consecutive days)
router.get('/streak', async (req, res) => {
    try {
        const entries = await Entry.find().sort({ date: -1 });

        let streak = 0;
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let entry of entries) {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);

            if (entryDate.getTime() === today.getTime()) {
                streak++;
                today.setDate(today.getDate() - 1);
            } else if (entryDate.getTime() === today.getTime() - 86400000) {
                streak++;
                today.setDate(today.getDate() - 1);
            } else {
                break;
            }
        }

        res.json({ streak });
    } catch (err) {
        console.error('❌ Failed to calculate streak:', err);
        res.status(500).json({ error: 'Failed to calculate streak' });
    }
});

module.exports = router;
