require('dotenv').config();
const axios = require('axios');

const OBJECT_TYPE = '2-25733909';
const headers = {
  Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json'
};

async function run() {
  // 1. Custom properties ke internal names aur sensitivity
  try {
    const res = await axios.get(`https://api.hubapi.com/crm/v3/properties/${OBJECT_TYPE}`, { headers });
    console.log('--- PROPERTIES ---');
    res.data.results
      .filter(p => !p.hubspotDefined)
      .forEach(p => console.log(`${p.label} | internal name: ${p.name} | type: ${p.type} | sensitivity: ${p.dataSensitivity || 'none'}`));
  } catch (e) {
    console.log('Properties error:', JSON.stringify(e.response ? e.response.data : e.message, null, 2));
  }

  // 2. Records padhna (read test)
  try {
    const res = await axios.get(`https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`, { headers });
    console.log('--- READ OK ---', res.data.results.length, 'records');
  } catch (e) {
    console.log('Read error:', JSON.stringify(e.response ? e.response.data : e.message, null, 2));
  }

  // 3. Bina kisi property ke record banana (write test)
  try {
    const res = await axios.post(`https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`, { properties: {} }, { headers });
    console.log('--- WRITE OK --- new id:', res.data.id);
  } catch (e) {
    console.log('Write error:', JSON.stringify(e.response ? e.response.data : e.message, null, 2));
  }
}

run();