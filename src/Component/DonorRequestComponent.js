import React from 'react'
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../Styles/BloodRequest.css';
function DonorRequestComponent() {
    const [donor, setDonor] = useState([]);
    const serverref = useRef();
    useEffect(() => {
        axios.get(`https://localhost:7089/api/ViewAccountRequest/GetAccountDetailsPendingDonor`).then((response) => {
            setDonor(response.data);
            console.log(donor);
            console.log(response);
        })
    }, [donor])
    const handleApprove = (id) => {
        const message = {
            id: id,
            status: true
        }
        console.log(message);
        axios.post(`https://localhost:7089/api/ApproveOrRejectAccountByAdmin`, message).then((response) => {

            if (response.data.changeStatus) {
                console.log("success");
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Successfully Approved"
               
                axios.get(`https://localhost:7089/api/ViewAccountRequest/GetAccountDetailsPendingDonor`).then((response) => {
                    setDonor(response.data);
                    console.log(donor);
                    console.log(response);
                })
            } else if (!response.data.valid) {
                console.log("invalidemail");
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Cannot sent mail (Invalid email / low network connection)"
          
            } else {
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Approval is failed"
             
                console.log("failure");
            }
            setTimeout(() => {
                serverref.current.innerText = ""
                serverref.current.style.visibility = "hidden"
            }, 2000);
        })


    }
    const handleReject = (id) => {
        const message = {
            id: id,
            status: false
        }
        console.log(message);

        axios.post(`https://localhost:7089/api/ApproveOrRejectAccountByAdmin`, message).then((response) => {

            if (response.data.changeStatus) {
                console.log("success");
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Successfully Rejected"
                
                axios.get(`https://localhost:7089/api/ViewAccountRequest/GetAccountDetailsPendingDonor`).then((response) => {
                    setDonor(response.data);
                    console.log(donor);
                    console.log(response);
                })

            } else if (!response.data.valid) {
                console.log("invalidemail");
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Cannot sent mail (Invalid email / low network connection)"
         
            } else {
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Rejection is failed"
              
                console.log("failure");
            }
            setTimeout(() => {
                serverref.current.innerText = ""
                serverref.current.style.visibility = "hidden"
            }, 2000);
        })
    }
    return (
        <div className='mainadmin mainbg '>
            <h2 className='mt-3 ms-3'>Donor Request</h2>
            <div class="alert alert-info registerservererr" style={{ "marginTop": "-5vh" }} ref={serverref} role="alert"></div>

            <hr />
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Donor Name</th>
                            <th scope="col">Blood Type</th>
                            <th scope="col">Age</th>
                            <th scope="col">Contact</th>
                            <th scope="col">Location</th>
                            <th scope="col">Address</th>
                            <th scope="col">Approval Status</th>
                        </tr>
                    </thead>
                    <tbody className='bg-transparent rowbody'>
                        {donor.map((data) => (
                            <tr className='bg-transparent'>
                                <th scope="row">{data.account.name}</th>
                                <th scope="row">{data.userDetails.bloodType}</th>
                                <th scope="row">{data.userDetails.age}</th>
                                <td scope="row">{data.account.email}<br />{data.account.phoneNumber}</td>
                                <th scope="row">{data.userDetails.location}</th>
                                <th scope="row">{data.address.doorNo}, {data.address.street},<br /> {data.address.area},<br /> {data.address.area},<br /> {data.address.city},<br /> {data.address.state}-{data.address.postalCode}</th>

                                {data.account.status == 0 && <td>
                                    <button className='btn btn-success' onClick={() => { handleApprove(data.account.accountId) }}>Approve</button>
                                    <button className='btn btn-danger ' onClick={() => { handleReject(data.account.accountId) }}>Reject</button>
                                </td>}


                            </tr>
                        )

                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DonorRequestComponent