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
  '4Nrd0CtP8txoQhnnlRA6V6',
  '5MmVJVhhYKQ86izuGHzJYA',
  '4dpARuHxo51G3z768sgnrY',
  '0X2BH1fck6amBIoJhDVmmJ',
  '5WUlDfRSoLAfcVSX1WnrxN',
  '7dGJo4pcD2V6oG8kP0tJRR',
  '6DPYiyq5kWVQS4RGwxzPC7',
  '1ZwdS5xdxEREPySFridCfh',
  '7hJcb9fa4alzcOq3EaNPoG',
  '2Sqr0DXoaYABbjBo9HaMkM',
];

const url = 'https://api.spotify.com/v1/artists/';
const urlRelated = '/related-artists';
const urlTop =  '/top-tracks?country=FR';

const shuffleArtists = _.times(_.random(5, 10), () => baseArtists[_.random(0, baseArtists.length - 1)]);

const sortByPopularity = (elems) => _.orderBy(elems, 'popularity', ['desc']);
const topN = (elems, n) => _.slice(sortByPopularity(elems), 0, n);

const fetchRelated = id => cb => {
  fetch(url + id + urlRelated, 'GET')
    .then(res => res.json())
    .then(res => cb(null, topN(res.artists, 2)))
    .catch(err => cb(err));
}

const fetchTracks = (artists, cb) => {
  async.map(artists, (artist) => { 
    fetch(url + artist.id + urlTop, 'GET')
    .then(res => res.json())
    .then(res => cb(null, topN(res.tracks, 1)))
    .catch(err => cb(err));;
  })
}

const waterfallArtists = (id, cb) => { 
  async.waterfall([
    fetchRelated(id),
    fetchTracks,
  ], cb
  );
}

async.map(shuffleArtists, waterfallArtists, (err, res) => console.log(
  'Top popular track from random artists is : ' +
  topN(res, 1)[0][0].name +
  ' from ' +
  topN(res, 1)[0][0].artists[0].name
  )
);
