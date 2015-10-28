import * as Scraping from './scraping';
import {timeout, pfUrl, loadListings, saveListings} from './util';
import _ from 'lodash';

const keyPrefix = 'rp.listing.';
const listingPageUrl = 'https://www.rocketpunch.com/jobs?page=';

var listings = new Map();

loadListings('listings.json').then((map) => {
  listings = map;
});

async function processListingUrl(url) {
  if(!listings.has(url)) {
    console.log('Saving listing for', pfUrl(url));
    let listing = await Scraping.getListingContent(url);
    listings.set(url, listing);
    console.log('Processing done for', pfUrl(url));
    return listing;
  } else {
    console.log('Listing is already saved', pfUrl(url));
  }
}

async function processListingPage(listingPageUrl) {
  console.log('Scraping listing page', listingPageUrl);
  let listingUrls = await Scraping.getListingUrls(listingPageUrl);
  let newListings = [];
  for(let listingUrl of listingUrls) {
    let listing = await processListingUrl(listingUrl);
    newListings.push(listing);
    await timeout(2000 + Math.random() * 1000);
  }
  return newListings;
}

async function crawlListingPageRange(start, end) {
  let pageNumbers = _.range(start, end);
  for(let pageNumber of pageNumbers) {
    console.log(`Starting to scrape page ${pageNumber}`);
    let newListings = await processListingPage(listingPageUrl + pageNumber);
    console.log(`Saved ${newListings.length} new listings scraping page ${pageNumber}`);
  }
}

crawlListingPageRange(1, 10).then(() => {
  console.log('Done!');
  let listingArray = [...listings];
  console.log(listingArray);
  return saveListings('listings.json', listingArray);
}).catch((err) => {
  console.error('Error:', err);
});
