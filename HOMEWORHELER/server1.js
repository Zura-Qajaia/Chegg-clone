const express = require('express');
const bodyParser = require('body-parser');
const Email = require('./utils/Email.js'); // Adjust the path to your Email class
const dotenv = require("dotenv");
const app = express();
dotenv.config({ path: "./environ.env" });
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
  const { email, name, url, type } = req.body;

  try {
    const user = { email, name };
    const emailInstance = new Email(user, url);

    if (type === 'welcome') {
        console.log(emailInstance);
      await emailInstance.sendWelcome();
    } else if (type === 'passwordReset') {
      await emailInstance.sendPasswordReset();
    } else if (type === 'template') {
      await emailInstance.sendTemplate();
    } else {
      return res.status(400).send({ message: 'Invalid email type' });
    }

    res.status(200).send({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to send email', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
