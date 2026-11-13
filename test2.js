require('dotenv').config();
const axios = require('axios');
const headers = {
  Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json'
};

async function run() {
  const res = await axios.get('https://api.hubapi.com/crm/v3/schemas', { headers });
  for (const s of res.data.results) {
    console.log(`${s.labels.plural} | id: ${s.objectTypeId} | fqn: ${s.fullyQualifiedName}`);
    try {
      const w = await axios.post(`https://api.hubapi.com/crm/v3/objects/${s.fullyQualifiedName}`, { properties: {} }, { headers });
      console.log('  WRITE OK with fqn, new id:', w.data.id);
    } catch (e) {
      console.log('  Write error:', e.response ? e.response.data.category : e.message);
    }
  }
}
run();