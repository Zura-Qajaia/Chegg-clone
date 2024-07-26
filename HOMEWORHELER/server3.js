const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const User = require("./data-services/UserSchema.js");
const Question = require("./data-services/QuestionsSchema.js");
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

dotenv.config({ path: "./environ.env" });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173', // Update with your client URL
      methods: ['GET', 'POST'],
      credentials: true
    }
  });


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);
  
    socket.on("answer-question", (questionId) => {
      console.log(`Question ${questionId} is being answered by ${socket.id}`);
      io.emit("question-answered", questionId);
    });
  
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });


app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }
  res.status(200).send({ imageUrl: `/uploads/${req.file.filename}` });
});


app.post("/send-to-expert", async (req, res) => {
    const { questionText, subject } = req.body;
    if (!questionText || !subject) {
      return res.status(400).json({ error: "Question text and subject are required" });
    }
  
    try {
      const assignedExpert = await assignQuestionToExpert(questionText, subject);
      res.status(200).json({
        success: true,
        message: "Question sent to expert",
        assignedExpert,
      });
    } catch (error) {
      console.error("Error assigning question to expert:", error);
      res.status(500).json({ error: "Failed to send question to expert" });
    }
  });
  
  async function assignQuestionToExpert(questionText, subject) {
    const experts = await User.find({ role: "expert" });
    if (experts.length === 0) {
      throw new Error("No available experts");
    }
  
    const assignedExpert = experts[0];
    const newQuestion = await Question.create({
      id: 35,
      questionText,
      subject,
      assignedTo: assignedExpert._id,
      status: "pending",
      createdAt: Date.now(),
    });
  
    scheduleReassignment(newQuestion._id, subject);
  
    io.emit("new-question", { question: newQuestion, subject });
  
    return assignedExpert;
  };
  
  function scheduleReassignment(questionId, subject) {
    setTimeout(async () => {
      const question = await Question.findById(questionId);
      if (question && question.status === "pending") {
        const nextExpert = await getNextAvailableExpert(question.assignedTo, subject);
        if (nextExpert) {
          question.assignedTo = nextExpert._id;
          await question.save();
          
          // Broadcast the reassignment to all connected clients
          io.emit("reassigned-question", { question, subject });
          
          console.log(`Reassigned question to expert: ${nextExpert.email}`);
        }
      }
    }, 5 * 60 * 1000)};


async function getNextAvailableExpert(currentExpertId, subject) {
  const experts = await User.find({
    role: "expert",
    expertiseIn: subject,
    _id: { $ne: currentExpertId },
  });
  return experts.length > 0 ? experts[0] : null;
}

app.post("/update-question-status", async (req, res) => {
  const { questionId, status, answer } = req.body;
  if (!questionId || !status) {
    return res.status(400).json({ error: "Question ID and status are required" });
  }

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    question.status = status;
    if (answer) {
      question.answer = answer;
    }
    await question.save();
    io.emit("question-status-updated", { question });

    res.status(200).json({
      success: true,
      message: "Question status updated",
      question,
    });
  } catch (error) {
    console.error("Error updating question status:", error);
    res.status(500).json({ error: "Failed to update question status" });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    let customer;

    if (req.body.userId) {
      const customers = await stripe.customers.list({ email: req.body.email, limit: 1 });

      if (customers.data.length === 0) {
        customer = await stripe.customers.create({
          email: req.body.email,
          name: req.body.name,
          metadata: { userId: req.body.userId },
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
      line_items: [{ price: 'price_1PZoKgAZAFlG8qdrig6QoiRK', quantity: 1 }],
    });

    res.status(200).json({ status: 'success', session });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

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

app.post(`/api/v1/users/resetPassword/:token`, resetPassword);

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



app.post("/forgotpassword", forgotPassword);

app.get("/question/:id", protect, (req, res) => {
  console.log("Protected route /question/:id accessed");
  viewQuestion(req, res);
});

app.delete("/deleteuser/:id", protect, restrictTo("admin"), (req, res) => {
  console.log("Protected route /deleteuser/:id accessed");
  deleteoneUser(req, res);
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


app.post('/users/security/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { securityAnswers } = req.body;

    if (!securityAnswers) {
      return res.status(400).send({ message: 'Security answers are required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    user.securityAnswers = securityAnswers;
    await user.save();

    res.status(200).send({ message: 'Security answers updated successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error updating security answers', error });
  }
});

app.post('/users/resetPassword', async (req, res) => {
  const { email, newPassword, securityAnswers } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const correctAnswers = user.securityAnswers.map(answer => answer.toLowerCase());
    const providedAnswers = securityAnswers.map(answer => answer.toLowerCase());

    if (correctAnswers.join('') !== providedAnswers.join('')) {
      return res.status(401).send({ message: 'Incorrect security answers' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).send({ message: 'Error resetting password', error });
  }
});


app.use("/questions", viewQuestions);
app.use("/", viewQuestion);

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { 
    console.log("Connected to database");
  
  })
  .catch((error) => console.error("Database connection error:", error));
