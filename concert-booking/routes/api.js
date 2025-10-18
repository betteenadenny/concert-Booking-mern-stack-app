require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Concert = require('../models/concertModels');
const User = require('../models/userModels');
const Booking = require('../models/bookingModel');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const ejs = require('ejs');
const authenticate = require('../middlewares/authenticate');
// const authorize = require('../middlewares/authorize');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;

    if (!name || !email || !password || !password_confirmation) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== password_confirmation) {
      return res.status(400).json({ message: 'Password and Confirm Password do not match' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const validationError = newUser.validateSync();
    if (validationError) {
      return res.status(400).json({ error: validationError.errors });
    }

    await newUser.save();
    res.status(201).json({ message: 'Account created successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const {email,password} = req.body;
    if(!email || !password){
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email});
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
 
    const token = jwt.sign(
      { userId: user._id,role:user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
       message:'Logged in successfully',
       token:token,
       userRole:user.role,
       userId:user._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post("/book_ticket", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { concertId, tickets } = req.body;

    const concert = await Concert.findById(concertId);
    if (!concert) return res.status(404).json({ message: "Concert not found" });

    if(concert.available < tickets){
      return res.status(400).json({
        message: `Only ${concert.available} tickets are available for this concert.`,
      })
    }
    const totalPrice = concert.price * tickets;

    const newBooking = new Booking({
      user: userId,
      concert: concertId,
      tickets,
      totalPrice,
    });

    await newBooking.save();

    concert.available -= tickets;
    await concert.save();
    
    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error(error);
  res.status(500).json({ message: "Internal Error"});;
  }
});

router.get('/retrieve_concert', (req, res) => {
    Concert.find()
        .then(data => {
            const serializedData = data.map(concert => ({
                id: concert._id,
                name: concert.name,
                date:concert.date,
                time:concert.time,
                venue:concert.venue, 
                price:concert.price, 
                available:concert.available, 
                image:concert.image
            }));
            res.status(200).json({ data: serializedData });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

router.get('/retrieve_concert/:id',async (req,res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if(!concert) return res.status(400).json({message:'Concert not found'})
    res.json({data:concert})
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Internal server error'})
  }
});

router.get('/retrieve_booking/:id',async(req,res) => {
  const userId = req.params.id;
  try {
    const bookingData = await Booking.find({user:userId}).populate('concert');
    if(!bookingData || bookingData.length === 0) return res.status(400).json({message:'No booking found'});
    res.json({data:bookingData})
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Internal server error'})
  }  
});

router.get('/booking_confirmation/:id', async (req, res) => {
  try {
    const bookingData = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("concert", "name venue date")
      .lean();
       
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "8213d0c290490a",
        pass: "5b5544dfac0e1f"
      }
    });

    const template = await fs.readFile('./views/confirmation.ejs', 'utf8');
    const mailOptions = {
      from: 'admin@example.com', 
      to: bookingData.user.email, 
      subject: `Booking Confirmation : ${bookingData.concert.name}`,
      html: ejs.render(template, { bookingData })
    };

    const info = await transport.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    transport.close();
    res.send('Email sent successfully');
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});








































// Open route (anyone)
// router.get('/public', (req, res) => {
//   res.json({ message: 'Anyone can access this route' });
// });

// Protected route (only logged in users)
// router.get('/user', authenticate, (req, res) => {
//   res.json({ message: `Welcome ${req.user.role}` });
// });

// Admin-only route
// router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
//   res.json({ message: 'Welcome Admin! You have full access.' });
// });


module.exports = router;