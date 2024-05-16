
//------------A---------------//
//A1. to get location of the current page

const global = {
    currentPage: window.location.pathname,
};
console.log(global.currentPage);


//A4. Highlight active link
function highlightActiveLink() {

    //grab all the nav links (here are 2 ) 

    const link = document.querySelectorAll('.nav-link');
    link.forEach((link) => {
        //check if the link is equal to page's current url 
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');

        }
    });


}


//A2. Initialise our app in that function we will check which page run


function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            console.log("Home Page");
            getPopularMovies();
            break;

        case '/shows.html':
            console.log('shows');
             getPopularShows();
            break;

        case '/movie-details.html':
            console.log('movie details');
            break;

        case '/tv-details.html':
            console.log('tv details');
            break;

        case '/search.html':
            console.log('Search');
            break;
    }

    highlightActiveLink();

}







//A3. init app on dom-loads
document.addEventListener('DOMContentLoaded', init);



//---------------------------B------------------------------//

//B1 this function will fetch data from TMDB API
// we will give an endpoint as param 

async function fetchAPIData(endpoint) {
    const API_KEY = 'd6113b9aa3f89f46512368fe8d5837ac';
    const API_URL = 'https://api.themoviedb.org/3/';
    
    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = response.json();
    hideSpinner();
    return data;

}


//B2 make a request to get popular movies data and call it on index.html
//get 20 most popular from server

async function getPopularMovies() {
    //destructure here 
    // await fetchAPIData('movie/popular')= object which has results array as property
    const { results } = await fetchAPIData('movie/popular');
    // console.log(results);

    results.forEach(movie => {
        console.log(movie);

        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          
          <a href="movie-details.html?${movie.id}">
            ${movie.poster_path ?
                ` <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
              />`: ` <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
            
            <p>
            <small class="text-muted">Ratings :${(movie.vote_average).toFixed(2)} </small>
            </p>
          </div>
     
          
          `;

        document.querySelector('#popular-movies').appendChild(div);

    });
}

//----------------------C------------------//

//C1.add and remove spinner

function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}

//now show spiner before making a fetch request
//hide spinner after getting response 


//C2.make a fetch request to get popular tv shows

async function getPopularShows() {
    //destructure here 
    // await fetchAPIData('movie/popular')= object which has results array as property
    const { results } = await fetchAPIData('tv/popular');
    // console.log(results);

    results.forEach(show => {
        console.log(show);

        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
          
          <a href="tv-details.html?${show.id}">
            ${show.poster_path ?
                ` <img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
              />`: ` <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${show.first_air_date}</small>
            </p>
            
            <p>
            <small class="text-muted">Ratings :${(show.vote_average).toFixed(2)} </small>
            </p>
          </div>
     
          
          `;

        document.querySelector('#popular-shows').appendChild(div);

    });
}
//now call this function under shows.html case