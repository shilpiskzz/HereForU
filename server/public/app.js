// client/app.js
const affirmations = [
    "You are enough just as you are.",
    "This moment is a fresh start.",
    "You can handle anything that comes your way.",
    "Emotions are visitors — let them come and go.",
    "You’re doing your best, and that is enough.",
    "Healing takes time. Be gentle with yourself.",
    "You are worthy of love and peace.",
    "Today is a new opportunity for growth."
];

const form = document.getElementById('journal-form');
const entryText = document.getElementById('entryText');
const currentMood = document.getElementById('currentMood');
const entriesList = document.getElementById('entriesList');

// 🔁 Fetch & render existing entries on load
window.addEventListener('DOMContentLoaded', () => {
    fetchEntries();
    fetchStreak(); // ✅ This is the line you add here
    setRandomAffirmation();
});

// 📨 Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = entryText.value.trim();
    if (!text) return;

    try {
        const response = await fetch('https://hereforu.onrender.com/api/entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        // Show current mood
        currentMood.textContent = `Detected Mood: ${data.mood} 🧠`;

        // Add to top of entries list
        const li = document.createElement('li');
        li.textContent = `[${data.mood}] ${data.text}`;
        entriesList.prepend(li);

        // Reset form
        entryText.value = '';

    } catch (err) {
        console.error('Failed to submit entry:', err);
    }
});

// 📥 Fetch & display past entries
async function fetchEntries() {
    try {
        const res = await fetch('https://hereforu.onrender.com/api/entries');
        const entries = await res.json();

        entriesList.innerHTML = '';
        entries.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `[${entry.mood}] ${entry.text}`;
            entriesList.appendChild(li);
        });
    } catch (err) {
        console.error('Failed to load entries:', err);
    }
}

async function fetchStreak() {
    try {
        const res = await fetch('https://hereforu.onrender.com/api/entries/streak');
        const { streak } = await res.json();
        document.querySelector('.streak p strong').textContent = `${streak} days`;
    } catch (err) {
        console.error('Failed to load streak:', err);
    }
}

function setRandomAffirmation() {
    const index = Math.floor(Math.random() * affirmations.length);
    const block = document.querySelector('.affirmation blockquote');
    block.textContent = affirmations[index];
}

