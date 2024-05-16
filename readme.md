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


       