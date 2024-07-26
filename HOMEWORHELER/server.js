const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const User = require("./data-services/UserSchema.js");
const { viewQuestions } = require("./routers/viewQuestions.js");
const { viewQuestion } = require("./routers/viewQuestion.js");
const pugTemplate = require("./routers/pugtemplate.js");
const {
  deleteoneUser,
  insertoneUser,
  insertoneQuestion,
  findSimilarQuestions,
  recentQuestion,
} = require("./controllers/dataController.js");
const {
  protect,
  signup,
  restrictTo,
  login,
  isLoggedin,
  logout,
  personalinfo,
  isLoggedin1,
  forgotPassword,
  resetPassword,
} = require("./controllers/authController.js");
const multer = require("multer");

dotenv.config({ path: "./environ.env" });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

const port = process.env.PORT || 3000;


const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  // Store the file as needed and respond with the file URL or success message
  res.send({ imageUrl: `/uploads/${req.file.filename}` });
});



















app.post('/create-checkout-session', async (req, res) => {
  try {
    let customer;

    // Check if the customer already exists in Stripe
    if (req.body.userId) {
      const customers = await stripe.customers.list({
        email: req.body.email,
        limit: 1,
      });

      // If customer doesn't exist, create a new one
      if (customers.data.length === 0) {
        customer = await stripe.customers.create({
          email: req.body.email,
          name: req.body.name, // Optional: Include customer's name if available
          metadata: {
            userId: req.body.userId,
          },
        });
      } else {
        customer = customers.data[0];
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      success_url: `${req.protocol}://${req.get('host')}/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
      customer: customer.id,
      line_items: [
        {
          price: 'price_1PZoKgAZAFlG8qdrig6QoiRK', // Replace with your actual Price ID
          quantity: 1,
        },
      ],
    });

    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Success and cancel URLs
app.get('/success', (req, res) => {
  res.send('Subscription payment was successful!');
});

app.get('/cancel', (req, res) => {
  res.send('Subscription payment was canceled.');
});


app.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send(updatedUser);
  } catch (error) {
    res.status(500).send({ message: 'Error updating user', error });
  }
});

app.post('/users/security/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    const user = await User.findById(id).select('+password');
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.password = newPassword;
    await user.save();

    res.send({ message: 'Password updated successfully' });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send({ message: 'Error updating password', error });
  }
});

app.post('/users/security/changeemail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { newEmail, confirmNewEmail } = req.body;

    if (newEmail !== confirmNewEmail) {
      return res.status(400).send({ message: "Emails do not match" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { email: newEmail }, { new: true });
    
    if (!updatedUser) {
      return res.status(400).send({ message: 'Current email is wrong' });
    }
    
    if(!updatedUser.CustomerId !== "") {
      const customer = await stripe.customers.update(updatedUser.CustomerId, {
        email: newEmail,
      });
    }

    res.send({ message: 'Email updated successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error updating email', error });
  }
});

app.post('/users/customer/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const customerId = req.body.customerId;
    console.log(customerId);
    const updatedUser = await User.findByIdAndUpdate(id, { CustomerId: customerId }, { new: true });

    if (!updatedUser) {
      return res.status(400).send({ message: 'User not found' });
    }

    res.status(200).send({ message: 'Customer ID updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating customer ID:', error);
    res.status(500).send({ message: 'Error updating customer ID', error });
  }
});


async function getCustomer(customerId) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error('Error retrieving customer:', error);
    throw error;
  }
}

async function updateCustomerEmail(customerId, newEmail) {
  try {
    const customer = await stripe.customers.update(customerId, {
      email: newEmail,
    });
    return customer;
  } catch (error) {
    console.error('Error updating customer email:', error);
    throw error;
  }
}

app.post('/update-email/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const { newEmail } = req.body;

  try {
    const customer = await updateCustomerEmail(customerId, newEmail);
    res.status(200).json({ customer, message: 'Customer email updated successfully' });
  } catch (error) {
    console.error('Error updating customer email:', error);
    res.status(500).json({ error: 'Error updating customer email' });
  }
});




app.post('/webhook', express.raw({ type: 'application/json' }), async(request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, 'your-webhook-secret'); // Replace with your actual webhook secret
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return response.sendStatus(400);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Fulfill the purchase...
      console.log('Payment was successful!', session);
      const userEmail = session.customer_details.email;
      await User.findOneAndUpdate({ email: userEmail }, { hasPaid: true });

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

const getCustomerByEmail = async (email) => {
  console.log(await stripe.customers.list());
  const customers = await stripe.customers.list({
    email: email,
    limit: 1
  });
 
  return customers.data.length ? customers.data[0] : null;
};

// Fetch subscription status
app.get('/subscription-status', async (req, res) => {
  const { email } = req.query;

  try {
    const customer = await getCustomerByEmail(email);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const subscription = subscriptions.data[0];
    res.json({
      status: subscription.status,
      current_period_end: subscription.current_period_end
    });

  } catch (error) {
    console.error('Error fetching subscription status:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get("/", (req, res) => {
  res.send("Welcome to my server");
});

app.get("/questions", protect, restrictTo("admin", "expert"), (req, res) => {
  console.log("Protected route /questions accessed");
  viewQuestions(req, res);
});

app.get("/forexperts", protect, restrictTo("expert"));

app.get("/issignedin", isLoggedin1, (req, res) => {
  res.status(200).send({ status: 'success', message: 'User is signed in', user: res.locals.user });
});

app.post("/forgotpassword", forgotPassword);

app.get("/question/:id", protect, (req, res) => {
  console.log("Protected route /question/:id accessed");
  viewQuestion(req, res);
});

app.delete("/deleteuser/:id", protect, restrictTo("admin"), (req, res) => {
  console.log("Protected route /deleteuser/:id accessed");
  deleteoneUser(req, res);
});

// Fetch payment history
app.get('/payment-history', async (req, res) => {
  const { email } = req.query;

  try {
    const customer = await getCustomerByEmail(email);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const charges = await stripe.charges.list({
      customer: customer.id,
      limit: 100, // You can adjust the limit as needed
    });

    res.json(charges.data);
  } catch (error) {
    console.error('Error fetching payment history:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch payment methods
app.get('/payment-methods', async (req, res) => {
  const { email } = req.query;

  try {
    const customer = await getCustomerByEmail(email);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: 'card', // You can adjust the type as needed
    });

    res.json(paymentMethods.data);
  } catch (error) {
    console.error('Error fetching payment methods:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.post(`/api/v1/users/resetPassword/:token`, resetPassword);

app.post("/signup", signup, (req, res) => {
  console.log("/insertuser accessed");
  insertoneUser(req, res);
});

app.post("/login", login, (req, res) => {
  console.log("/login accessed");
});

app.get("/logout", logout, (req, res) => {
  console.log("/logout accessed");
});

app.get("/personalinfo", protect, personalinfo, (req, res) => {
  console.log("Info is taken");
});

app.post("/insertquestion", protect, (req, res) => {
  console.log("Protected route /insertquestion accessed");
  insertoneQuestion(req, res);
});

app.get("/recent", protect, (req, res) => {
  console.log("Protected route /insertquestion accessed");
  recentQuestion(req, res);
});

app.post("/search-similar", async (req, res) => {
  console.log("Protected route /search-similar accessed");
  const newQuestionText = req.body.questionText;

  if (!newQuestionText) {
    return res.status(400).json({ error: "Question text is required" });
  }

  const similarQuestions = await findSimilarQuestions(newQuestionText);
  res.json(similarQuestions);
});

app.get("*", pugTemplate);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).send("Something broke!");
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });
