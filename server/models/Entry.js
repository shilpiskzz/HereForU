// // server/models/Entry.js
// const mongoose = require('mongoose');
// // Add this helper function near the top
// function dateOnly(date) {
//     return new Date(date.getFullYear(), date.getMonth(), date.getDate());
// }


// // Schema defines what each journal entry should look like
// const entrySchema = new mongoose.Schema({
//     text: {
//         type: String,
//         required: true,
//     },
//     mood: {
//         type: String,
//         enum: ['Positive', 'Neutral', 'Negative'],
//         required: true,
//     },
//     date: {
//         type: Date,
//         default: () => dateOnly(new Date()),
//     },
// });

// const Entry = mongoose.model('Entry', entrySchema);

// module.exports = Entry;

// server/models/Entry.js
const mongoose = require('mongoose');

// Helper: set time to 00:00:00 for clean date comparison
function dateOnly(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Schema
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
        default: () => dateOnly(new Date()),
    }
}, {
    timestamps: true // ✅ Needed for streak tracking (createdAt)
});

// ✅ Define then export
const Entry = mongoose.model('Entry', entrySchema);
module.exports = Entry;
