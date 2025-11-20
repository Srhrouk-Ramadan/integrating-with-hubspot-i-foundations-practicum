require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔐 التوكن من ملف .env
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// 🧩 رقم الـ Custom Object أو API Name (خليه زي ما عندك في HubSpot)
const CUSTOM_OBJECT_ID = '2-194312522';

// ======================
// 🏠 ROUTE 1 - Homepage showing hobbies
// ======================
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=name,nick_name,fav_colour`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };

  try {
    const resp = await axios.get(url, { headers });
    const hobbies = resp.data.results || [];
    res.render('homepage', { title: 'Hobbies List | HubSpot Practicum', hobbies });
  } catch (error) {
    console.error('❌ Error fetching records:', error.response?.data || error.message);
    res.send('حدث خطأ أثناء جلب البيانات. تأكدي من صحة التوكن أو البيانات.');
  }
});

// ======================
// 📝 ROUTE 2 - Form to add new hobby
// ======================
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Add New Hobby | HubSpot Practicum' });
});

// ======================
// 🚀 ROUTE 3 - Handle form submission
// ======================
app.post('/update-cobj', async (req, res) => {
  const data = {
    properties: {
      name: req.body.name,
      nick_name: req.body.nick_name,
      fav_colour: req.body.fav_colour,
      hobbies: req.body.name, // لو في required property اسمها hobbies
    },
  };

  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };

  try {
    await axios.post(url, data, { headers });
    res.redirect('/');
  } catch (error) {
    console.error('❌ Error creating record:', error.response?.data || error.message);
    res.send('حدث خطأ أثناء إنشاء الهواية. تأكدي من الخصائص أو التوكن.');
  }
});

// ======================
// 🚦 Start server
// ======================
app.listen(3000, () => console.log('✅ Listening on http://localhost:3000'));
