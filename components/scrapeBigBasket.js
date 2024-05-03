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

const scrapeBigBasketpage = async (query) => {
  const url = `https://www.bigbasket.com/ps/?q=${query}`;
  try {
    const { data } = await axios.get(url,{ headers });
    for (let i = 1; i < 100; i++) {
      
    }
    
    return processData(data); 
  } catch (err) {
    console.log("error", err);
    return []; 
  }
};

function processData(data) {
  const $ = cheerio.load(data);
  const list = $('div.SKUDeck___StyledDiv-sc-1e5d9gk-0');
  const items = [];
  console.log(list.length)

  list.each(function (idx, ele) {
    const targeted = $(ele);
    const link = "https://www.bigbasket.com" +targeted.find("a").attr("href");
    const img = targeted.find("img.DeckImage___StyledImage-sc-1mdvxwk-3").attr("src");
    const name = targeted.find('h3.line-clamp-2').text().trim();
    const price = targeted.find("span.Pricing___StyledLabel-sc-pldi2d-1").text().trim();
    const stars = targeted.find("span.Label-sc-15v1nk5-0 gJxZPQ").text().trim();
    const ratingsCount = targeted.find("span.ReviewsAndRatings___StyledLabel-sc-2rprpc-1").text().trim();
    const item = {
      id: idx + 1,
      name: name,
      link: link,
      img: img,
      price: price,
      stars : stars,
      ratingsCount : ratingsCount,
    };
    items.push(item);
  });

  return items; 
}

module.exports = scrapeBigBasketpage;
