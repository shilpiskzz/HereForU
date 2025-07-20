// client/app.js

const form = document.getElementById('journal-form');
const entryText = document.getElementById('entryText');
const currentMood = document.getElementById('currentMood');
const entriesList = document.getElementById('entriesList');

// 🔁 Fetch & render existing entries on load
window.addEventListener('DOMContentLoaded', () => {
    fetchEntries();
    fetchStreak(); // ✅ This is the line you add here
});

// 📨 Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = entryText.value.trim();
    if (!text) return;

    try {
        const response = await fetch('http://localhost:5000/api/entries', {
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
        const res = await fetch('http://localhost:5000/api/entries');
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
        const res = await fetch('http://localhost:5000/api/entries/streak');
        const { streak } = await res.json();
        document.querySelector('.streak p strong').textContent = `${streak} days`;
    } catch (err) {
        console.error('Failed to load streak:', err);
    }
}
