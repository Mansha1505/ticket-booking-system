import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings/mybookings');
                setBookings(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBookings();
    }, []);

    return (
        <div className="container">
            <h1 style={{ margin: '2rem 0' }}>My Bookings</h1>
            {bookings.length === 0 ? <p>No bookings found.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {bookings.map(booking => (
                        <div key={booking._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3>{booking.event.title}</h3>
                                <p>{new Date(booking.event.date).toLocaleString()}</p>
                                <p>Seats: {booking.seatsBooked}</p>
                                <p>Status: <span style={{ color: 'green' }}>{booking.paymentStatus}</span></p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${booking.totalAmount}</p>
                                <p style={{ fontSize: '0.8rem', color: '#999' }}>Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
