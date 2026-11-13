require('dotenv').config();
const axios = require('axios');

axios.post('https://api.hubapi.com/oauth/v2/private-apps/get/access-token-info', {
  tokenKey: process.env.PRIVATE_APP_ACCESS
})
  .then(res => console.log(JSON.stringify(res.data, null, 2)))
  .catch(err => console.log(JSON.stringify(err.response ? err.response.data : err.message, null, 2)));