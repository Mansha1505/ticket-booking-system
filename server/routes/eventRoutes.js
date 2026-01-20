const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, adminCheck } = require('../middleware/authMiddleware');

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};

        const events = await Event.find({ ...keyword, ...category }).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Fetch single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
router.post('/', protect, adminCheck, async (req, res) => {
    const { title, description, category, date, location, price, totalSeats, image } = req.body;

    // Basic validation
    if (!title || !date || !price) {
        return res.status(400).json({ message: 'Please fill all required fields' });
    }

    try {
        const event = new Event({
            title,
            description,
            category,
            date,
            location,
            price,
            totalSeats,
            availableSeats: totalSeats, // Initially all available
            image
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
router.put('/:id', protect, adminCheck, async (req, res) => {
    const { title, description, category, date, location, price, totalSeats, image } = req.body;

    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            event.title = title || event.title;
            event.description = description || event.description;
            event.category = category || event.category;
            event.date = date || event.date;
            event.location = location || event.location;
            event.price = price || event.price;
            event.image = image || event.image;

            // Adjust available seats if total seats changed (Simplified logic)
            if (totalSeats && totalSeats !== event.totalSeats) {
                const diff = totalSeats - event.totalSeats;
                event.availableSeats += diff;
                event.totalSeats = totalSeats;
            }

            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
router.delete('/:id', protect, adminCheck, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
