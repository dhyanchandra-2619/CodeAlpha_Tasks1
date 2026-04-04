// ============================================
//   QUOTEVIBE — script.js
//   Handles: quotes data, rendering, animation
// ============================================

// ---------- Quote Data ----------
const quotes = [
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", meta: "Philosopher & Writer", category: "Success" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", meta: "Co-founder, Apple", category: "Leadership" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi", meta: "Leader of Indian Independence Movement", category: "Motivation" },
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt", meta: "Former First Lady of the United States", category: "Growth" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser", meta: "Entrepreneur", category: "Work" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan", meta: "Explorer & Motivational Speaker", category: "Dreams" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", meta: "Co-founder, Apple", category: "Life" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", meta: "Management Consultant", category: "Future" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", meta: "26th U.S. President", category: "Confidence" },
  { text: "Small progress is still progress.", author: "Unknown", meta: "Motivational Saying", category: "Motivation" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", meta: "Co-founder, Apple", category: "Work" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", meta: "Physicist", category: "Resilience" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", meta: "Philosopher", category: "Persistence" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", meta: "Musician", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", meta: "Former First Lady", category: "Dreams" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", meta: "Physicist", category: "Purpose" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", meta: "Hockey Legend", category: "Action" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford", meta: "Industrialist", category: "Mindset" },
  { text: "The mind is everything. What you think, you become.", author: "Buddha", meta: "Spiritual Teacher", category: "Mindset" },
  { text: "An unexamined life is not worth living.", author: "Socrates", meta: "Philosopher", category: "Wisdom" },
  { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa", meta: "Humanitarian", category: "Kindness" },
  { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead", meta: "Anthropologist", category: "Humor" },
  { text: "Do not go where the path may lead; go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson", meta: "Essayist & Poet", category: "Courage" },
  { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou", meta: "Poet & Author", category: "Resilience" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", meta: "Statesman", category: "Resilience" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", meta: "16th U.S. President", category: "Life" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth", meta: "Baseball Legend", category: "Courage" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller", meta: "Author & Activist", category: "Adventure" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", meta: "Renaissance Genius", category: "Wisdom" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela", meta: "Statesman", category: "Action" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", meta: "26th U.S. President", category: "Action" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James", meta: "Philosopher", category: "Purpose" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", meta: "British PM", category: "Resilience" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", meta: "Author", category: "Dreams" },
  { text: "To handle yourself, use your head; to handle others, use your heart.", author: "Eleanor Roosevelt", meta: "Former First Lady", category: "Wisdom" },
  { text: "Keep your face always toward the sunshine, and shadows will fall behind you.", author: "Walt Whitman", meta: "Poet", category: "Positivity" },
  { text: "Whatever you are, be a good one.", author: "Abraham Lincoln", meta: "16th U.S. President", category: "Purpose" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt", meta: "32nd U.S. President", category: "Resilience" },
];

// ---------- Category color map ----------
const categoryColors = {
  Wisdom:      { cyan: "#00f5d4", pink: "#00c9b1" },
  Resilience:  { cyan: "#ff6b6b", pink: "#ee5a24" },
  Mindset:     { cyan: "#a29bfe", pink: "#6c5ce7" },
  Dreams:      { cyan: "#fd79a8", pink: "#e84393" },
  Courage:     { cyan: "#ffc107", pink: "#e67e22" },
  Action:      { cyan: "#00cec9", pink: "#0984e3" },
  Life:        { cyan: "#55efc4", pink: "#00b894" },
  Purpose:     { cyan: "#fdcb6e", pink: "#e17055" },
  Work:        { cyan: "#74b9ff", pink: "#0984e3" },
  Persistence: { cyan: "#00f5d4", pink: "#00b894" },
  Humor:       { cyan: "#ffeaa7", pink: "#fdcb6e" },
  Kindness:    { cyan: "#fd79a8", pink: "#e84393" },
  Adventure:   { cyan: "#55efc4", pink: "#00cec9" },
  Positivity:  { cyan: "#ffeaa7", pink: "#f9ca24" },
  Success:     { cyan: "#6ee7f7", pink: "#0891b2" },
  Leadership:  { cyan: "#818cf8", pink: "#4f46e5" },
  Motivation:  { cyan: "#fb923c", pink: "#ea580c" },
  Growth:      { cyan: "#4ade80", pink: "#16a34a" },
  Future:      { cyan: "#38bdf8", pink: "#0284c7" },
  Confidence:  { cyan: "#f472b6", pink: "#db2777" },
};

const taglines = [
  "today's spark ✦",
  "fresh wisdom ✦",
  "stay inspired ✦",
  "new perspective ✦",
  "food for thought ✦",
  "keep going ✦",
];

let currentIndex = -1;

const card          = document.getElementById("card");
const quoteText     = document.getElementById("quoteText");
const authorName    = document.getElementById("authorName");
const authorMeta    = document.getElementById("authorMeta");
const authorAvatar  = document.getElementById("authorAvatar");
const categoryBadge = document.getElementById("categoryBadge");
const bgNumber      = document.getElementById("bgNumber");
const counterPill   = document.getElementById("counterPill");
const taglineEl     = document.getElementById("tagline");
const newQuoteBtn   = document.getElementById("newQuoteBtn");

function getRandomIndex() {
  let idx;
  do { idx = Math.floor(Math.random() * quotes.length); } while (idx === currentIndex);
  return idx;
}

function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function padNumber(n) {
  return String(n).padStart(2, "0");
}

function applyTheme(category) {
  const colors = categoryColors[category] || categoryColors["Wisdom"];
  document.documentElement.style.setProperty("--neon-cyan", colors.cyan);
  document.documentElement.style.setProperty("--neon-pink", colors.pink);
}

function showQuote(animate = true) {
  const idx = getRandomIndex();
  currentIndex = idx;
  const q = quotes[idx];

  const render = () => {
    quoteText.textContent = q.text;
    authorName.textContent = q.author;
    authorMeta.textContent = q.meta;
    authorAvatar.textContent = getInitials(q.author);
    categoryBadge.textContent = q.category;
    bgNumber.textContent = padNumber(idx + 1);
    counterPill.textContent = `${idx + 1} / ${quotes.length}`;
    taglineEl.textContent = taglines[Math.floor(Math.random() * taglines.length)];
    applyTheme(q.category);
  };

  if (animate) {
    card.classList.add("fade-out");
    setTimeout(() => { render(); card.classList.remove("fade-out"); }, 320);
  } else {
    render();
  }
}

newQuoteBtn.addEventListener("click", () => showQuote(true));

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowRight") {
    e.preventDefault();
    showQuote(true);
  }
});

showQuote(false);