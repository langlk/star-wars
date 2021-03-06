(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StarWarsSearch = exports.StarWarsSearch = function () {
  function StarWarsSearch() {
    _classCallCheck(this, StarWarsSearch);
  }

  _createClass(StarWarsSearch, [{
    key: "search",
    value: function search(searchTerm, category) {
      return $.get("https://swapi.co/api/" + category + "/?search=" + searchTerm);
    }
  }, {
    key: "find",
    value: function find(url) {
      return $.get(url);
    }
  }]);

  return StarWarsSearch;
}();

},{}],2:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _starWars = require("./../js/star-wars.js");

var starWars = new _starWars.StarWarsSearch();

var titleCase = function titleCase(string) {
  var stringArray = string.split("_");
  stringArray = stringArray.map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return stringArray.join(" ");
};

var displayCrawl = function displayCrawl(crawl) {
  var crawlLines = crawl.split('\r\n');
  crawlLines.forEach(function (line) {
    $(".opening_crawl").append("<span class=\"crawl\">" + line + "</span>");
  });
};

var displayURL = function displayURL(key, url, style) {
  var infoPromise = starWars.find(url);
  infoPromise.then(function (response) {
    var displayVal = "";
    if (response.hasOwnProperty("name")) {
      displayVal = response.name;
    } else {
      displayVal = response.title;
    }
    $("." + key).append("<span class=\"" + style + "\">" + displayVal + "</span>");
  }).fail(function (error) {
    console.log(error);
  });
};

var displayProperty = function displayProperty(key, value) {
  if (key === "name" || key === "title") {
    $(".results").prepend("<h2>" + value + "</h2>");
  } else {
    $('.results').append("<div class=" + key + "><strong>" + titleCase(key) + ":</strong> </div>");
    if (key === 'opening_crawl') {
      displayCrawl(value);
    } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {
      if (value.length === 1) {
        displayURL(key, value, "oneline");
      } else {
        value.forEach(function (url) {
          displayURL(key, url, "multiline");
        });
      }
    } else {
      if (typeof value === "string" && value.startsWith('https')) {
        displayURL(key, value, "oneline");
      } else {
        $("." + key).append("<span class=\"oneline\">" + value + "</span>");
      }
    }
  }
};

var displayData = function displayData(response) {
  var result = response.results[0];
  Object.keys(result).forEach(function (key) {
    console.log(result[key]);
    displayProperty(key, result[key]);
  });
};

$(document).ready(function () {

  $('#search').submit(function (event) {
    event.preventDefault();
    $('.results').html("");
    var searchTerm = $('#search-term').val();
    var category = $('#category').val();
    var responsePromise = starWars.search(searchTerm, category);
    responsePromise.then(function (response) {
      displayData(response);
    }).fail(function (error) {
      $('.results').append("<h3>There was an error: " + error.responseText + " </h3>");
    });
  });
});

},{"./../js/star-wars.js":1}]},{},[2]);
