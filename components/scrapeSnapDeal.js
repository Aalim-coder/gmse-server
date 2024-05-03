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

const scrapeSnapDealpage = async (query) => {
  const url = `https://www.snapdeal.com/search?keyword=${query}`;
  try {
    const { data } = await axios.get(url,{ headers });
    
    return processData(data); 
  } catch (err) {
    console.log("error", err);
    return []; 
  }
};

function processData(data) {
  const $ = cheerio.load(data);
  const list = $('div.col-xs-6');
  const items = [];
  console.log(list.length)

  list.each(function (idx, ele) {
    const targeted = $(ele);
    const link = targeted.find("a").attr("href");
    const img = targeted.find("img.product-image").attr("src");
    const name = targeted.find('p.product-title').text().trim();
    const price = targeted.find("span.product-price").text().trim();
    const ratingsCount = (targeted.find("p.product-rating-count").text().trim()).replace(/[^\d]/g, '');
    const item = {
      id: idx + 1,
      name: name,
      link: link,
      img: img,
      price: price,
      stars : 0,
      ratingsCount : ratingsCount,
    };
    items.push(item);
  });

  fs.writeFile(
    `${dataDir}DataSnapDeal.json`,
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

module.exports = scrapeSnapDealpage;

