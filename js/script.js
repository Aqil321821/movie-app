//------------A---------------//
//A1. to get location of the current page

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
    apiUrl: 'https://api.themoviedb.org/3/',
  },
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
      console.log('Home Page');
      getPopularMovies();
      displaySlider();
      break;

    case '/shows.html':
      console.log('shows');
      getPopularShows();
      break;

    case '/movie-details.html':
      displayMovieDetails();
      console.log('movie details');
      break;

    case '/tv-details.html':
      console.log('tv details');
      displayShowDetails();
      break;

    case '/search.html':
      console.log('Search');
      search();
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
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

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

  results.forEach((movie) => {
    // console.log(movie);

    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          
          <a href="movie-details.html?id=${movie.id}">
            ${movie.poster_path
        ? ` <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
              />`
        : ` <img
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
            <small class="text-muted">Ratings :${movie.vote_average.toFixed(
        1
      )} </small>
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

  results.forEach((show) => {
    console.log(show);

    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          
          <a href="tv-details.html?id=${show.id}">
            ${show.poster_path
        ? ` <img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
              />`
        : ` <img
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
            <small class="text-muted">Ratings :${show.vote_average.toFixed(
        2
      )} </small>
            </p>
          </div>
     
          
          `;

    document.querySelector('#popular-shows').appendChild(div);
  });
}
//now call this function under shows.html case

//-------------------D-------------//
//movie details
/* 
when we click on a movie and goto its details page then in URL we've its Id ....
we need to get that id
//to get the id of movies from url : we have a location object on window object that has a search property so we can get
//all the query strings which is anything after "?"

so new create a function to get details

*/

// display slider Movies
async function displaySlider() {
  /* const data= await fetchAPIData('movie/now_playing');
  this we got an object which has a results property 
  so we can destructure it
  const { results} = await fetchAPIData('movie/now_playing') 
   */

  const { results } = await fetchAPIData('movie/now_playing');

  console.log(results);

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
              <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path
      }" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
        1
      )} / 10
            </h4>     
            

            
            `;

    document.querySelector('.swiper-wrapper').appendChild(div);

    //now swiper details with some options

    initSwiper();
  });

  // run this function only on the index page
}

//this function will set options for the swiper how to behave

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: true,
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
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

async function displayMovieDetails() {
  //get the id of movies from url
  const movieId = window.location.search.split('=')[1];

  //movieId=?id=43566
  //so now split this string on basis of =
  // so now we get id
  // we will call this function under movie.details case
  //now make a fetch request to endpoint to get details using that id

  const movie = await fetchAPIData(`movie/${movieId}`);

  //now create div to hold details
  console.log(movie);

  //call the function to show overlay

  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
    <div class="details-top">
    <div>
    ${movie.poster_path
      ? ` <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
      : ` <img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
    }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
    

           ${movie.overview
      ? ` <p> ${movie.overview} </p>`
      : `<p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Fugiat tempora ducimus ipsum quos distinctio dolore
            iure vel impedit aperiam quod quam inventore obcaecati, enim 
            ea nisi ut sapiente. Consequuntur, consectetur.
            </p>`
    }

     
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      </br>
      <h5>Language   :  ${movie.spoken_languages[0].english_name}</h5>
      <a href="${movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${movie.budget}</li>
      <li><span class="text-secondary">Revenue:</span> $${movie.revenue}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime
    } minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Company</h4>
    <div class="list-group">${movie.production_companies.map(
      (company) => `<span>${company.name}</span>`
    )}</div>
  </div>
    `;

  document.querySelector('#movie-details').appendChild(div);
}

//-----------------------E 142-----------//

//make a function which put background images on details page
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');

  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

//---------------------F-143---------------//

// display shows details

async function displayShowDetails() {
  //get the id of movies from url
  const showId = window.location.search.split('=')[1];

  //showId=?id=43566
  //so now split this string on basis of =
  // so now we get id
  // we will call this function under movie.details case
  //now make a fetch request to endpoint to get details using that id

  const show = await fetchAPIData(`tv/${showId}`);

  //now create div to hold details
  console.log(show);

  //call the function to show overlay

  displayBackgroundImage('tv', show.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
 <div class="details-top">
 <div>
 ${show.poster_path
      ? ` <img
           src="https://image.tmdb.org/t/p/w500${show.poster_path}"
           class="card-img-top"
           alt="${show.name}"
         />`
      : ` <img
         src="images/no-image.jpg"
         class="card-img-top"
         alt="${show.name}"
       />`
    }
 </div>
 <div>
   <h2>${show.name}</h2>
   <p>
     <i class="fas fa-star text-primary"></i>
     ${show.vote_average.toFixed(1)} / 10
   </p>
   <p class="text-muted">Release Date: ${show.last_air_date}</p>
 

        ${show.overview
      ? ` <p> ${show.overview} </p>`
      : `<p>
         Lorem ipsum dolor sit amet consectetur adipisicing elit.
         Fugiat tempora ducimus ipsum quos distinctio dolore
         iure vel impedit aperiam quod quam inventore obcaecati, enim 
         ea nisi ut sapiente. Consequuntur, consectetur.
         </p>`
    }

  
   <h5>Genres</h5>
   <ul class="list-group">
     ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
   </ul>
   </br>
   <h5>Language   :  ${show.spoken_languages[0].english_name}</h5>
   <a href="${show.homepage
    }" target="_blank" class="btn">Visit show Homepage</a>
 </div>
</div>
<div class="details-bottom">
 <h2>show Info</h2>
 <ul>
   <li><span class="text-secondary">Seasons :</span> ${show.number_of_seasons
    }</li>
   <li><span class="text-secondary">No Of Episode:</span> ${show.number_of_episodes
    }</li>
   <li><span class="text-secondary">Last Episode Aired On:</span> ${show.last_air_date
    } </li>
   <li><span class="text-secondary">Status:</span> ${show.status}</li>
 </ul>
 <h4>Production Company</h4>
 <div class="list-group">${show.production_companies.map(
      (company) => `<span>${company.name}</span>`
    )}</div>
</div>
 `;

  document.querySelector('#show-details').appendChild(div);
}

//-------------------G-145---------------//

//search movies and shows
async function search() {
  //1.get the things from url

  //first we need the query string (things after ? in url)

  const queryString = window.location.search;
  //  console.log(search);

  /*  to separte these out and to get each one query we can use 
  an object called URL SEARCH PARAM

  */

  const urlParams = new URLSearchParams(queryString);

  // console.log(urlParams);

  //in that object we have there are some methods in prototype of that object
  // there is a method on that object called get() which takes a parameter which is the thing we want the value of

  // console.log(urlParams.get('type'));  // movie,tv

  // we need those query parameters in other places too so we put those in global object

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.type !== null) {
    //2.make request and display result
    //3.make destructure use and get the things from "await searchAPIData()" that object
    //dont need to pass anything bcz endpoint will be constructed from within the function
    //for the request we need api-key and api-url which are in the function fetchAPIData()
    // so we move these two things in our global object
    const { results, total_pages, page, total_results } = await searchAPIData();

    //9.put page on global finction from results

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;


    // console.log(results);

    //6. check if no result found
    // if found then run a function which display it on dom
    if (results.length === 0) {
      showAlert('Nothing Found ', 'error');
      return;
    }

    dispalySearchResults(results);

    //now make input field empty

    // document.querySelector('#search-item').value = '';
  } else {
    //make custom alert and show
    showAlert('Please Enter Some Words To Search', 'error');
  }
}



//4.show error custom alert
function showAlert(className, message) {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));

  //now append this into alert div which is on index.html

  document.querySelector('#alert').appendChild(alertEl);

  //remove from the dom after 3 seconds

  setTimeout(() => alertEl.remove(), 3000);
}

//5 make request to search

async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );

  const data = response.json();
  hideSpinner();
  return data;
}


//7.create function to dispaly results on DOM

function dispalySearchResults(results) {

  //clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  const heading = document.querySelector('#search-results-heading');
  heading.innerHTML = `
        <h2>${results.length} of  ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;

  results.forEach((result) => {

    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
            
            <a href="${global.search.type}-details.html?id=${result.id}">
              ${result.poster_path
        ? ` <img
                  src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
                  class="card-img-top"
                  alt="${global.search.type === 'movie' ? result.title : result.name}"
                />`
        : ` <img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${global.search.type === 'movie' ? result.title : result.name}"
              />`
      }
            </a>
            <div class="card-body">
              <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
              <p class="card-text">
                <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
              </p>
              
              <p>
              <small class="text-muted">Ratings :${result.vote_average.toFixed(
        1
      )} </small>
              </p>
            </div>
       
            
            `;

    document.querySelector('#search-results').appendChild(div);
  });

  //dispaly pagination

  displayPagination();


}


//create pagination display function in search page


function displayPagination() {

  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `

    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    
    `;
  document.querySelector('#pagination').appendChild(div);


  //disabled prev button if on 1 page

  if (global.search.page === 1) {

    document.querySelector('#prev').disabled = true;

  }

  //disabled next button if on last page

  if (global.search.page === global.search.totalPages) {

    document.querySelector('#next').disabled = true;



  }

  //we need to add an event listener so that we actually change the page
  //for make another request to the api with particular page that we wana get
   //next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, totalPages } = await searchAPIData();
    dispalySearchResults(results);
  });

//prev page
document.querySelector('#prev').addEventListener('click', async () => {
  global.search.page--;
  const { results, totalPages } = await searchAPIData();
  dispalySearchResults(results);
});



}

