import React from 'react'
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../Styles/BloodRequest.css';

function HospitalRequestComponent() {
    const [hospital, setHospital] = useState([]);
    const serverref = useRef();

    useEffect(() => {
        axios.get(`https://localhost:7089/api/ViewAccountRequest/GetAccountDetailsPendingHospital`).then((response) => {
            setHospital(response.data);
            console.log(hospital);
            console.log(response);
        })
    }, [hospital])
    const handleApprove = (id) => {
        const message = {
            id: id,
            status: true
        }
        console.log(message)
        axios.post(`https://localhost:7089/api/ApproveOrRejectAccountByAdmin`, message).then((response) => {

            if (response.data.changeStatus) {
                console.log("success");
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Successfully Approved"
               
                axios.get(`https://localhost:7089/api/ViewAccountRequest/GetAccountDetailsPendingHospital`).then((response) => {
                    setHospital(response.data);
                    console.log(hospital);
                    console.log(response);
                })

            } else if (!response.data.valid) {
                console.log("invalidemail");
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Cannot sent mail (Invalid email / low network connection)"
          
            } else {
                console.log("failure");
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Approval is failed"
             
            }
            setTimeout(() => {
                serverref.current.innerText=""
                serverref.current.style.visibility="hidden"
            }, 2000);
        })
      

    }
    const handleReject = (id) => {
        const message = {
            id: id,
            status: false
        }
        axios.post(`https://localhost:7089/api/ApproveOrRejectAccountByAdmin`, message).then((response) => {
            
            if (response.data.changeStatus) {
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Successfully Rejected"
                axios.get(`https://localhost:7089/api/ViewAccountRequest/GetAccountDetailsPendingHospital`).then((response) => {
                    setHospital(response.data);
                    console.log(hospital);
                    console.log(response);
                })
                console.log("success");
            } else if (!response.data.valid) {
                console.log("invalidemail");
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Cannot sent mail (Invalid email / low network connection)"
         
            }else{
                serverref.current.style.visibility="visible"
                serverref.current.innerText="Rejection is failed"
              
                console.log("failure");
            }
            setTimeout(() => {
                serverref.current.innerText=""
                serverref.current.style.visibility="hidden"
            }, 2000);
        })

    }
    return (
        <div className='mainadmin mainbg '>
            <h2 className='mt-3 ms-3'>Hospital Request</h2>
            <div class="alert alert-info registerservererr" style={{ "marginTop": "-5vh" }} ref={serverref} role="alert"></div>

            <hr />
            <section className='tablebody'>
                <table className="table" style={{ "overflow": "auto" }}>
                    <thead>
                        <tr>
                            <th scope="col">Hospital Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Mobile Number</th>
                            <th scope="col">Government Id</th>
                            <th scope="col">Document</th>
                            <th scope="col">Address Details</th>
                            <th scope="col">Location</th>
                            <th scope="col">Approval</th>


                        </tr>
                    </thead>
                    <tbody className='bg-transparent rowbody'>
                        {hospital.map((data) => (
                            <tr className='bg-transparent'>
                                <th scope="row">{data.name}</th>
                                <th scope="row">{data.email}</th>
                                <th scope="row">{data.phoneNumber}</th>
                                <th scope="row">{data.governmentId}</th>
                                <th scope="row"><img src={"data:image/png;base64," + data.document} className='document' width="100px" /></th>
                                <th scope="row">{data.doorNo}, {data.street},<br /> {data.area},<br /> {data.area},<br /> {data.city},<br /> {data.state}-{data.postalCode}</th>
                                <th scope="row">{data.location}</th>
                                {data.status == 0 && <td>
                                    <button className='btn btn-success' onClick={() => { handleApprove(data.id) }}>Approve</button>
                                    <button className='btn btn-danger ' onClick={() => { handleReject(data.id) }}>Reject</button>
                                </td>}




                            </tr>
                        )

                        )}
                    </tbody>
                </table>
            </section>


        </div>
    )
}

export default HospitalRequestComponent