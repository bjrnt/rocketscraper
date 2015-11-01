import cheerio from 'cheerio';
import request from 'request-promise';
import {timeout, pfUrl} from './util';

const baseUrl = 'https://www.rocketpunch.com';

export async function getListingUrls(jobListingsPage) {
  let res = await request(jobListingsPage),
      $ = cheerio.load(res),
      postingLinks = $('div.card.job.list div.summary a');

  let urls = postingLinks.map((i, link) => {
    return baseUrl + $(link).attr('href');
  }).get();

  return urls;
}

export async function getListingContent(url) {
  let res = await request(url).catch((err) => {
    console.error('Request for url failed, trying again in two seconds', pfUrl(url));
    return timeout(2000).then(() => { return request(url); });
  });

  let $ = cheerio.load(res);

  let benefits = {};
  $('section#section_benefits div.panel-body dt').each((i, elem) => {
    let type = $(elem).text().trim();
    let benefit = $(elem).next().text().trim();
    benefits[type] = benefit;
  });

  let posting = {
    title: $('section.section.summary h2.title').text().trim(),
    company: $('section.section.summary p.company a').text().trim(),
    role: $('section.section.summary dl.dl-info.dl-role dd.dd.nowrap').first().text().trim(),
    experience: $('section.section.summary dl.dl-info.dl-role dd.dd.nowrap.text-comma').text().trim(),
    salary: $('section.section.summary dd.dd.nowrap.salary').text().trim(),
    location: $('section.section.summary dd.dd.nowrap.remote').text().trim(),
    duty: $('section#section_duty div.panel-body div').first().text().trim(),
    content: $('section#section_content div.panel-body').text().trim(),
    statement: $('section#section_statement div.panel-body').text().trim(),
    benefits: benefits,
    introduction: $('section#section_introduction div.panel-body').text().trim(),
    url: url,
    timestamp: new Date()
  };

  return posting;
}

export async function getListingContents(jobListingsPage) {
  let urls = await getListingUrls(jobListingsPage);
  urls = urls.slice(0,2); // Temporary
  let summaries = urls.map(function(url) {
    return getListingContent(url);
  });
  return await* summaries;
}

// getListingContent('https://www.rocketpunch.com/jobs/1748/%EA%B0%9C%EB%B0%9C%EC%9E%90')
// .then(function(summary) {
  // console.log(summary);
// });
