"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(q) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  try {
    const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${q}`);
    return res.data;
  } catch (err) {
    alert("something went wrong");
    console.log(err.message)
  }
}


/** Given list of shows, create markup for each and to DOM */
function populateShows(shows) {
  const tempImg = 'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300'
  $showsList.empty();
  for (let { show } of shows) {
    const url = show.image ? show.image.original : tempImg
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src=${url} 
              alt="" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-info btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);
    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */
async function searchForShowAndDisplay() {
  try {
    const term = $("#search-query").val();
    const shows = await getShowsByTerm(term);
    $episodesArea.hide();
    populateShows(shows);
  } catch (err) {
    alert("something went wrong");
    console.log(err.message)
  }
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  try {
    await searchForShowAndDisplay();
  } catch (err) {
    alert("something went wrong");
    console.log(err.message)
  }
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
function hideOtherShows(id) {
  const showsOnthePage = $showsList.children().get();
  showsOnthePage.forEach(show => {
    if (show.dataset.showId !== id) {
      show.style.display = 'none';
    }
  })
}
async function getEpisodesOfShow(id) {
  try {
    const { data } = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    populateEpisodes(data);
    hideOtherShows(id)
  } catch (err) {
    alert("something went wrong");
    console.log(err.message)
  }
}


/** Write a clear docstring for this function... */
function populateEpisodes(episodes) {
  $episodesArea.show();
  for (let { id, name, season, number } of episodes) {
    const episode = $(`<li>
    season: ${season}
    episode: ${number}
    name: ${name}
    id: ${id}
    </li>`);
    $('#episodes-list').append(episode);
  }

}
function displayOtherShows() {
  const showsOnthePage = $showsList.children().get();
  showsOnthePage.forEach(show => { show.style.display = '' });
  $('.Show-getEpisodes').show();
}
$showsList.on('click', '.Show-getEpisodes', (e) => {
  $(e.target).hide()
  const { showId } = e.target.parentElement.parentElement.parentElement.dataset;
  getEpisodesOfShow(showId)
})
$('#hideEpisodesBTN').on('click', () => {
  $episodesArea.hide();
  $('#episodes-list').empty();
  displayOtherShows();
})