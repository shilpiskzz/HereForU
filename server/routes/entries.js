const express = require('express');
const Sentiment = require('sentiment');
const Entry = require('../models/Entry');

const router = express.Router();
const sentiment = new Sentiment();

// POST: Create a new journal entry
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
        const savedEntry = await newEntry.save();

        res.status(201).json(savedEntry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save entry' });
    }
});

// GET: Retrieve all journal entries
router.get('/', async (req, res) => {
    try {
        const entries = await Entry.find().sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

module.exports = router;

// GET: Mood streak (consecutive journaling days)
// GET: Mood streak (consecutive journaling days)
router.get('/streak', async (req, res) => {
    try {
        const entries = await Entry.find().sort({ date: -1 });

        if (!entries.length) return res.json({ streak: 0 });

        let streak = 1;
        let prevDate = new Date();
        prevDate.setHours(0, 0, 0, 0); // today at midnight

        for (let entry of entries) {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);

            const diff = (prevDate - entryDate) / (1000 * 60 * 60 * 24);

            if (diff === 0) continue; // same day, already counted
            if (diff === 1) {
                streak++;
                prevDate = entryDate;
            } else {
                break; // not a streak day
            }
        }

        res.json({ streak });
    } catch (err) {
        console.error('Streak error:', err);
        res.status(500).json({ error: 'Failed to calculate streak' });
    }
});



