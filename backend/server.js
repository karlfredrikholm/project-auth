import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, Thought } from './utils/mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Function for authenticating user
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization');
  try {
    const user = await User.findOne({ accessToken: accessToken });
    if (user) {
      next();
    } else {
      res.status(401).json({
        response: 'Please log in.',
        success: false,
      });
    }
  } catch (err) {
    res.status(400).json({
      response: err,
      success: false,
    });
  }
};

// Routes
app.get('/', (req, res) => {
  res.send('Peep the front-end: https://glittery-halva-09357e.netlify.app 🥸');
});

// Register end point
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync();
    const oldUser = await User.findOne({ username });
    const oldEmail = await User.findOne({ email });

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        response: 'Password must be min 8 characters',
      });
    } else if (oldUser) {
      res.status(400).json({
        success: false,
        response: 'Username already taken',
      });
    } else if (oldEmail) {
      res.status(400).json({
        success: false,
        response: 'Email already registered'
      })
    } else {
      const newUser = await new User({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, salt),
      }).save();
      res.status(201).json({
        success: true,
        response: {
          username: newUser.username,
          accessToken: newUser.accessToken,
          id: newUser._id,
        },
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err,
    });
  }
});

// Login end point
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        response: {
          username: user.username,
          id: user._id,
          accessToken: user.accessToken,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        response: 'Credentials not correct',
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err,
    });
  }
});

// End point with content available only if authenticated
app.get('/thoughts', authenticateUser);
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find({});
  res.status(200).json({
    success: true,
    response: thoughts,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
