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


