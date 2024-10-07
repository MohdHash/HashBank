import React, { useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../utils/UserContext';

const TransferMoney = () => {
    const {user} = useContext(UserContext);
    const uid = user?.id;
    const [senderAccount, setSenderAccount] = useState('');
    const [recipientAccount, setRecipientAccount] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [isSelfTransfer, setIsSelfTransfer] = useState(true); // Toggle between self-transfer or others

    const handleTransfer = async () => {
        if (isSelfTransfer) {
            await transferBetweenAccounts(uid, senderAccount, recipientAccount, amount);
        } else {
            await transferToOtherCustomer(uid, senderAccount, amount, recipientPhone, recipientAccount);
        }
    };

    const transferBetweenAccounts = async (uid, senderAccount, recipientAccount, amount) => {
        try {
            const response = await fetch(`https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/customers/${uid}`);
            const customerData = await response.json(); 

            const accounts = customerData.fields.accounts.arrayValue.values;
            const sender = accounts.find(account => account.mapValue.fields.accountNumber.integerValue === senderAccount);
            const recipient = accounts.find(account => account.mapValue.fields.accountNumber.integerValue === recipientAccount);

            if (parseInt(sender.mapValue.fields.balance.integerValue) < amount) {
                toast.error('Insufficient balance', { autoClose: 2000 });
                return;
            }

            sender.mapValue.fields.balance.integerValue = parseInt(sender.mapValue.fields.balance.integerValue) - amount;
            recipient.mapValue.fields.balance.integerValue = parseInt(recipient.mapValue.fields.balance.integerValue) + amount;

            await fetch(`https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/customers/${uid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        accounts: {
                            arrayValue: {
                                values: accounts
                            }
                        }
                    }
                })
            });

            toast.success('Self-transfer successful!', { autoClose: 2000 });
        } catch (error) {
            toast.error('Transfer failed. Please try again.', { autoClose: 2000 });
        }
    };

    const transferToOtherCustomer = async (uid, senderAccount, amount, recipientPhone = null, recipientAccount = null) => {
        try {
            // Fetch sender data
            const responseSender = await fetch(`https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/customers/${uid}`);
            const senderData = await responseSender.json();
            const senderAccounts = senderData.fields.accounts.arrayValue.values;
            const sender = senderAccounts.find(account => account.mapValue.fields.accountNumber.integerValue === senderAccount);
    
            // Check for sufficient balance
            if (parseInt(sender.mapValue.fields.balance.integerValue) < amount) {
                toast.error('Insufficient balance', { autoClose: 2000 });
                return;
            }
    
            let recipientResponse;
            if (recipientPhone) {
                // Query to find the customer by phone number
                recipientResponse = await fetch(`https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents:runQuery`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        structuredQuery: {
                            from: [{ collectionId: 'customers' }],
                            where: {
                                fieldFilter: {
                                    field: { fieldPath: 'phone' },
                                    op: 'EQUAL',
                                    value: { stringValue: recipientPhone }
                                }
                            }
                        }
                    })
                });
            } else if (recipientAccount) {
                // Query to find the customer by account number
                recipientResponse = await fetch(`https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents:runQuery`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        structuredQuery: {
                            from: [{ collectionId: 'customers' }],
                            where: {
                                compositeFilter: {
                                    op: 'AND',
                                    filters: [
                                        {
                                            fieldFilter: {
                                                field: { fieldPath: 'accounts.accountNumber' },
                                                op: 'EQUAL',
                                                value: { integerValue: recipientAccount }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    })
                });
            }
    
            // Parse the recipient data
            const recipientData = await recipientResponse.json();
            if (!recipientData.length || !recipientData[0].document) {
                toast.error('Recipient not found', { autoClose: 2000 });
                return;
            }
    
            const recipientAccounts = recipientData[0].document.fields.accounts.arrayValue.values;
            const recipient = recipientAccounts.find(account => account.mapValue.fields.accountNumber.integerValue === recipientAccount || recipientPhone);
    
            // Update balances
            sender.mapValue.fields.balance.integerValue = parseInt(sender.mapValue.fields.balance.integerValue) - amount;
            recipient.mapValue.fields.balance.integerValue = parseInt(recipient.mapValue.fields.balance.integerValue) + parseInt(amount);
    
        // Update the sender's balance
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

// Update the recipient's balance
const recipientId = recipientData[0].document.name.split('/').pop();
await fetch(`https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/customers/${recipientId}?updateMask.fieldPaths=accounts`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        fields: {
            accounts: {
                arrayValue: {
                    values: recipientAccounts
                }
            }
        }
    })
});


    
            // Success notification
            toast.success('Transfer successful!', { autoClose: 2000 });
        } catch (error) {
            // Error notification
            toast.error('Transfer failed. Please try again.', { autoClose: 2000 });
        }
    };
    
    return (
        <Container>
            <ToastContainer />
            <Title>Transfer Money</Title>

            <Label>Sender Account Number</Label>
            <Input type="number" value={senderAccount} onChange={e => setSenderAccount(e.target.value)} placeholder="Enter your account number" />

            {isSelfTransfer ? (
                <>
                    <Label>Recipient Account Number (Self-Transfer)</Label>
                    <Input type="number" value={recipientAccount} onChange={e => setRecipientAccount(e.target.value)} placeholder="Enter recipient account number" />
                </>
            ) : (
                <>
                    <Label>Recipient Phone Number</Label>
                    <Input type="text" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} placeholder="Enter recipient phone number" />
                    <Label>Recipient Account Number</Label>
                    <Input type="number" value={recipientAccount} onChange={e => setRecipientAccount(e.target.value)} placeholder="Enter recipient account number" />
                </>
            )}

            <Label>Amount</Label>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />

            <Switch onClick={() => setIsSelfTransfer(!isSelfTransfer)}>
                {isSelfTransfer ? 'Switch to Bank Transfer' : 'Switch to Self-Transfer'}
            </Switch>

            <Button onClick={handleTransfer}>Send Money</Button>
        </Container>
    );
};

// Styling and Animations
const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
    width: 400px;
    margin: 50px auto;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: ${fadeIn} 1s ease-in-out;
`;

const Title = styled.h2`
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
`;

const Label = styled.label`
    margin: 10px 0 5px;
    font-size: 14px;
    color: #666;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease-in-out;
    
    &:focus {
        border-color: #4CAF50;
    }
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
        background-color: #45a049;
    }
`;

const Switch = styled.button`
    margin-bottom: 15px;
    font-size: 14px;
    color: #007BFF;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
        color: #0056b3;
    }
`;

export default TransferMoney;
