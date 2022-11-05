const btn = document.getElementById("search_btn");
let remove_list= [];
btn.addEventListener("click", function (event) {
    event.preventDefault();
    for(let i of remove_list){
        i.remove();
    }
    var keyword = document.getElementById("movies");
    if(keyword.value == "None"){
        return;
    }
    let response = axios.get("https://api.themoviedb.org/3/search/movie", {
        params: {
            api_key: "23b3a0cee96fcac58b28918686474f75",
            include_adult: "true",
            query: keyword.value,
        }
    });

    response = response.then((moviesData) => {
    for (let movie of moviesData.data.results) {   
            axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
            params: {
                api_key: "23b3a0cee96fcac58b28918686474f75",
                append_to_response: "videos",
            }
        }).then((movieData) => {
            const p = document.createElement('p');
            let iframe = document.createElement('iframe');
            const img = document.createElement('img');
            console.log(movie);
            const trailers = movieData.data.videos.results.filter((trailer) => trailer.type === "Trailer");
            let includedTrailer=true;
            try{
                iframe.src = `https://www.youtube.com/embed/${trailers.at(0).key}`
                img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
          
            }catch(err){
                iframe = document.createElement('img');
                iframe.classList.add("una");
                iframe.src = "img/youtube-error.webp";
                includedTrailer=false;
            }finally{
                img.classList.add("image");
                p.classList.add("intro");
                p.innerHTML = `<br> ID: ${movie.id}
                <br> Title - ${movie.title}
                <br> Original Title - ${movie.original_title}
                <br> Release Date: ${movie.release_date}  
                <br> Popularity: ${movie.popularity}
                <br> Original Language: ${movie.original_language}
                <br> Vote Count: ${movie.vote_count}
                <br> Vote Average: ${movie.vote_average}
                <br> Included Trailer: ${includedTrailer}
                <br> Adult: ${movie.adult} </br>
                <br> Overview: ${movie.overview}`;
                remove_list.push(p,iframe,img);
                document.body.append(p,img,iframe);
            }
            });
        }
    });
});
