import React , {useState , useEffect} from 'react';
import CustomerCard from './CustomerCard';
import '../STYLES/adminDashboard.css'
const AdminDashboard = () => {

    const [accountRequest , setAccountRequest] = useState([]);

    const fetchAccountRequest = async () => {
        try{
            const response = await fetch (
                 'https://firestore.googleapis.com/v1/projects/hashbankk2/databases/(default)/documents/accountRequest'
            );
            if(response.ok){
                const data = await response.json();
                setAccountRequest(data.documents);
            }else{
                console.error("Failed to fetch account request");
            }
        }catch (error){
            console.error("Error fetching the account request:" , error);
        }
    };

    const refreshRequest = () => {
        fetchAccountRequest();
    }

    useEffect(()=> {
        fetchAccountRequest();
    },[]);

    console.log(accountRequest);

    return (
        <div className='customer-dashboard'>
            <h2>Customer Account Requests</h2>
            <div className='customer-cards'>
                {accountRequest != null && accountRequest.map((request) => (
                    <CustomerCard request={request} key={request.name.split('/').pop()} refreshRequest={refreshRequest}/>
                ))}
            </div>
        </div>
    )
}

export default AdminDashboard;