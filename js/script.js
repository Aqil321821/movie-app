
//------------A---------------//
//A1. to get location of the current page

const global = {
    currentPage: window.location.pathname,
};
console.log(global.currentPage);


//A4. Highlight active link
function highlightActiveLink(){
       
    //grab all the nav links (here are 2 ) 

    const link= document.querySelectorAll('.nav-link');
    link.forEach((link)=>{
        //check if the link is equal to page's current url 
        if (link.getAttribute('href')=== global.currentPage) {
            link.classList.add('active');
            
        }
    })
     

}


//A2. Initialise our app in that function we will check which page run


function init() {
    switch (global.currentPage) {
        case '/':
            case '/index.html':
            console.log("object");
            break;

        case '/shows.html':
            console.log('shows');
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