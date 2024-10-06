// src/components/Signup.js
import React, { useState, useEffect } from 'react';
import { auth } from '../utils/firebaseconfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { storage } from '../utils/firebaseconfig.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../STYLES/signUp.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    panCard: null,
    aadharCard: null,
    initialBalance: '',
  });

  const [panCardUrl, setPanCardUrl] = useState('');
  const [aadharCardUrl, setAadharCardUrl] = useState('');
  const [passportPicUrl , setPasswordPicUrl] = useState('')
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  // useEffect to clear form after successful signup
  useEffect(() => {
    if (submitted) {
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        password: '',
        panCard: null,
        aadharCard: null,
        initialBalance: '',
      });
    }
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Firebase Authentication: Create user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const userId = userCredential.user.uid;

      // Upload PAN Card
      const panCardRef = ref(storage, `panCards/${formData.panCard.name}`);
      const panCardSnapshot = await uploadBytes(panCardRef, formData.panCard);
      const panCardUrl = await getDownloadURL(panCardSnapshot.ref);
      setPanCardUrl(panCardUrl);

      // Upload Aadhar Card
      const aadharCardRef = ref(storage, `aadharCards/${formData.aadharCard.name}`);
      const aadharCardSnapshot = await uploadBytes(aadharCardRef, formData.aadharCard);
      const aadharCardUrl = await getDownloadURL(aadharCardSnapshot.ref);
      setAadharCardUrl(aadharCardUrl);
      
      const passportPicRef = ref(storage , `passportPic/${formData.PassportPic.name}`);
      const passportPicSnapshot = await uploadBytes(passportPicRef,formData.passportPic);
      const passportPicUrl = await getDownloadURL(passportPicSnapshot.ref);
      setPasswordPicUrl(passportPicUrl);

      // Firestore REST API: Add account request to Firestore using fetch (AJAX)
      await fetch(`https://firestore.googleapis.com/v1/projects/hashbank-96ff2/databases/(default)/documents/accountRequest/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            name: { stringValue: formData.name },
            address: { stringValue: formData.address },
            phone: { stringValue: formData.phone },
            email: { stringValue: formData.email },
            panCardUrl: { stringValue: panCardUrl },
            aadharCardUrl: { stringValue: aadharCardUrl },
            passportPicUrl:{stringValue: passportPicUrl},
            status : { booleanValue : false},
            initialBalance: { integerValue: formData.initialBalance },
          },
        }),
      });

      alert("Signup successful, waiting for admin approval!");
      setSubmitted(true); // trigger useEffect to clear form
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="title">Create an Account</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleInputChange}
          value={formData.name}
          required
          className="input-field"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleInputChange}
          value={formData.address}
          required
          className="input-field"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          onChange={handleInputChange}
          value={formData.phone}
          required
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          value={formData.email}
          required
          className="input-field"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
          value={formData.password}
          required
          className="input-field"
        />
        <label htmlFor="panCard">PAN Card (required):</label>
        <input
          id='panCard'  
          type="file"
          name="panCard"
          onChange={handleFileChange}
          required
          className="file-input"
        />
        <label htmlFor="aadharCard">Aadhar Card (required):</label>
        <input
          id='aadharCard'
          type="file"
          name="aadharCard"
          onChange={handleFileChange}
          required
          className="file-input"
        />
        <label htmlFor="aadharCard">Passport Size Photo (required):</label>
        <input
          id='PassportPic'
          type="file"
          name="PassportPic"
          onChange={handleFileChange}
          required
          className="file-input"
        />
        <input
          type="number"
          name="initialBalance"
          placeholder="Initial Balance"
          onChange={handleInputChange}
          value={formData.initialBalance}
          required
          className="input-field"
        />
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
