import React, { useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (error) {
            console.error("Google Login Error", error);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        try {
            if (isRegister) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate('/');
        } catch (error) {
            console.error("Auth Error", error);
            alert(error.message);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '3rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
                <h2>{isRegister ? 'Register' : 'Login'}</h2>
                <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ padding: '0.5rem' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ padding: '0.5rem' }}
                    />
                    <button type="submit" className="btn btn-primary">
                        {isRegister ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div style={{ margin: '1rem 0' }}>OR</div>

                <button onClick={handleGoogleLogin} className="btn btn-secondary" style={{ width: '100%' }}>
                    Continue with Google
                </button>

                <p style={{ marginTop: '1rem', cursor: 'pointer', color: 'blue' }} onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
                </p>
            </div>
        </div>
    );
};

export default Login;
