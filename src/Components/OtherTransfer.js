import React, { useContext, useState,useEffect } from 'react';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../utils/UserContext';
import axios from 'axios'; 
import '../STYLES/otherTransfer.css';

const OtherTransfer = ()=>{
    const {user} = useContext(UserContext);
    const uid = user.id;



    const senderIFSC = 'hashim1111';
    const senderAccountID = user?.accounts?.[0];


    const [receiverAccountID, setReceiverAccountID] = useState('');
    const [receiverIFSC, setReceiverIFSC] = useState('');
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(user?.balance);

    useEffect(() => {
        const interval = setInterval(() => {
          checkIncomingTransactions(senderAccountID, senderIFSC);
        }, 300000); // 5 minutes = 300000ms
        return () => clearInterval(interval); // Cleanup on unmount
      }, [senderAccountID, senderIFSC]);


       // Function to check for incoming transactions
  const checkIncomingTransactions = async (receiverAccountID, receiverIFSC) => {
    try {
      const response = await axios.get(
        `https://firestore.googleapis.com/v1/projects/bank-common-db/databases/(default)/documents/common_db/${receiverIFSC}`
      );
      const transactionArray = response.data.fields[receiverAccountID]?.arrayValue?.values || [];
      
      if (transactionArray.length === 0) {
        toast.info("No new transactions found.");
        return;
      }

      transactionArray.forEach((transaction) => {
        const creditAmount = transaction.mapValue.fields.creditAmount.integerValue;
        const senderName = transaction.mapValue.fields.senderName.stringValue;

        // Update balance with credited amount
        setBalance(prevBalance => prevBalance + parseInt(creditAmount, 10));
        toast.success(`Received ${creditAmount} from ${senderName}`);

        // Clear transaction after processing (you can choose to keep it)
      });
    } catch (error) {
      toast.error("Error checking transactions.");
      console.error(error);
    }
  };

  const handleTransfer = async () => {
    if (parseInt(amount, 10) > balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      // Subtract amount from sender's balance
      setBalance((prevBalance) => prevBalance - parseInt(amount, 10));

      // Transfer the amount to the common Firestore database
      await axios.patch(
        `https://firestore.googleapis.com/v1/projects/bank-common-db/databases/(default)/documents/common_db/${receiverIFSC}`,
        {
          fields: {
            [receiverAccountID]: {
              arrayValue: {
                values: [
                  {
                    mapValue: {
                      fields: {
                        senderAccountID: { stringValue: senderAccountID },
                        senderName: { stringValue: "Hashim" },
                        creditAmount: { integerValue: amount },
                        timestamp: { timestampValue: new Date().toISOString() },
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      );
      await updateMycollection();
      toast.success('Transfer successful');
    } catch (error) {
      toast.error('Transfer failed');
      console.error(error);
    }
  };

  const updateMycollection = async  (balance) =>{
    try{
        const responseSender = await fetch(`https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/customers/${uid}`);
        const senderData = await responseSender.json();
        const senderAccounts = senderData.fields.accounts.arrayValue.values;
        const sender = senderAccounts.find(account => account.mapValue.fields.accountNumber.integerValue === senderAccountID);

        sender.mapValue.fields.balance.integerValue = parseInt(sender.mapValue.fields.balance.integerValue) - amount;

        await fetch(`https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/customers/${uid}?updateMask.fieldPaths=accounts`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    accounts: {
                        arrayValue: {
                            values: senderAccounts
                        }
                    }
                }
            })
        });
    }catch(error){
        console.error(error);
        toast.error('Error updating balance');
    }
  }

  return (
    <div className="dashboard">
      <h2>Welcome to Your Dashboard</h2>
      <div className="balance-card">
        <h3>Your Balance: ₹{balance}</h3>
      </div>

      <div className="transfer-section">
        <h3>Transfer Money</h3>
        <input
          type="text"
          value={receiverAccountID}
          onChange={(e) => setReceiverAccountID(e.target.value)}
          placeholder="Receiver Account ID"
          className="input-field"
        />
        <input
          type="text"
          value={receiverIFSC}
          onChange={(e) => setReceiverIFSC(e.target.value)}
          placeholder="Receiver IFSC Code"
          className="input-field"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="input-field"
        />
        <button onClick={handleTransfer} className="transfer-btn">
          Send Money
        </button>
      </div>
    </div>
  );

}

export default OtherTransfer;