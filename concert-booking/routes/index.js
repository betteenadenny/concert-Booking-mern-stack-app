const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/userModels');
const Concert = require('../models/concertModels');
const Booking = require('../models/bookingModel');
// const authenticate = require('../middlewares/authenticate');
// const authorize = require('../middlewares/authorize');
const { checkDuplicateConcertName } = require('../middlewares/customValidators');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/',async (req,res) => {
  try {
    const concerts = await Concert.find();
    const data = concerts.map(concert => ({
      ...concert._doc,
      formattedDate: new Date(concert.date).toDateString()
    }))

    res.render('home', { title: 'All Concerts', data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/create-concert',(req,res) => {
  res.render('create',{
    title: 'Create Concert',
    error: null
  })
})

router.post('/create-concert', upload.single('image'), async (req, res) => {
  const { name, date, time, venue, price, available } = req.body;
  const image = req.file ? req.file.buffer.toString('base64') : null;

  const concert = new Concert({ name, date, time, venue, price, available, image,total:available });

  let validationError = concert.validateSync();
  let errors = validationError ? { ...validationError.errors } : {};

  try {
    const duplicateError = await checkDuplicateConcertName(name);
    if (duplicateError) {
      errors = { ...errors, ...duplicateError }; 
    }

    if (Object.keys(errors).length > 0) {
      return res.render('create', {
        title: 'Create Concert',
        error: errors,
      });
    }

    await concert.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error creating concert:', error);
    res.render('create', {
      title: 'Create Concert',
      error: { general: { message: 'Something went wrong. Please try again.' } },
    });
    res.status(500).send("Internal Server Error");
  }
});

router.get('/update-concert/:id', async (req,res) => {
  const concertId = req.params.id;
  try{
    const concert = await Concert.findById(concertId).lean();
    res.render('update',{
      title:'Concert updation',
      concert,error:null});
  }catch(error){
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/update-concert/:id', upload.single('image'), async (req, res) => {
  const concertId = req.params.id;
  const { name, date, time, venue, price, total } = req.body;
  
  try {
    const existingConcert = await Concert.findById(concertId);
    if (!existingConcert) return res.status(404).send('Concert not found');

    const bookedTickets = await Booking.aggregate([
      { $match: { concert: existingConcert._id } },
      { $group: { _id: null, totalBooked: { $sum: "$tickets" } } }
    ]);
    const totalBooked = bookedTickets.length > 0 ? bookedTickets[0].totalBooked : 0;
    const availableTickets = Math.max(Number(total) - totalBooked, 0);

    const updateData = { 
      name, date, time, venue, price, total,available: availableTickets,
      image:req.file ? req.file.buffer.toString('base64') : existingConcert.image
    };

    const tempConcert = new Concert(updateData);
    let validationError = tempConcert.validateSync();
    let errors = validationError ? { ...validationError.errors } : {};

    const duplicateError = await checkDuplicateConcertName(name, concertId);
    if (duplicateError) {
      errors = { ...errors, ...duplicateError };
    }

    if (Object.keys(errors).length > 0) {
      return res.render('update', {
        concert: { _id: concertId, ...updateData },
        error: errors,
        title: 'Concert Updation',
      });
    }

    const updatedConcert = await Concert.findByIdAndUpdate(concertId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedConcert) return res.status(404).send('Concert not found');
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.render('update', {
      concert: { _id: concertId, ...updateData },
      error: { general: { message: 'Something went wrong.' } },
      title: 'Concert Updation',
    });
    res.status(500).send("Internal Server Error");
  }
});


router.get('/delete-concert/:id', async(req,res) => {
  const concertId = req.params.id;
  try{
    const concert = await Concert.findById(concertId).lean();
    res.render('delete',{
      title:'Concert Deletion',
      concert
    });
  }catch(error){
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/delete-concert/:id', async(req,res) => {
  const concertId = req.params.id;
  try {
    await Concert.findByIdAndDelete(concertId);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/user-details',async(req,res) => {
  try {
    const users = await User.find({role:{$ne:'admin'}});

    res.render('users',{
      users,
      title:'User Details'
  });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  } 
})

router.post('/delete-user/:id',async(req,res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.redirect('/user-details')
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/booking-details', async (req, res) => {
  try {
    const view = req.query.view || 'user';

    const bookingData = await Booking.find()
      .populate("user", "name email")
      .populate("concert", "name venue date")
      .lean();

    const validBookings = bookingData.filter(b => b.user && b.concert);

    let groupedData = {};

    if (view === 'user') {
      validBookings.forEach(b => {
        const userId = b.user._id.toString();
        if (!groupedData[userId]) {
          groupedData[userId] = { user: b.user, bookings: [] };
        }
        groupedData[userId].bookings.push(b);
      });
    } else if (view === 'concert') {
      validBookings.forEach(b => {
        const concertId = b.concert._id.toString();
        if (!groupedData[concertId]) {
          groupedData[concertId] = { concert: b.concert, bookings: [] };
        }
        groupedData[concertId].bookings.push(b);
      });
    }

    res.render('booking-details', {
      title: 'Booking Details',
      view,
      groupedData
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/logout',(req,res) => {
  res.redirect('http://localhost:3000/login?loggedOut=true')
})






module.exports = router;
