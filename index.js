require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// التوكن من .env
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ال Custom Object ID أو API Name
const CUSTOM_OBJECT_ID = '2-194312522'; // أو 'p_hobbies' حسب اللي عندك

// ROUTE 1 - Homepage showing hobbies
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=name,nick_name,fav_colour`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const resp = await axios.get(url, { headers });
    const hobbies = resp.data.results;
    res.render('homepage', {
      title: 'Hobbies List | HubSpot Practicum',
      hobbies
    });
  } catch (error) {
    console.error('❌ Error fetching records:', error.response?.data || error.message);
    console.error(JSON.stringify(error.response?.data, null, 2));
    res.send('❌ فشل إنشاء الهواية، شوفي التفاصيل في الـ console.');

  }
});

// ROUTE 2 - Form to add new hobby
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Add New Hobby | HubSpot Practicum' });
});

// ROUTE 3 - Handle form submission
app.post('/update-cobj', async (req, res) => {
  const data = {
    properties: {
      name: req.body.name,
      nick_name: req.body.nick_name,
      fav_colour: req.body.fav_colour,
      hobbies: req.body.name // أو أي قيمة مناسبة للـ field ده
    }
  };

  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    await axios.post(url, data, { headers });
    res.redirect('/');
  } catch (error) {
    console.error('❌ Error creating record:', error.response?.data || error.message);
    res.send('حدث خطأ أثناء إنشاء الـ hobby. تأكدي من الخصائص أو الـ token.');
  }
});

app.listen(3000, () => console.log('✅ Listening on http://localhost:3000'));
