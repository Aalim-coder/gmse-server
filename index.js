const express = require('express')
const scrapeAmazonpage = require('./components/scrapeAmazon')
const cors = require('cors')
const scrapeBigBasketpage = require('./components/scrapeBigBasket')
const scrapeSnapDealpage = require('./components/scrapeSnapDeal')

const app = express()
app.use(cors())

app.use(express.json())

app.get('/search', async (req, res) => {
    const amazonData = await scrapeAmazonpage(req.query.query);
    const bigBasketData = await scrapeBigBasketpage(req.query.query);
    const snapDealData = await scrapeSnapDealpage(req.query.query);
    for(let i = 0; i < snapDealData.length; i++) {
        if(snapDealData[i].price === "" || snapDealData[i].img === "" || snapDealData[i].name === "" || snapDealData[i].img === undefined || snapDealData[i].price === undefined || snapDealData[i].name === undefined){
            continue;
        } 
        else{
            amazonData.push(snapDealData[i]);
        }
    }
    for(let i = 0; i < bigBasketData.length; i++) {
        if(bigBasketData[i].price === "" || bigBasketData[i].img === "" || bigBasketData[i].name === "" || bigBasketData[i].img == undefined || bigBasketData[i].price == undefined || bigBasketData[i].name == undefined){
            continue;
        } 
        else{
            amazonData.push(bigBasketData[i]);
        }
    }
    const responseData = {
        data: amazonData,
    };
    res.send(responseData);
    console.log("data sent");

})


app.listen(8000, function (err) {
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port: 8000");
})