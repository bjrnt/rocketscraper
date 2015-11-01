export function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}

// Prints URLs in a pretty format
const urlExtractor = new RegExp('/([0-9]+/[^/]+)$');
export function pfUrl(url) {
  return decodeURIComponent(urlExtractor.exec(url)[0]);
}

/*
let myUrl = 'https://www.rocketpunch.com/jobs/419/%EC%9B%B9%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4-%EB%A7%88%EC%BC%80%ED%8C%85-%EB%AA%A8%EB%B0%94%EC%9D%BC%EC%84%9C%EB%B9%84%EC%8A%A4-%EA%B0%9C%EB%B0%9C%EC%9E%90';
console.log(pfUrl(myUrl));
*/
