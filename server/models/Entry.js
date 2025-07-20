// server/models/Entry.js
const mongoose = require('mongoose');

// Schema defines what each journal entry should look like
const entrySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    mood: {
        type: String,
        enum: ['Positive', 'Neutral', 'Negative'],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
