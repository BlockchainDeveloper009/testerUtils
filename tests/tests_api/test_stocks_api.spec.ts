import { test, expect, request } from '@playwright/test';

import axios from 'axios';

 

const API_KEY = 'UTMV0TP1H4Z5RE3P'; // Replace with your actual API key

const tickerSymbol = 'AAPL'; // Replace with the desired ticker symbol

async function fetchCurrentPrice( tickerSymbol) {

    const price_by_ticker_Url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${tickerSymbol}&apikey=${API_KEY}`;

    try {

        const response = await axios.get(price_by_ticker_Url);

        const quoteData = response.data['Global Quote'];

 

        if (quoteData) {

            const currentPrice = parseFloat(quoteData['05. price']);

            return currentPrice;

        } else {

            throw new Error('Quote data not available');

        }

    } catch (error) {

        console.error('Error fetching data:', error.message);

        return null;

    }

}

async function fetch50WeekHigh(tickerSymbol) {

    const fiftyWeeksHigh_by_ticker_Url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${tickerSymbol}&apikey=${API_KEY}`;
    try {
        const response = await axios.get(fiftyWeeksHigh_by_ticker_Url);
        const weeklyData = response.data['Weekly Time Series'];
        // Find the highest price over the last 50 weeks
        let fiftyWeekHigh = 0;
        let counter=0;
        for (const date in weeklyData) {
            const high = parseFloat(weeklyData[date]['2. high']);
            if(counter==49){
                break;
            }else{
                counter++;
                if (high > fiftyWeekHigh) {
                    fiftyWeekHigh = high;
                }
            }
           
        }
        return fiftyWeekHigh;
    } catch (error) {

        console.error('Error fetching data:', error.message);
        return null;
    }

}

 

async function fetchRSI(tickerSymbol) {

    try {
                       //https://www.alphavantage.co/query?function=RSI&symbol=AAPL&interval=weekly&time_period=14&series_type=open&apikey=UTMV0TP1H4Z5RE3P
        const apiUrl = `https://www.alphavantage.co/query?function=RSI&symbol=${tickerSymbol}&interval=15min&time_period=14&series_type=open&apikey=${API_KEY}`;;
        //const apiUrl = `https://www.alphavantage.co/query?function=RSI&symbol=${tickerSymbol}&interval=daily&time_period=14&apikey=${API_KEY}`;
        const response = await axios.get(apiUrl);
        const rsiData = response.data['Technical Analysis: RSI'];
        if (rsiData) {
            // Extract RSI value from the latest available data point
            const latestDate = Object.keys(rsiData)[0];
            const rsi = parseFloat(rsiData[latestDate]['RSI']);
            return rsi;
        } else {
            throw new Error('RSI data not available');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;

    }

}
 
test("apiStickers_axios" , async() => {
    let tickerSymbol = 'PLTR'
    const fiftyWeekHigh = await fetch50WeekHigh(tickerSymbol);
    if (fiftyWeekHigh !== null) {
        console.log(`50-week high for ${tickerSymbol}: $${fiftyWeekHigh.toFixed(2)}`);
    }

});


test("fetch_currentPrice" , async() => {
 
    let tickerSymbol = 'PLTR'
    const currentPrice = await fetchCurrentPrice(tickerSymbol);
    if (currentPrice !== null) {
        console.log(`Current price for ${tickerSymbol}: $${currentPrice.toFixed(2)}`);
    }

});

test("fetch_RSI_byIndex" , async() => {
    let tickerSymbol = 'PLTR'
    const rsiValue = await fetchRSI(tickerSymbol);
    if (rsiValue !== null) {
        console.log(`RSI for ${tickerSymbol}: ${rsiValue.toFixed(2)}`);

    }

});

test("Time_to_buy_or_not" , async() => {
    // let ticketSymbols = [
    //     'PLTR', 'AAPL', 'TSLA', 'SHOP'
    // ]

    let ticketSymbols = [
        'PLTR'
    ]
   
   
    let i=0;
    for(i ; i< ticketSymbols.length; i++){

        let tickerSymbol = ticketSymbols[i];
        let tenPercentDiscountOn_5oweekHigh = 0;
        let currentPrice:any = 0;
        currentPrice = await fetchCurrentPrice(tickerSymbol);
        if (currentPrice !== null) {
            console.log(`Current price for ${tickerSymbol}: $${currentPrice.toFixed(2)}`);
        }
        const fiftyWeekHigh = await fetch50WeekHigh(tickerSymbol);
        if (fiftyWeekHigh !== null) {
            console.log(`50-week high for ${tickerSymbol}: $${fiftyWeekHigh.toFixed(2)}`);
            // 45 - 4.5 = 40
            tenPercentDiscountOn_5oweekHigh = fiftyWeekHigh - ((fiftyWeekHigh * 10 ) / 100);
            //Send alert
            if(currentPrice > tenPercentDiscountOn_5oweekHigh){

                console.log(`currentPrice ${currentPrice} > ${tenPercentDiscountOn_5oweekHigh} ;; Normal Buy Now`);
            }else{

                console.log(`currentPrice ${currentPrice} > ${tenPercentDiscountOn_5oweekHigh} ;; Double up Buy`);
                
            }
        }

    }

});