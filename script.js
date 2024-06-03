const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const movieListsContainer = document.getElementById('movie-lists');

let movieLists = {};


async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(URL);
    const data = await res.json();
    if (data.Response === "True") displayMovieList(data.Search);
}


function findMovies() {
    let searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}


function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');

        const moviePoster = movies[idx].Poster!== "N/A"? movies[idx].Poster : "image_not_found.png";

        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="search-item-info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
                <button onclick="addToMovieList('${movies[idx].Title}', '${movies[idx].imdbID}')">Add to List</button>
            </div>
        `;
        searchList.appendChild(movieListItem);
    }
}


function addToMovieList(title, imdbID) {
    const listName = prompt("Enter list name:");
    const isPublic = confirm("Make this list public?");
    if (listName &&!movieLists[listName]) {
        movieLists[listName] = { privacy: isPublic? 'public' : 'private', movies: [{ title, imdbID }] };
        displayMovieLists();
    } else if (listName && movieLists[listName]) {
        movieLists[listName].movies.push({ title, imdbID });
        displayMovieLists();
    }
}


function displayMovieLists() {
    movieListsContainer.innerHTML = '';

    for (let listName in movieLists) {
        const list = movieLists[listName];
        const listDiv = document.createElement('div');
        listDiv.className = 'movie-list';

        const listTitle = document.createElement('h4');
        listTitle.innerText = listName;
        listDiv.appendChild(listTitle);

        const privacyBadge = document.createElement('span');
        if (list.privacy === 'public') {
            privacyBadge.className = 'public-badge';
            privacyBadge.innerText = 'Public';
        } else {
            privacyBadge.className = 'private-badge';
            privacyBadge.innerText = 'Private';
        }
        listTitle.appendChild(privacyBadge);

        list.movies.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie-item';
            movieDiv.innerText = movie.title;
            listDiv.appendChild(movieDiv);
        });

        movieListsContainer.appendChild(listDiv);
    }
}


function logout() {
    alert('Logged out successfully!');
    window.location.href = 'file:///C:/Users/91786/Downloads/search%20movie/movie-search/index.html'; // Replace 'sign_in.html' with your sign-in page URL
}

window.addEventListener('click', (event) => {
    if (event.target.className!== "form-control") {
        searchList.classList.add('hide-search-list');
    }
});

displayMovieLists();
