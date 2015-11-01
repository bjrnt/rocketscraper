import * as Scraping from './scraping';
import {timeout, pfUrl, loadListings, saveListings} from './util';
import _ from 'lodash';
import Storage from './storage';

const listingPageUrl = 'https://www.rocketpunch.com/jobs?page=';

async function processListingUrl(url) {
  let exists = await store.urlExists(url);
  if(!exists) {
    console.log('Saving listing for', pfUrl(url));
    let listing = await Scraping.getListingContent(url);
    await store.savePost(listing);
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

let store = new Storage('listings');
store.ready().then(() => {
  crawlListingPageRange(1, 10).then(() => {
    console.log('Done!');
  }).catch((err) => {
    console.error('Error:', err);
  });
});
