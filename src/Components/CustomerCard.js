import React , {useState} from "react"
import '../STYLES/customerCard.css';
const CustomerCard = ({request,refreshRequest}) => {
    const [action , setAction] = useState(null);
    console.log(request.name.split('/').pop());
    console.log(request);
    const sendEmail = async (emailData) => {
        try{
            const response = await fetch('http://localhost:5000/send-email', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(emailData),
            });

            const result = await response.json();
            console.log("Email sendt" ,result.messageId);
        }catch(error){
            console.log("Error sending email", error);
        }
    }

    const handleAction = async (docId , status) => {
        try {
            const response = await fetch (
                `https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/accountRequest/${docId}?updateMask.fieldPaths=status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        fields: {
                            status: {stringValue: status}
                        }
                    }),
                }
            );

            if(response.ok){
                setAction(status);
                if(status === 'approved'){
                    await moveToCustomersCollection(request,docId);
                    await sendEmail({
                        to : request.fields.email,
                        subject : 'Account Approval',
                        text : 'Your account request has been approved',
                        html : '<p>Your account request has been approved.</p>',
                    });
                    await deleteFromAccountRequest(request,docId);
                    refreshRequest();
                }else if(status === 'rejected'){
                    await sendEmail({
                        to : request.fields.email,
                        subject : 'Account Status',
                        text : 'We regret to inform that your account has been rejected',
                        html : '<p>We regret to inform that your account has been rejected. </p>',
                    });
                    await deleteFromAccountRequest(request,docId);
                    refreshRequest();
                }
            }else{
                console.log('Error updating status');
            }
        }catch(error){
            console.error("Error handling action", error);
        }
    }

    const moveToCustomersCollection = async (request, docId) => {
        console.log(docId);
        const uniqueAccountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        const customerData = {
            fields: {
                name: request.fields.name,
                email: request.fields.email,
                phone: request.fields.phone,
                address: request.fields.address,
                aadharCardUrl : request.fields.aadharCardUrl,
                balance: request.fields.balance,
                accounts:{
                    arrayValue:{
                        values:[
                            {
                                mapValue: {
                                    fields:{
                                        accountNumber : {integerValue: uniqueAccountNumber},
                                        balance: request.fields.balance,
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        };

        try{
            const response = await fetch(
                `https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/customers/${docId}`,
                {
                    method: 'PATCH',
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(customerData),
                }
            );

            if(!response.ok){
                console.log("Error moving data to customer collection");
            }
        }catch(error){
            console.log("Error moving to customer collection" ,error);
        }
    }

    const deleteFromAccountRequest = async (request , docId) => {
        try{
            const response = await fetch (
                `https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/accountRequest/${docId}`,
                {
                    method: 'DELETE',
                }
            );

            if(!response.ok){
                console.log('Error deleting the account Request');
            }
        }catch(error){
            console.log('Error deleting the account Request', error);
        }
    }


    return (
        <div className="customer-card">
        <div className="customer-info">
            <img src={request.fields.passportPicUrl.stringValue} alt="Customer" className="customer-image" />
            <div className="customer-details">
            <h3>{request.fields.name.stringValue}</h3>
            <p><strong>Email:</strong> {request.fields.email.stringValue}</p>
            <p><strong>Phone:</strong> {request.fields.phone.stringValue}</p>
            <p><strong>Address:</strong> {request.fields.address.stringValue}</p>
            <p><strong>Aadhar Card:</strong> 
                <img src={request.fields.aadharCardUrl.stringValue} alt="Aadhar card" className="aadhar-image"/>
            </p>
        </div>
  </div>
  
  <div className="customer-actions">
    <button 
      aria-label="Approve account" 
      onClick={() => handleAction(request.name.split('/').pop(), 'approved')}
    >
      Approve
    </button>
    <button 
      aria-label="Reject account" 
      onClick={() => handleAction(request.name.split('/').pop(), 'rejected')}
    >
      Reject
    </button>
    <button 
      aria-label="Hold account" 
      onClick={() => handleAction(request.name.split('/').pop(), 'held')}
    >
      Hold
    </button>
  </div>

  {action && <p className="status-message">Status: {action}</p>}
</div>

    );
};

export default CustomerCard;