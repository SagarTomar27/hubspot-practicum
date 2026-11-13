require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Private app access token (stored in .env, never in code)
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// Your custom object type ID (from the HubSpot settings URL)
const OBJECT_TYPE = '2-25733909';

// Internal names of your custom object properties
// Check these in Settings > Objects > SMS_Campaigns > Manage properties
// const PROPS = ['campaigns_name', 'campaigns_descriptions', 'campaign_status'];
const PROPS = ['cmpaigns_name', 'campaigns_description', 'campaign_status'];

const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json'
};

// ROUTE 1: Homepage - show all custom object records in a table
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=${PROPS.join(',')}`;
  try {
    const resp = await axios.get(url, { headers });
    const data = resp.data.results;
    res.render('homepage', { title: 'Custom Object Table | Integrating With HubSpot I Practicum', data, props: PROPS });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    console.error(JSON.stringify(error.response ? error.response.data : error.message, null, 2));
    res.status(500).send('Error fetching records. Check the terminal for details.');
  }
});

// ROUTE 2: Show the form to create a new record
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3: Create a new record from the form, then go back to homepage
app.post('/update-cobj', async (req, res) => {
  const newRecord = {
    properties: {
      [PROPS[0]]: req.body.name,
      [PROPS[1]]: req.body.description,
      [PROPS[2]]: req.body.status
    }
  };
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;
  try {
    await axios.post(url, newRecord, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(JSON.stringify(error.response ? error.response.data : error.message, null, 2));
    res.status(500).send('Error creating record. Check the terminal for details.');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
