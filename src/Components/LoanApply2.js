import React, { useState, useContext, useEffect } from 'react';
import { storage } from '../utils/firebaseconfig.js';
import { UserContext } from '../utils/UserContext.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../STYLES/loanApply.css';

const LoanApply2 = () => {
  const [selectedLoanType, setSelectedLoanType] = useState(null);
  const [selectedTenure, setSelectedTenure] = useState('');
  const [interestRate, setInterestRate] = useState(null);
  
  const { user } = useContext(UserContext);
  const [bankAccountNumber, setBankAccountNumber] = useState(user.accounts[0]);
  console.log(user);
  const [formData, setFormData] = useState({
    fields: {
      fullName: { stringValue: user?.name || '' },
      dob: { stringValue: '' },
      contactNumber: { stringValue: user?.phone || '' },
      email: { stringValue: user?.email || '' },
      loanAmount: { integerValue: '' },
      loanTenure: { integerValue: '' },
      interestRate: { integerValue: '' },
      employmentStatus: { stringValue: 'Employed' },
      monthlyIncome: { integerValue: '' },
      bankAccountNumber: { stringValue: bankAccountNumber },
      ifscCode: { stringValue: '' },
      bankName: { stringValue: '' },
      collateralType: { stringValue: '' },
      collateralValue: { integerValue: '' },
      uploadAadhar: { stringValue: null },
      incomeProof: { stringValue: null }
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

      for (const key of ['uploadAadhar', 'incomeProof']) {
        if (formData.fields[key]?.fileValue) {
          const fileRef = ref(storage, `loanDocuments/${userId}/${formData.fields[key].fileValue.name}`); // Correct way to create a reference
          const uploadTaskSnapshot = await uploadBytes(fileRef, formData.fields[key].fileValue); // Upload the file
          const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref); // Get the download URL
          uploadPromises.push(downloadURL); // Push the URL to the promises array
        } else {
          uploadPromises.push(null); // Push null if no file is provided
        }
      }

      // Use Promise.all to wait for all uploads to complete
      const [aadharURL, incomeProofURL] = await Promise.all(uploadPromises);

      // Prepare the loan application data for submission
      const loanApplicationData = {
        fields: {
          fullName: { stringValue: formData.fields.fullName.stringValue },
          dob: { stringValue: formData.fields.dob.stringValue },
          contactNumber: { stringValue: formData.fields.contactNumber.stringValue },
          email: { stringValue: formData.fields.email.stringValue },
          loanAmount: { integerValue: formData.fields.loanAmount.integerValue },
          loanTenure: { integerValue: formData.fields.loanTenure.integerValue || 3},
          interestRate: { integerValue: interestRate || 0 }, // Use selected interest rate
          employmentStatus: { stringValue: formData.fields.employmentStatus.stringValue },
          monthlyIncome: { integerValue: formData.fields.monthlyIncome.integerValue },
          bankAccountNumber: { stringValue: formData.fields.bankAccountNumber.stringValue },
          ifscCode: { stringValue: formData.fields.ifscCode.stringValue },
          bankName: { stringValue: formData.fields.bankName.stringValue },
          collateralType: { stringValue: formData.fields.collateralType.stringValue },
          collateralValue: { integerValue: formData.fields.collateralValue.integerValue },
          uploadAadhar: { stringValue: aadharURL },
          incomeProof: { stringValue: incomeProofURL }
        }
      };

      console.log(loanApplicationData);

      // Submit loan application data to Firestore
      const response = await fetch(`https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/loanRequest/${userId}`,
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

      toast('Loan application submitted successfully!');

      // Reset form after submission
      setFormData({
        fields: {
          fullName: { stringValue: user?.name || '' },
          dob: { stringValue: '' },
          contactNumber: { stringValue: user?.phone || '' },
          email: { stringValue: user?.email || '' },
          loanAmount: { integerValue: '' },
          loanTenure: { integerValue: '2' },
          interestRate: { integerValue: '' },
          employmentStatus: { stringValue: 'Employed' },
          monthlyIncome: { integerValue: '' },
          bankAccountNumber: { stringValue: bankAccountNumber || '' },
          ifscCode: { stringValue: '' },
          bankName: { stringValue: '' },
          collateralType: { stringValue: '' },
          collateralValue: { integerValue: '' },
          uploadAadhar: { stringValue: null },
          incomeProof: { stringValue: null }
        }
      });
      setSelectedLoanType(null);
      setInterestRate(null);
      setSelectedTenure('');
    } catch (error) {
      console.error('Error submitting loan application:', error);
      toast('Error submitting loan application. Please try again.');
    }
  };

//   const generateUniqueAccountNumber = async () => {
//     let isUnique = false;
//     let accountNumber;
  
//     while (!isUnique) {
//       // Generate a 10-digit random account number
//       accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  
//       try {
//         // Make a POST request to Firestore to check if the account number exists
//         const response = await fetch(
//           `https://firestore.googleapis.com/v1/projects/hashbank-96ff2/databases/(default)/documents:runQuery`, 
//           {
//             method: 'POST', 
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               structuredQuery: {
//                 from: [{ collectionId: "loanRequest" }], // Your Firestore collection
//                 where: {
//                   fieldFilter: {
//                     field: { fieldPath: "bankAccountNumber" }, // The field to check
//                     op: "EQUAL", // Comparison operation
//                     value: { stringValue: accountNumber } // The generated account number to check
//                   }
//                 },
//                 limit: 1 // Limit the result to 1 record for efficiency
//               }
//             })
//           }
//         );
  
//         const data = await response.json();
  
//         // If no matching document is found, the array should be empty, meaning it's unique
//         if (data.length === 0) {
//           isUnique = true; // The account number is unique
//         }
  
//       } catch (error) {
//         console.error('Error checking account number uniqueness:', error);
//         // Handle errors like network issues or Firestore service being unavailable
//         break; // Break the loop if there are network issues to avoid infinite loops
//       }
//     }
  
//     return accountNumber; // Return the unique account number
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accountNumber = await generateUniqueAccountNumber();
//         setBankAccountNumber(accountNumber);
//       } catch (error) {
//         console.error("Error generating account number:", error);
//       }
//     };
//     fetchData();
//   }, []);

  const loanTypes = ['Personal Loan', 'Home Loan', 'Educational Loan', 'Car Loan'];


  let loanTenures = [];
  if (selectedLoanType === 'Home Loan') {
    loanTenures = ['5 Years', '10 Years', '15 Years', '20 Years'];
  } else {
    loanTenures = ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years'];
  }

  console.log(bankAccountNumber);
  return (
    <div className='loan-apply-container'>
      <h2>Apply for a Loan</h2>

      <div className="loan-type-buttons">
        {loanTypes.map((loan, index) => (
          <button key={index} onClick={() => setSelectedLoanType(loan)}>
            {loan}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            type='text' 
            name='fullName'
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date of Birth:
          <input
            type='date'
            name='dob'
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Contact Number:
          <input
            type='tel'
            name='contactNumber'
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Loan Amount:
          <input
            type='number'
            name='loanAmount'
            value={formData.loanAmount}
            onChange={handleChange}
            required
          />
        </label>
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
        <label>
          Employment Status:
          <select
            name='employmentStatus'
            value={formData.employmentStatus}
            onChange={handleChange}
            required
          >
            <option value='Employed'>Employed</option>
            <option value='Unemployed'>Unemployed</option>
            <option value='Self-Employed'>Self-Employed</option>
          </select>
        </label>
        <label>
          Monthly Income:
          <input
            type='number'
            name='monthlyIncome'
            value={formData.monthlyIncome}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="bankAccountNumber">Bank Account Number:</label>
            <input
              type="text"
              id="bankAccountNumber"
              name="bankAccountNumber"
              value={bankAccountNumber}
              onChange={handleChange}
              required
            />
        <label>
          IFSC Code:
          <input
            type='text'
            name='ifscCode'
            value={formData.ifscCode}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Bank Name:
          <input
            type='text'
            name='bankName'
            value={formData.bankName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Collateral Type:
          <input
            type='text'
            name='collateralType'
            value={formData.collateralType}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Collateral Value:
          <input
            type='number'
            name='collateralValue'
            value={formData.collateralValue}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Upload Aadhar:
          <input
            type='file'
            name='uploadAadhar'
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Upload Income Proof:
          <input
            type='file'
            name='incomeProof'
            onChange={handleChange}
            required
          />
        </label>
        <button type='submit'>Submit Application</button>
      </form>
    </div>
  );
};

export default LoanApply2;
