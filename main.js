const async = require('async');
const fetch = require('isomorphic-fetch');
const _ = require('lodash');

const baseArtists = [
  '2gsggkzM5R49q6jpPvazou',
  '6jJ0s89eD6GaHleKKya26X',
  '1HY2Jd0NmPuamShAr6KMms',
  '6tbjWDEIzxoDsBA1FuhfPW',
  '26AHtbjWKiwYzsoGoUZq53',
  '00IjdWQ46sSBP4gZYObAMx',
  '3hE8S8ohRErocpkY7uJW4a',
  '2NPduAUeLVsfIauhRwuft1',
  '7gTbq5nTZGQIUgjEGXQpOS',
  '1O8CSXsPwEqxcoBE360PPO',
  '5YeoQ1L71cXDMpSpqxOjfH',
];

const url = 'https://api.spotify.com/v1/artists/';
const urlRelated = '/related-artists';
const urlTop =  '/top-tracks?country=FR';
const random = (min, max) => { return Math.floor( min + (Math.random() * ((max - min) + 1))); };

const sortByPopularity = (elems) => _.orderBy(elems, elem => elem.popularity, ['desc']);
const topN = (artists, n) => _.slice(sortByPopularity(artists), 0, n);

const fetchRelated = id => cb => {
  fetch(url + id + urlRelated, 'GET')
    .then(res => res.json())
    .then(res => cb(null, topN(res.artists, 2)));
}

const fetchTracks = (artists, cb) => {
  async.map(artists, (artist) => { 
    fetch(url + artist.id + urlTop)
    .then(res => res.json())
    .then(res => cb(null, topN(res.tracks, 1)));
  })
}

const waterfallArtists = (id, cb) => { 
  async.waterfall([
    fetchRelated(id),
    fetchTracks,
  ], cb
  );
}

async.map(baseArtists, waterfallArtists, (err, res) => console.log(topN(res, 1)[0][0].name));
