const global = {
  currentPage: window.location.pathname,
};

//functions to show hide spinner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Fetch function with error handling
async function fetchAPIData(endpoint) {
  const API_KEY = 'd6113b9aa3f89f46512368fe8d5837ac';
  const API_URL = 'https://api.themoviedb.org/3/';
  try {
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) {
      console.log(response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return null; // so the calling function knows something went wrong
  }
}

// Stars
function getStarRating(vote) {
  const rounded = parseFloat(vote.toFixed(1));
  const fullStars = Math.floor(rounded / 2);
  const halfStar = rounded / 2 - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return '★'.repeat(fullStars) + '☆'.repeat(halfStar + emptyStars);
}

// Display Popular Movies
async function displayPopularMovies() {
  // First check: is user offline?
  if (!navigator.onLine) {
    const container = document.querySelector('#popular-movies');
    if (container) {
      container.innerHTML = `<p class="text-danger">You are offline. Please check your internet connection.</p>`;
    }
    return;
  }
  showSpinner();
  const data = await fetchAPIData('movie/popular');
  if (!data || !data.results) {
    const container = document.querySelector('#popular-movies');
    if (container) {
      container.innerHTML = `<p class="text-danger">Failed to load movies. Please try again later.</p>`;
    }
    return;
  }

  data.results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${movie.release_date || 'N/A'}</small>
        </p>
        <p class="card-text">
          <small class="text-muted">
            Vote: ${movie.vote_average.toFixed(1)}<br/>
            ${getStarRating(movie.vote_average)}
          </small>
        </p>
      </div>
    `;
    document.querySelector('#popular-movies').appendChild(div);
  });
  hideSpinner();
}

//display popular shows
async function displayPopularShows() {
  // First check: is user offline?
  if (!navigator.onLine) {
    const container = document.querySelector('#popular-movies');
    if (container) {
      container.innerHTML = `<p class="text-danger">You are offline. Please check your internet connection.</p>`;
    }
    return;
  }
  showSpinner();
  const data = await fetchAPIData('tv/popular');
  if (!data || !data.results) {
    const container = document.querySelector('#popular-shows');
    if (container) {
      container.innerHTML = `<p class="text-danger">Failed to load Shows. Please try again later.</p>`;
    }
    return;
  }

  data.results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        ${
          show.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.name}" />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${show.first_air_date || 'N/A'}</small>
        </p>
        <p class="card-text">
          <small class="text-muted">
            Vote: ${show.vote_average.toFixed(1)}<br/>
            ${getStarRating(show.vote_average)}
          </small>
        </p>
      </div>
    `;
    document.querySelector('#popular-shows').appendChild(div);
  });
  hideSpinner();
}

// Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      console.log('Movie Details');
      break;
    case '/tv-details.html':
      console.log('TV Details');
      break;
    case '/search.html':
      console.log('Search');
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
