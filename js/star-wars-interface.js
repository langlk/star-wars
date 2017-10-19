import { StarWarsSearch } from './../js/star-wars.js';
const starWars = new StarWarsSearch();

let titleCase = function(string){
  let stringArray = string.split("_");
  stringArray = stringArray.map(function(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return stringArray.join(" ");
}

let displayURL = function(key, url, style) {
  let infoPromise = starWars.find(url);
  infoPromise.then(function(response) {
    let displayVal = ""
    if (response.hasOwnProperty("name")) {
      displayVal = response.name;
    } else {
      displayVal = response.title;
    }
    $(`.${key}`).append(`<span class="${style}">${displayVal}</span>`);
  })
  .fail(function(error) {
    console.log(error);
  });
}

let displayProperty = function(key, value) {
  if (key === "name" || key === "title") {
    $(".results").prepend(`<h2>${value}</h2>`);
  } else  {
    $('.results').append(`<div class=${key}><strong>${titleCase(key)}:</strong> </div>`);
    if (typeof(value) === 'object') {
      if (value.length === 1) {
        displayURL(key, value, "oneline");
      } else {
        value.forEach(function(url) {
          displayURL(key, url, "multiline");
        });
      }
    } else {
      if (typeof(value) === "string" && value.startsWith('https')) {
        displayURL(key, value, "oneline");
      } else {
        $(`.${key}`).append(`<span class="oneline">${value}</span>`);
      }
    }
  }
}

let displayData = function(response) {
  let result = response.results[0];
  Object.keys(result).forEach(function(key){
    console.log(result[key]);
    displayProperty(key, result[key]);
  });
}

$(document).ready(function() {

  $('#search').submit(function(event) {
    event.preventDefault();
    $('.results').html("");
    let searchTerm = $('#search-term').val();
    let category = $('#category').val();
    let responsePromise = starWars.search(searchTerm, category);
    responsePromise.then(function(response) {
      displayData(response);
    })
    .fail(function(error) {
      $('.results').append(`<h3>There was an error: ${error.responseText} </h3>`);
    });
  });
});
