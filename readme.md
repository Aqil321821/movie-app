#Live Preview
https://movie-app-aqil.netlify.app/



# API Key 
d6113b9aa3f89f46512368fe8d5837ac

 # Steps In JavaScript Code

 # 1. Create router

      Make a simple router so we can run specific javascript specific functions on specific pages 
          for example when we are on movie.details page we get an id from url then we've to fetch the data of that particular movie, so we want to run that code on that specific page ..

          we will use 'window.location.pathname' to get the page where we are ..
          for example on index.html we will get "/"  so whatever we want to do on homepage we will check for '/'

          when we are on "TV Shows" we will get '/shows.html'

          whatever we wanna run for each page whatever function we will just put inside of that case



 # 2 get the popular movies on homepage
             
          make a fetch request to TMDB on the endpoint of popular movies and get display it on the DOM
             GET/movie/popular        
             End-Point is : https://developer.themoviedb.org/reference/movie-popular-list 

       lets create a function that we can use from within other functions to fetch data  rather than calling fetch from every function where we need it......


 # 141 
    ${movie.production_companies.map((company)=>`<span>${company.name}</span>`) }
      the object we recived in movie details has an array and that array has 2/3 objects 
      now we're telling that take each element of array and put inside of span its property which is name 

 # 142  making a backdrop on movie details page

   backdrop comes from api
   we will crate a function dispalyBackgroundImage() which will take two params
   one is type : movie/shows
   second is : movie.backdrop_path
     


# 144 swiper using swiper api
   
     using swiper library we make slides on index.html



 # 145 making search function
# A
 here if we look at our html structure form has an action attribute where the form is submiting 
   now if we search lets say '3-idiots'   movie the url will be as 
     http://127.0.0.1:5500/search.html?type=movie&search-term=3+idiots    
      
      the input value gets put against 'search-term' bcz that input field has a 'name=search-term'  so value we get is against of it.....

      same goes for the radio buttons each has a name='type'
      so in url type='{that checked value will go}'......

# B when we hit the search.html page we will run a function
   
