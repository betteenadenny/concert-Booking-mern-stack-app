import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";
// import CheckAuth from "../auth/CheckAuth";
import { Link } from "react-router-dom";

function DisplayConcerts() {
    const [concerts, setConcerts] = useState([]);
    console.log(concerts)
        useEffect(() => {
            fetchConcerts();
        }, []);

    const fetchConcerts = async () => {
        try {
        const response = await axios.get("http://localhost:5000/api/retrieve_concert");
        setConcerts(response.data.data);
        // console.log(response.data.data);
        } catch (error) {
        console.error("Error fetching concerts:", error);
        }
    };

    return (
        <>
        <Navbar />
        <div className="container mt-4">
            <h2 className="text-center mb-4"> Upcoming Concerts</h2>
            <div className="row">
            {concerts.length > 0 ? (
                concerts.map((concert) => (
                <div key={concert.id} className="col-md-2 mb-4">
                    <Link to={`/concerts/${concert.id}`}>
                    <div className="card h-100 shadow-sm">
                    <img
                        src={`data:image/png;base64,${concert.image}`}
                        className="card-img-top"
                        alt={concert.name}
                        style={{ height: "250px", objectFit: "cover" }}
                        />
                    <div className="card-body">
                        <h5 className="card-title">{concert.name }</h5>
                        <p className="card-text">Date : {concert.date}</p>
                    </div>
                    </div>
                    </Link>
                </div>
                ))
            ) : (
                <p className="text-center">No concerts available</p>
            )}
            </div>
        </div>
        </>
    );
    }

// export default CheckAuth(DisplayConcerts);
export default DisplayConcerts;

