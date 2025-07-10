require('dotenv').config(); // Load .env variables
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
app.get('/', (req, res) => {
  res.redirect('/home.html');
});

// Middleware to parse POST form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (CSS, images, HTML)
app.use(express.static(path.join(__dirname)));

// GET route to serve contact page
app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// POST route for email submission
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


  const mailOptions = {
    from: email,
    to: 'your_email@gmail.com',
    subject: `New Contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.send('Error sending message.');
    }
    res.send('Message sent successfully!');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
