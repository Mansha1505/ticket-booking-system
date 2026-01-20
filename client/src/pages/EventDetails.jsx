import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [qty, setQty] = useState(1);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (error) {
                console.error("Error fetching event", error);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBook = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        try {
            await api.post('/bookings', {
                eventId: id,
                seatsBooked: qty,
                totalAmount: qty * event.price
            });
            setBookingSuccess(true);
        } catch (error) {
            alert(error.response?.data?.message || "Booking Failed");
        }
    };

    if (!event) return <div className="container">Loading...</div>;

    if (bookingSuccess) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
            <h2 style={{ color: 'green' }}>Booking Confirmed!</h2>
            <p>You have successfully booked {qty} tickets for {event.title}.</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Go to Dashboard</button>
        </div>
    );

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <img src={event.image} alt={event.title} style={{ width: '100%', borderRadius: '8px' }} />
                <div>
                    <h1>{event.title}</h1>
                    <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>{event.category}</p>
                    <p>{event.description}</p>
                    <hr />
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Available Seats:</strong> {event.availableSeats}</p>

                    <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                        <h3>Book Tickets</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${event.price} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>/ ticket</span></p>

                        <div style={{ margin: '1rem 0' }}>
                            <label>Quantity: </label>
                            <input
                                type="number"
                                min="1"
                                max={event.availableSeats}
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                style={{ padding: '0.5rem', width: '60px' }}
                            />
                        </div>

                        <p><strong>Total:</strong> ${qty * event.price}</p>

                        <button onClick={handleBook} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            {currentUser ? 'Confirm Booking' : 'Login to Book'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
