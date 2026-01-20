const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect, adminCheck } = require('../middleware/authMiddleware');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
    const { eventId, seatsBooked, totalAmount } = req.body;

    if (!eventId || !seatsBooked) {
        return res.status(400).json({ message: 'No event or seats selected' });
    }

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.availableSeats < seatsBooked) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Mock Payment Success check (random or always true)
        // In real app, integrate Stripe here before creating booking or mark as pending.
        const paymentSuccess = true;

        if (paymentSuccess) {
            const booking = new Booking({
                user: req.user._id,
                event: eventId,
                seatsBooked,
                totalAmount,
                paymentStatus: 'completed'
            });

            const createdBooking = await booking.save();

            // Update event available seats
            event.availableSeats -= seatsBooked;
            await event.save();

            res.status(201).json(createdBooking);
        } else {
            res.status(400).json({ message: 'Payment failed' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
router.get('/mybookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('event');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, adminCheck, async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'name email').populate('event', 'title date');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
