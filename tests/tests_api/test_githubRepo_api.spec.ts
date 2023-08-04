import { test, expect, request } from '@playwright/test';

const axios = require('axios');

test("apiTesting_axios" , async() => {

// Replace with your actual API URL and Bearer token

const apiUrl = 'https://api.github.com/user/repos';

const bearerToken = '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';

    const headers = {
        Authorization: `Bearer ${bearerToken}`
    };
    try {

        const response = await axios.get(apiUrl, { headers });
        console.log(response.data);
        let i=0;
        for( ; i< response.data.length; i++){
           console.log(response.data[i]);
        }

    } catch (error) {
        console.error(`Request failed with error: ${error.message}`);

    }

});