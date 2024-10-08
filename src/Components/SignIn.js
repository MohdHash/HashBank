import React, { useState , useContext } from'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../utils/firebaseconfig.js';
import '../STYLES/signIn.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../utils/UserContext.js';
// import { handleLogin } from '../utils/handleLogin.js';

const SignIn = ()=>{
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(UserContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           const response =  await signInWithEmailAndPassword(auth, email, password);
            const {uid} = response?.user;
            if(uid === 'HUaqyPNGwrPBJSnJVIW1qbvmV0v2'){
                navigate('/AdminDashboard');
                return;
            }
            console.log('User signed in:', uid);
            handleLogin(uid);
            toast("User Signed in successfully");
            navigate('/CustomerDashboard');
        } catch (error) {
            toast("Error signing in");
        }
        setEmail('');
        setPassword('');
    }

    const handleLogin = async (uid) => {
        try {
            const response = await fetch(`https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/customers/${uid}`);
        
            if (!response.ok) {
              throw new Error('Failed to fetch customer details');
            }
        
            const data = await response.json();
        
            // Parse Firestore document structure to extract customer fields
            const customerData = {
              id: uid,
              name: data.fields.name.stringValue,
              email: data.fields.email.stringValue,
              phone: data.fields.phone.stringValue,
              address: data.fields.address.stringValue,
              aadharCardUrl: data.fields.aadharCardUrl.stringValue,
              balance: data.fields.accounts.arrayValue.values[0].mapValue.fields.balance.integerValue || data.fields.accounts.arrayValue.values[0].mapValue.fields.balance.doubleValue,
              accounts: data.fields.accounts.arrayValue.values.map(acc => acc.mapValue.fields.accountNumber.integerValue), // array of account numbers
            };
            console.log(customerData);
            // Use the login function from the CustomerContext to store customer details
            
            login(customerData); // Store customer data in context
        
            // Redirect to the dashboard after successful login
          } catch (error) {
            console.error('Error during login:', error.message);
            // alert('Login failed. Please try again.');
            toast('Login failed. Please try again.');
          }
    }

    return(
        <div className='sign-in-container'>
            <div className='sign-in-form-wrapper'>
                <h2 className="sign-in-title">Welcome Back!{location.pathname === '/AdminLogin' ? 'Boss😎' : ''}</h2>
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