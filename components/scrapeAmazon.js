const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const dataDir = path.join(__dirname, "/");

const headers = {
  'Accept' : '*/*',
  'Accept-Encoding' :'gzip, deflate, br',
  'Accept-Language':'en-GB,en;q=0.5',
  'Connection':'keep-alive',
  'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0'
  }

const scrapeAmazonpage = async (query) => {
  const url = "https://www.amazon.in/s?k=" + query;
  try {
    const { data } = await axios.get(url, { headers });
    // pass data to processData(function) for further processing using cheerio;
    return processData(data); // Return the result of processData
  } catch (err) {
    console.log("error", err);
    return []; // Return an empty array if there's an error
  }
};

function processData(data) {
  const $ = cheerio.load(data);
  const list = $('[data-component-type="s-search-result"]');
  const items = [];

  list.each(function (idx, ele) {
    const targeted = $(ele);
    const link = "https://www.amazon.in" + targeted.find("a").attr("href");
    const img = targeted.find("img").attr("src");
    const name = targeted.find('span.a-text-normal').text().trim();
    const price = targeted.find(".a-price-symbol").text().trim() + targeted.find(".a-price-whole").text().trim();
    const stars = (targeted.find(".a-icon-alt").text().trim());
    const ratingsCount = targeted.find(".a-size-base.s-underline-text").text().trim();
    var combinedParameter = ((parseFloat(stars.slice(0, 3) * 40)) + (parseFloat(ratingsCount) * 60))/100;
    // console.log(stars.slice(0,3),ratingsCount,combinedParameter);
    const item = {
      id: idx + 1,
      name: name,
      link: link,
      img: img,
      price: price,
      stars: stars,
      ratingsCount: ratingsCount,
      combinedParameter: combinedParameter,
    };
    items.push(item);
  });
  items.sort((a, b) => b.combinedParameter - a.combinedParameter);

  fs.writeFile(
    `${dataDir}DataAmazon.json`,
    JSON.stringify(items, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return [];
      }
      console.log("Successfully written data to file");
    }
  );

  return items;
}

module.exports = scrapeAmazonpage;
