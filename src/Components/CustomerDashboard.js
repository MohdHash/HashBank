// import React, { useContext, useState, useEffect } from "react";
// import { UserContext } from "../utils/UserContext";
// // import "../STYLES/customerDashboard.css";

// const CustomerDashboard = () => {
//   const { user, logout } = useContext(UserContext);
//   const [expandedAccount, setExpandedAccount] = useState(null);
//     console.log(user);
//   // Toggle accordion view
//   const toggleAccordion = (index) => {
//     setExpandedAccount(expandedAccount === index ? null : index);
//   };

//   // Fetch balance for each account
//   const fetchAccountBalance = async (accountNumber) => {
//     // Replace this with actual Firestore API call to get account balance
//     const response = await fetch(
//       `https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/customers/${user.id}/accounts/${accountNumber}`
//     );
//     const data = await response.json();
//     return data.fields.balance.integerValue || data.fields.balance.doubleValue;
//   };

//   useEffect(() => {
//     if (!user) {
//       // Redirect to login if customer is not logged in
//       window.location.href = "/login";
//     }
//   }, [user]);

//   if (!user) return null; // Don't render if customer is not logged in

//   return (
//     <div className="customer-dashboard">
//       <div className="customer-details-card">
//         <h2>Welcome, {user.name}</h2>
//         <p><strong>Email:</strong> {user.email}</p>
//         <p><strong>Phone:</strong> {user.phone}</p>
//         <p><strong>Address:</strong> {user.address}</p>
//         <img src={user.aadharCardUrl} alt="Aadhar Card" className="aadhar-card" />
//       </div>
//         {console.log(user)}
//       <div className="accounts-accordion">
//         {user.accounts.map((account, index) => (
//           <div className="account-accordion-item" key={index}>
//             <div
//               className="account-accordion-header"
//               onClick={() => toggleAccordion(index)}
//             >
//               <span>Account Number: {account.integerValue}</span>
//               <button className="view-balance-btn">
//                 {expandedAccount === index ? "Hide Balance" : "View Balance"} ▼
//               </button>
//             </div>
//             {expandedAccount === index && (
//               <div className="account-accordion-content">
//                 {/* Fetch and display the account balance */}
//                 <p>
//                   <strong>Balance:</strong> {fetchAccountBalance(account.integerValue)}
//                 </p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <button className="logout-btn" onClick={logout}>Logout</button>
//     </div>
//   );
// };

// export default CustomerDashboard;


import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../utils/UserContext';
import '../STYLES/customerDashboard.css'
import { useNavigate } from 'react-router-dom';
const CustomerDashboard = ()=>{
    const {user, logout } = useContext(UserContext);
    const [expandedAccount, setExpandedAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    console.log(user);
  // Toggle accordion view
  const toggleAccordion = (index) => {
    setExpandedAccount(expandedAccount === index ? null : index);
  };
    console.log(user);
    console.log(logout)
    useEffect(() => {
        if (!user) {
          // Simulate loading delay for retrieving user
          setTimeout(() => {
            setLoading(false); // Set loading to false when checking is done
          }, 2000);
        } else {
          setLoading(false); // Set loading to false when user is found
        }
      }, [user]);
    
      if (loading) {
        // Show a loading state until the user is confirmed or null
        return <div>Loading...</div>;
      }
    
      if (!user) {
        // If no user is found after loading, redirect to login
        window.location.href = "/login";
        return null; // Prevent rendering anything else
      }

    return(
    <div className="customer-dashboard">
      <div className="customer-details-card">
        <h2>Welcome, {user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <img src={user.aadharCardUrl} alt="Aadhar Card" className="aadhar-card" />
      </div>
      <div className="accounts-accordion">
        {user.accounts.map((account, index) => (
          <div className="account-accordion-item" key={index}>
            <div
              className="account-accordion-header"
              onClick={() => toggleAccordion(index)}
            >
              <span>Account Number: {account.integerValue}</span>
              <button className="view-balance-btn">
                {expandedAccount === index ? "Hide Balance" : "View Balance"} ▼
              </button>
            </div>
            {expandedAccount === index && (
              <div className="account-accordion-content">
                {/* Fetch and display the account balance */}
                <p>
                  <strong>Balance:</strong>{user.balance}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="action-buttons">
                <button className="loan-btn" onClick={()=>navigate('/loanApply')} >Loan Apply</button>
                <button className="new-account-btn">
                        Create a New Account
                </button>
                <button className="transfer-btn" onClick={()=>navigate('/transfer')} >Transfer Money</button>
                <button className='out-transfer' onClick={()=> navigate('/othertransfer')} >Other banks</button>
       </div>

      {/* <button className="logout-btn" onClick={logout}>Logout</button> */}
    </div>
  );
}

export default CustomerDashboard;