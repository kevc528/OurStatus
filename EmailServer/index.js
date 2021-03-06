const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
  console.log('Email server listening on port 3000');
})

app.post('/send-email', (req, res) => {
  console.log('send email request');
  let recipient = req.body.recipient;
  let subject = req.body.subject;
  let text = req.body.text;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'OurStatusApp@gmail.com',
      pass: 'gimmeThemtoez'
    }
  });
  
  let mailOptions = {
    from: 'OurStatusApp@gmail.com',
    to: recipient,
    subject: subject,
    text: text
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send('failure');
    } else {
      console.log("Email has been sent");
      res.send('success');    
    }
  });
});