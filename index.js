const express = require('express')
const scrapeAmazonpage = require('./components/scrapeAmazon')
const cors = require('cors')
const fs = require('fs');
const scrapeBigBasketpage = require('./components/scrapeBigBasket')
const scrapeSnapDealpage = require('./components/scrapeSnapDeal')
const DUMMYJSON = require('./components/CombinedData.json')
// const moongoose = require(moongoose)

dataDir = './components/'

// async function connect(){
//     await moongoose.connect('mongodb://localhost:27017/product-search')
// }

// const schema = new moongoose.schema({
    
// })

const app = express()
app.use(cors())

app.use(express.json())

app.get('/search', async (req, res) => {
    const amazonData = await scrapeAmazonpage(req.query.query);
    // const bigBasketData = await scrapeBigBasketpage(req.query.query);
    // const snapDealData = await scrapeSnapDealpage(req.query.query);
    // for(let i = 0; i < snapDealData.length; i++) {
    //     if(snapDealData[i].price === "" || snapDealData[i].img === "" || snapDealData[i].name === "" || snapDealData[i].img === undefined || snapDealData[i].price === undefined || snapDealData[i].name === undefined){
    //         continue;
    //     } 
    //     else{
    //         amazonData.push(snapDealData[i]);
    //     }
    // }
    // for(let i = 0; i < bigBasketData.length; i++) {
    //     if(bigBasketData[i].price === "" || bigBasketData[i].img === "" || bigBasketData[i].name === "" || bigBasketData[i].img == undefined || bigBasketData[i].price == undefined || bigBasketData[i].name == undefined){
    //         continue;
    //     } 
    //     else{
    //         amazonData.push(bigBasketData[i]);
    //     }
    // }
    // fs.writeFile(
    //     `${dataDir}CombinedData.json`,
    //     JSON.stringify(amazonData, null, 2),
    //     (err) => {
    //       if (err) {
    //         console.error(err);
    //         return [];
    //       }
    //       console.log("Successfully written data to file");
    //     }
    //   );
    const responseData = {
        data: amazonData,
    };
    // res.setHeader('content-type', 'application/json');
    res.send(responseData);
    // scrapeFlipkartWebpage();
    console.log("data sent");

})


app.listen(8000, function (err) {
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port: 8000");
})