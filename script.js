// DOM Elements
const movieInput = document.getElementById('movieInput');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const clearBtn = document.getElementById('clearBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const processingSection = document.getElementById('processingSection');
const outputSection = document.getElementById('outputSection');
const resultsContainer = document.getElementById('resultsContainer');
const movieCount = document.getElementById('movieCount');
const topMovieBanner = document.getElementById('topMovieBanner');
const topMovieName = document.getElementById('topMovieName');
const topMovieRating = document.getElementById('topMovieRating');

// Sample data with English and Telugu movies
const sampleData = `Avatar,5
Titanic,4
Inception,5
Interstellar,5
Avengers,4
Joker,5
Gladiator,4
Matrix,5
Frozen,3
Coco,4
RRR,5
Baahubali,5
Baahubali2,5
Pushpa,4
Pushpa2,5
Arjun Reddy,5
Jersey,4
Eega,5
Magadheera,5
Srimanthudu,4
Athadu,5
Pokiri,5
Businessman,4
Gabbar Singh,4
Attarintiki Daredi,5
Janatha Garage,4
Ala Vaikunthapurramuloo,5
Sye,4
Leader,4
Fidaa,5
Geetha Govindam,4
Dear Comrade,4
Mahanati,5
Khaidi,4
Master,4
Avatar,3
RRR,4
Baahubali,4
Titanic,5
Inception,4
Interstellar,4
Avengers,5
Joker,4
Gladiator,5
Matrix,4
Frozen,4
Coco,5
Pushpa,5
Jersey,5
Eega,4
Magadheera,4
Srimanthudu,5
Athadu,4
Pokiri,4
Businessman,5
Gabbar Singh,5
Attarintiki Daredi,4
Janatha Garage,5
Ala Vaikunthapurramuloo,4
Sye,5
Leader,5
Fidaa,4
Geetha Govindam,5
Dear Comrade,5
Mahanati,4
Khaidi,5
Master,5`;

// Load sample data
function loadSampleData() {
    movieInput.value = sampleData;
    // Clear any previous results
    outputSection.style.display = 'none';
    resultsContainer.innerHTML = '';
}

// Clear input and output
function clearData() {
    movieInput.value = '';
    outputSection.style.display = 'none';
    resultsContainer.innerHTML = '';
    movieCount.textContent = '0';
    topMovieBanner.style.display = 'none';
}

// Simulate Hadoop MapReduce processing
function analyzeData() {
    const inputText = movieInput.value.trim();

    if (!inputText) {
        alert('Please enter some movie data or load sample data.');
        return;
    }

    // Show processing animation
    processingSection.style.display = 'block';
    outputSection.style.display = 'none';

    // Simulate processing delay
    setTimeout(() => {
        processMapReduce(inputText);
        processingSection.style.display = 'none';
    }, 2000);
}

// Map Phase: Split input data into key-value pairs
function mapPhase(inputText) {
    const lines = inputText.split('\n');
    const mappedData = [];

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        const parts = line.split(',');
        if (parts.length >= 2) {
            const movieName = parts[0].trim();
            const rating = parseFloat(parts[1].trim());

            if (movieName && !isNaN(rating)) {
                mappedData.push({ key: movieName, value: rating });
            }
        }
    }

    return mappedData;
}

// Shuffle Phase: Group by movie name
function shufflePhase(mappedData) {
    const groupedData = {};

    for (let item of mappedData) {
        if (!groupedData[item.key]) {
            groupedData[item.key] = [];
        }
        groupedData[item.key].push(item.value);
    }

    return groupedData;
}

// Reduce Phase: Calculate average for each movie
function reducePhase(groupedData) {
    const results = [];

    for (let movieName in groupedData) {
        const ratings = groupedData[movieName];
        const sum = ratings.reduce((a, b) => a + b, 0);
        const average = sum / ratings.length;

        results.push({
            name: movieName,
            rating: average,
            count: ratings.length
        });
    }

    // Sort by rating (highest first)
    results.sort((a, b) => b.rating - a.rating);

    return results;
}

// Main MapReduce processing function
function processMapReduce(inputText) {
    // Step 1: Map Phase
    const mappedData = mapPhase(inputText);

    // Step 2: Shuffle Phase
    const shuffledData = shufflePhase(mappedData);

    // Step 3: Reduce Phase
    const results = reducePhase(shuffledData);

    // Display results
    displayResults(results);
}

// Display results in cards
function displayResults(movies) {
    // Update movie count
    movieCount.textContent = movies.length;

    // Find top-rated movie
    let topMovie = null;
    let topRating = 0;

    movies.forEach(movie => {
        if (movie.rating > topRating) {
            topRating = movie.rating;
            topMovie = movie.name;
        }
    });

    // Update top movie banner
    if (topMovie) {
        topMovieName.textContent = topMovie;
        topMovieRating.textContent = topRating.toFixed(1);
        topMovieBanner.style.display = 'flex';
    }

    // Clear previous results
    resultsContainer.innerHTML = '';

    // Create movie cards
    movies.forEach((movie, index) => {
        const isTopRated = movie.name === topMovie;

        // Create stars based on rating
        const fullStars = Math.floor(movie.rating);
        const starsHTML = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

        // Create card element
        const card = document.createElement('div');
        card.className = `movie-card ${isTopRated ? 'top-rated' : ''}`;
        card.style.animationDelay = `${index * 0.1}s`;

        // Add crown icon for top rated movie
        const titleIcon = isTopRated ? '<i class="fas fa-crown"></i>' : '<i class="fas fa-film"></i>';

        card.innerHTML = `
            <h3>${titleIcon} ${movie.name}</h3>
            <div class="rating">${movie.rating.toFixed(1)}</div>
            <div class="stars">${starsHTML}</div>
            <div class="details">
                <span>${movie.count} rating${movie.count > 1 ? 's' : ''}</span>
                <span>${getRatingCategory(movie.rating)}</span>
            </div>
        `;

        resultsContainer.appendChild(card);
    });

    // Show output section
    outputSection.style.display = 'block';

    // Scroll to results
    outputSection.scrollIntoView({ behavior: 'smooth' });
}

// Helper function to categorize ratings
function getRatingCategory(rating) {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Average';
    return 'Below Average';
}

// Event Listeners
loadSampleBtn.addEventListener('click', loadSampleData);
clearBtn.addEventListener('click', clearData);
analyzeBtn.addEventListener('click', analyzeData);

// Initialize with sample data on page load
window.addEventListener('DOMContentLoaded', () => {
    loadSampleData();
}); 