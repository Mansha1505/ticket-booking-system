import React, { useState } from 'react';
import api from '../services/api';
import { FaRobot, FaTimes, FaTelegramPlane } from 'react-icons/fa';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hi! I am Gemini. Ask me about events or how to book tickets.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/ai/chat', { message: userMsg.text });
            setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I am having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: '#4f46e5', color: 'white', border: 'none',
                        fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    <FaRobot />
                </button>
            )}

            {isOpen && (
                <div style={{
                    width: '350px', height: '500px', background: 'white',
                    borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden'
                }}>
                    <div style={{ background: '#4f46e5', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>Gemini Assistant</span>
                        <FaTimes onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }} />
                    </div>

                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                background: msg.role === 'user' ? '#4f46e5' : '#f3f4f6',
                                color: msg.role === 'user' ? 'white' : 'black',
                                padding: '0.5rem 1rem', borderRadius: '10px', maxWidth: '80%'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div style={{ alignSelf: 'flex-start', color: '#999', fontSize: '0.8rem' }}>Typing...</div>}
                    </div>

                    <form onSubmit={handleSend} style={{ borderTop: '1px solid #eee', padding: '0.5rem', display: 'flex' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask me something..."
                            style={{ flex: 1, border: 'none', padding: '0.5rem', outline: 'none' }}
                        />
                        <button type="submit" style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '1.2rem' }}>
                            <FaTelegramPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
