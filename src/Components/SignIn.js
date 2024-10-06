import React, { useState } from'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../utils/firebaseconfig.js';
import '../STYLES/signIn.css';
import { useNavigate } from 'react-router-dom';
const SignIn = ()=>{
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("User signed in successfully");
            navigate('/customerDashboard');
        } catch (error) {
            console.error('Error signing in:', error);
        }
        setEmail('');
        setPassword('');
    }

    return(
        <div className='sign-in-container'>
            <div className='sign-in-form-wrapper'>
                <h2 className="sign-in-title">Welcome Back!</h2>
                <form className='sign-in-form' onSubmit={handleSubmit}>
                    <div className='input-wrapper'>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="input-field"
                        />
                    </div>
                    <div className="input-wrapper">
                        <input 
                        type="password" 
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="input-field"
                        />
                   </div>
                   <button type="submit" className="submit-btn">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;