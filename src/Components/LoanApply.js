import React, { useState, useContext,useEffect } from 'react';
import { storage } from '../utils/firebaseconfig.js';
import { UserContext } from '../utils/UserContext.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../STYLES/loanApply.css';

const LoanApply = () => {
  const [selectedLoanType, setSelectedLoanType] = useState(null);
  const [selectedTenure, setSelectedTenure] = useState('');
  const [interestRate, setInterestRate] = useState(null);
  const [bankAccountNumber , setBankAccountNumber] = useState(null);
  const { user } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    fields: {
      fullName: { stringValue: user?.name || '' },
      dob: { stringValue: '' },
      address: { stringValue: user?.address || '' },
      contactNumber: { stringValue: user?.phone || '' },
      email: { stringValue: user?.email || '' },
      loanAmount: { integerValue: '' },
      loanTenure: { integerValue: '' },
      interestRate: { integerValue: '' },
      employmentStatus: { stringValue: 'Employed' },
      monthlyIncome: { integerValue: '' },
      bankAccountNumber: { stringValue: bankAccountNumber || '' },
      ifscCode: { stringValue: '' },
      bankName: { stringValue: '' },
      collateralType: { stringValue: '' },
      collateralValue: { integerValue: '' },
      uploadAadhar: { stringValue: null },
      incomeProof: { stringValue: null },
      addressProof: { stringValue: null },
      bankStatement: { stringValue: null }
    }
  });
  
  const interestRates = {
    'Personal Loan': {
      '1 Year': 10,
      '2 Years': 10.5,
      '3 Years': 11,
      '4 Years': 11.5,
      '5 Years': 12,
    },
    'Home Loan': {
      '5 Years': 8,
      '10 Years': 8.5,
      '15 Years': 9,
      '20 Years': 9.5,
    },
    'Educational Loan': {
      '1 Year': 8.5,
      '2 Years': 9,
      '3 Years': 9.5,
    },
    'Car Loan': {
      '1 Year': 9,
      '2 Years': 9.5,
      '3 Years': 10,
    },
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    
    setFormData((prev) => {
      const updatedFields = { ...prev.fields };
  
      if (files) {
        updatedFields[name] = { fileValue: files[0] };
      } else if (type === 'number') {
        updatedFields[name] = { integerValue: value };
      } else {
        updatedFields[name] = { stringValue: value };
      }
  
      return { ...prev, fields: updatedFields };
    });
  };
  

  const handleLoanTypeChange = (loanType) => {
    setSelectedLoanType(loanType);
    setInterestRate(null); // Reset interest rate when loan type changes
  };

  const handleTenureChange = (e) => {
    const tenure = e.target.value;
    setSelectedTenure(tenure);

    // Set interest rate based on selected loan type and tenure
    if (selectedLoanType && interestRates[selectedLoanType]) {
      setInterestRate(interestRates[selectedLoanType][tenure] || null);
    } else {
      setInterestRate(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = user.id; // Get current user ID from user context

      // Upload files to Firebase Storage and get their URLs
      const uploadPromises = [];

  for (const key of ['uploadAadhar', 'incomeProof', 'addressProof', 'bankStatement']) {
    if (formData[key]) {
      const fileRef = ref(storage, `loanDocuments/${userId}/${formData[key].name}`); // Correct way to create a reference
      const uploadTaskSnapshot = await uploadBytes(fileRef, formData[key]); // Upload the file
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref); // Get the download URL
      uploadPromises.push(downloadURL); // Push the URL to the promises array
    } else {
      uploadPromises.push(null); // Push null if no file is provided
    }
  }

  // Use Promise.all to wait for all uploads to complete
  const [aadharURL, incomeProofURL, addressProofURL, bankStatementURL] = await Promise.all(uploadPromises);

  // Prepare the loan application data for submission
  const loanApplicationData = {
    fields: {
      fullName: { stringValue: formData.fields.fullName.stringValue },
      dob: { stringValue: formData.fields.dob.stringValue },
      address: { stringValue: formData.fields.address.stringValue },
      contactNumber: { stringValue: formData.fields.contactNumber.stringValue },
      email: { stringValue: formData.fields.email.stringValue },
      loanAmount: { integerValue: formData.fields.loanAmount.integerValue },
      loanTenure: { integerValue: formData.fields.loanTenure.integerValue },
      interestRate: { integerValue: formData.fields.interestRate.integerValue },
      employmentStatus: { stringValue: formData.fields.employmentStatus.stringValue },
      monthlyIncome: { integerValue: formData.fields.monthlyIncome.integerValue },
      bankAccountNumber: { stringValue: formData.fields.bankAccountNumber.stringValue },
      ifscCode: { stringValue: formData.fields.ifscCode.stringValue },
      bankName: { stringValue: formData.fields.bankName.stringValue },
      collateralType: { stringValue: formData.fields.collateralType.stringValue },
      collateralValue: { integerValue: formData.fields.collateralValue.integerValue },
      uploadAadhar: { stringValue: aadharURL },
      incomeProof: { stringValue: incomeProofURL },
      addressProof: { stringValue: addressProofURL },
      bankStatement: { stringValue: bankStatementURL },
    }
  };
  


      // Submit loan application data to Firestore
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/hashbank-96ff2/databases/(default)/documents/loanRequest/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loanApplicationData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit loan application');
      }

      alert('Loan application submitted successfully!');

      // Reset form after submission
      setFormData({
        fields: {
          fullName: { stringValue: user?.name || '' },
          dob: { stringValue: '' },
          address: { stringValue: user?.address || '' },
          contactNumber: { stringValue: user?.phone || '' },
          email: { stringValue: user?.email || '' },
          loanAmount: { integerValue: '' },
          loanTenure: { integerValue: '' },
          interestRate: { integerValue: '' },
          employmentStatus: { stringValue: 'Employed' },
          monthlyIncome: { integerValue: '' },
          bankAccountNumber: { stringValue: bankAccountNumber || '' },
          ifscCode: { stringValue: '' },
          bankName: { stringValue: '' },
          collateralType: { stringValue: '' },
          collateralValue: { integerValue: '' },
          uploadAadhar: { stringValue: null },
          incomeProof: { stringValue: null },
          addressProof: { stringValue: null },
          bankStatement: { stringValue: null }
        }
      });
      setSelectedLoanType(null);
      setInterestRate(null);
      setSelectedTenure('');
    } catch (error) {
      console.error('Error submitting loan application:', error);
      alert('Error submitting loan application. Please try again.');
    }
  };

  const generateUniqueAccountNumber = async () => {
    let isUnique = false;
    let accountNumber;
  
    while (!isUnique) {
      accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Generate a 10-digit number
  
      // Fetch loanRequests from Firestore using AJAX
      const response = await fetch(
        `https://firestore.googleapis.com/v1/projects/hashbank-96ff2/databases/(default)/documents:runQuery`, 
        {
          method: 'POST', // Use POST method
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            structuredQuery: {
              from: [{ collectionId: "loanRequest" }], // Replace with your collection name
              where: {
                fieldFilter: {
                  field: { fieldPath: "bankAccountNumber" }, // Specify the field
                  op: "EQUAL", // Operation
                  value: { stringValue: accountNumber } // Value to compare
                }
              }
            }
          })
        }
      );
      
  
      if (response.ok) {
        const data = await response.json();
        
        // Check if the collection exists and if it contains any documents
        if (data.documents) {
          isUnique = data.documents.length === 0; // If no documents are found, the account number is unique
        } else {
          console.warn('No documents found or the collection does not exist. Using the generated account number.');
          isUnique = true; // Collection does not exist or is empty; consider the account number unique
        }
      } else {
        console.error('Error fetching data:', response.statusText);
        break; // Exit the loop if there's an error
      }
    }
  
    return accountNumber;
  };
  
  useEffect(() => {
    const fetchUniqueAccountNumber = async () => {
      try {
        const uniqueAccountNumber = await generateUniqueAccountNumber();
        setBankAccountNumber(uniqueAccountNumber); // Set the generated account number
      } catch (error) {
        console.error('Error fetching unique account number:', error);
      }
    };
  
    fetchUniqueAccountNumber(); // Call the function to fetch the unique account number
  }, []); // Empty dependency array to run once on mount
  

  const loanTypes = ['Personal Loan', 'Home Loan', 'Educational Loan', 'Car Loan'];

  let loanTenures = [];
  if (selectedLoanType === 'Home Loan') {
    loanTenures = ['5 Years', '10 Years', '15 Years', '20 Years'];
  } else {
    loanTenures = ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years'];
  }

  return (
    <div className="loan-apply-container">
      <h2>Apply for a Loan</h2>
      <div className="loan-type-buttons">
        {loanTypes.map((loan, index) => (
          <button key={index} onClick={() => setSelectedLoanType(loan)}>
            {loan}
          </button>
        ))}
      </div>

      {selectedLoanType && (
        <div className="loan-form-container">
          <h3>{selectedLoanType} Application Form</h3>
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={user.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />

            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={user.address}
              onChange={handleChange}
              required
            />

            <label htmlFor="contactNumber">Contact Number:</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={user.phone}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />

            {/* Loan Details */}
            <label htmlFor="loanAmount">Loan Amount:</label>
            <input
              type="number"
              id="loanAmount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              required
            />

            <label htmlFor="loanTenure">Loan Tenure:</label>
            <select
              id="loanTenure"
              name="loanTenure"
              value={selectedTenure}
              onChange={handleTenureChange}
              required
            >
              <option value="">Select Tenure</option>
              {loanTenures.map((tenure, index) => (
                <option key={index} value={tenure}>
                  {tenure}
                </option>
              ))}
            </select>

            {interestRate !== null && (
              <div>
                <label htmlFor="interestRate">Interest Rate:</label>
                <input
                  type="text"
                  id="interestRate"
                  name="interestRate"
                  value={`${interestRate}%`}
                  readOnly
                />
              </div>
            )}

            {/* Employment Details */}
            <label htmlFor="employmentStatus">Employment Status:</label>
            <select
              id="employmentStatus"
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleChange}
            >
              <option value="Employed">Employed</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Student">Student</option>
            </select>

            <label htmlFor="monthlyIncome">Monthly Income:</label>
            <input
              type="number"
              id="monthlyIncome"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              required
            />

            {/* Bank Details */}
            <label htmlFor="bankAccountNumber">Bank Account Number:</label>
            <input
              type="text"
              id="bankAccountNumber"
              name="bankAccountNumber"
              value={bankAccountNumber}
              onChange={handleChange}
              required
            />

            <label htmlFor="bankName">Bank Name:</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={'HashBank'}
              onChange={handleChange}
              required
            />

            <label htmlFor="ifscCode">IFSC Code:</label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={'  hashim1111'}
              onChange={handleChange}
              required
            />

            {/* Collateral Details */}
            <label htmlFor="collateralType">Collateral Type:</label>
            <input
              type="text"
              id="collateralType"
              name="collateralType"
              value={formData.collateralType}
              onChange={handleChange}
              required
            />

            <label htmlFor="collateralValue">Collateral Value:</label>
            <input
              type="number"
              id="collateralValue"
              name="collateralValue"
              value={formData.collateralValue}
              onChange={handleChange}
              required
            />

            {/* Document Upload */}
            <label htmlFor="uploadAadhar">Aadhar Card:</label>
            <input type="file" id="uploadAadhar" name="uploadAadhar" onChange={handleChange} required />

            <label htmlFor="incomeProof">Income Proof:</label>
            <input type="file" id="incomeProof" name="incomeProof" onChange={handleChange} required />

            <label htmlFor="addressProof">Address Proof:</label>
            <input type="file" id="addressProof" name="addressProof" onChange={handleChange} required />

            <label htmlFor="bankStatement">Bank Statement:</label>
            <input type="file" id="bankStatement" name="bankStatement" onChange={handleChange} required />

            <button type="submit">Submit Loan Application</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoanApply;
