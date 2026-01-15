const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: 'd6113b9aa3f89f46512368fe8d5837ac',
    apiURL: 'https://api.themoviedb.org/3/',
  },
  popularMovies: {
    page: 1,
    totalPages: 1,
  },
};

//functions to show hide spinner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}
// function isOnline() {
//   if (!navigator.onLine) {
//     alert.classList.add('alert alert-error');
//     alert.innerHTML = `<p>You are offline. Please check your internet connection.</p>`;
//     return;
//   }
// }

// Fetch function with error handling
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;
  // First check: is user offline?

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

async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiURL;
  // First check: is user offline?
  try {
    showSpinner();
    const response = await fetch(
      `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
    );
    if (!response.ok) {
      hideSpinner();
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    hideSpinner();
    const data = await response.json();
    return data;
  } catch (error) {
    return null; // so the calling function knows something went wrong
  }
}

//some utils functions

function getStarRating(vote) {
  const rounded = parseFloat(vote.toFixed(1));
  const fullStars = Math.floor(rounded / 2);
  const halfStar = rounded / 2 - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return '★'.repeat(fullStars) + '☆'.repeat(halfStar + emptyStars);
}
function convertMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}
function addCommas(number) {
  return number.toLocaleString();
}

function dispalyBackdrop(type, backgorundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('overlay');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgorundPath})`;
  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

function showAlert(msg, className = '') {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(msg));
  document.querySelector('#alert').appendChild(alertEl);
  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

//display slider
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
      </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div);
  });

  // init ONLY once
  initSwiper();
}

let swiperInitialized = false;

function initSwiper() {
  if (swiperInitialized) return;
  swiperInitialized = true;
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Display Popular Movies
async function displayPopularMovies() {
  showSpinner();
  const data = await fetchAPIData('movie/popular');
  if (!data || !data.results) {
    const container = document.querySelector('#popular-movies');
    if (container) {
      container.innerHTML = `<p class="text-danger">Failed to load movies. Please try again later.</p>`;
    }
    hideSpinner();
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
  showSpinner();
  const data = await fetchAPIData('tv/popular');
  if (!data || !data.results) {
    const container = document.querySelector('#popular-shows');
    if (container) {
      container.innerHTML = `<p class="text-danger">Failed to load Shows. Please try again later.</p>`;
    }
    hideSpinner();
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

//display Movie Details:
async function displayMovieDetails() {
  try {
    const movieID = new URLSearchParams(window.location.search).get('id');
    // safety check
    if (!movieID) {
      throw new Error('Movie ID not found');
    }
    showSpinner();
    const movie = await fetchAPIData(`movie/${movieID}`);
    hideSpinner();

    const companies = movie.production_companies.map((c) => c.name);
    const movieGen = movie.genres.map((g) => g.name);

    //overlay for background image
    dispalyBackdrop('movie', movie.backdrop_path);

    const div = document.createElement('div');

    div.innerHTML = `
      <div class="details-top">
        <div>
          ${
            movie.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`
              : `<img src="images/no-image.jpg" alt="${movie.title}" />`
          }
        </div>
        <div>
          <h2>${movie.title}</h2>
          <p><i class="fas fa-star text-primary"></i> ${movie.vote_average.toFixed(1)}</p>
          <p class="text-muted">Release Date: ${movie.release_date}</p>
          <p>${movie.overview}</p>

          <h5>Genres</h5>
          <ul class="list-group">
            ${movieGen.map((g) => `<li>${g}</li>`).join('')}
          </ul>

          <a href="${movie.homepage}" target="_blank" class="btn">Movie Homepage</a>
        </div>
      </div>

      <div class="details-bottom">
        <h2>Movie Info</h2>
        <ul>
          <li><span class="text-secondary">Budget:</span> ${movie.budget ? addCommas(movie.budget) : 'N/A'}</li>
          <li><span class="text-secondary">Revenue:</span> ${movie.revenue ? addCommas(movie.revenue) : 'N/A'}</li>
          <li><span class="text-secondary">Runtime:</span> ${convertMinutes(movie.runtime)}</li>
          <li><span class="text-secondary">Status:</span> ${movie.status}</li>
        </ul>

        <h4>Production Companies</h4>
        <div class="list-group">
          ${companies.map((c) => `<span>${c}</span>`).join('')}
        </div>
      </div>
    `;

    document.querySelector('#movie-details').appendChild(div);
  } catch (error) {
    // User-friendly UI error
    document.querySelector('#movie-details').innerHTML = `
      <div class="text-danger">
        Unable to load movie details. Please try again later.
      </div>
    `;
  }
}

async function displayShowDetails() {
  try {
    const showID = new URLSearchParams(window.location.search).get('id');
    // safety check
    if (!showID) {
      throw new Error('show ID not found');
    }
    showSpinner();
    const show = await fetchAPIData(`tv/${showID}`);
    console.log(show);
    hideSpinner();

    const companies = show.production_companies.map((c) => c.name);
    const showGen = show.genres.map((g) => g.name);
    let last_date = show.last_air_date;
    last_date = new Date(last_date).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    console.log(last_date);

    //overlay for background image
    dispalyBackdrop('tv', show.backdrop_path);

    const div = document.createElement('div');

    div.innerHTML = `
      <div class="details-top">
        <div>
          ${
            show.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}" />`
              : `<img src="images/no-image.jpg" alt="${show.name}" />`
          }
        </div>
        <div>
          <h2>${show.name}</h2>
          <p><i class="fas fa-star text-primary"></i> ${show.vote_average.toFixed(1)}</p>
          <p class="text-muted">Release Date: ${show.first_air_date}</p>
          <p class="text-muted"></p>
          <p>${show.overview}</p>

          <h5>Genres</h5>
          <ul class="list-group">
            ${showGen.map((g) => `<li>${g}</li>`).join('')}
          </ul>

          <a href="${show.homepage}" target="_blank" class="btn">show Homepage</a>
        </div>
      </div>

      <div class="details-bottom">
        <h2>show Info</h2>
        <ul>
          <li><span class="text-secondary">Number Of Episodes: </span> ${
            show.number_of_episodes ? show.number_of_episodes : 'N/A'
          }</li>
          <li><span class="text-secondary">Seasons : </span> ${
            show.number_of_seasons ? show.number_of_seasons : 'N/A'
          }</li>
          <li><span class="text-secondary">Last Episode Aired :</span>  ${last_date}</li>
          <li><span class="text-secondary">Last Epsiode to Air:</span> ${show.last_episode_to_air?.name || 'N/A'}</li>
        </ul>

        <h4>Production Companies</h4>
        <div class="list-group">
          ${companies.map((c) => `<span>${c}</span>`).join('')}
        </div>
      </div>
    `;

    document.querySelector('#show-details').appendChild(div);
  } catch (error) {
    // User-friendly UI error
    document.querySelector('#show-details').innerHTML = `
      <div class="text-danger">
        Unable to load movie details. Please try again later.
      </div>
    `;
  }
}

//search movies/shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type'); // 'movie' ya 'tv'
  global.search.term = urlParams.get('search-term');

  if (!global.search.term) {
    showAlert('Please Enter a Search term', 'error');
    return;
  }

  try {
    let { results, total_pages, page, total_results } = await searchAPIData();

    if (!results || results.length === 0) {
      showAlert('No results found', 'error');
      return;
    }

    // Decide which date field to use
    const dateField = global.search.type === 'movie' ? 'release_date' : 'first_air_date';

    // Sort results: newest first
    results = results.sort((a, b) => {
      const dateA = a[dateField] ? new Date(a[dateField]) : 0;
      const dateB = b[dateField] ? new Date(b[dateField]) : 0;
      return dateB - dateA;
    });

    // Update global state
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    // Display results
    displaySearchResults(results);
    document.querySelector('#search-term').value = '';
  } catch (error) {
    console.error(error);
    showAlert('Something went wrong while fetching search results', 'error');
  }
}

function displaySearchResults(results) {
  //claer previous rsluts
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
        ${
          result.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500/${result.poster_path}" class="card-img-top" alt="${
                global.search.type === 'movie' ? result.title : result.name
              }" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${
                global.search.type === 'movie' ? result.title : result.name
              }" />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${
            global.search.type === 'movie' ? result.release_date : result.first_air_date
          }</small>
        </p>
       <p class="card-text">
          <small class="text-muted">
            Vote: ${result.vote_average.toFixed(1)}<br/>
            ${getStarRating(result.vote_average)}
          </small>
        </p>
      </div>
    `;

    document.querySelector('#search-results').appendChild(div);
  });
  let headEl = document.querySelector('#search-results-heading');
  console.log(headEl);
  headEl.innerHTML = `
  <h2>
  ${results.length} of ${global.search.totalResults} Results for ${global.search.term}
  </h2>
  `;
  displayPagination();
}

//create and display paginations
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = ` <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

  document.querySelector('#pagination').appendChild(div);

  //disable prv btn
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }
  //disable next btn
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  //next page API request
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });
  //prev page API request
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });
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
      displaySlider();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
    case '/search.html':
      search();
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
