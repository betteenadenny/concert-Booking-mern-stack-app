import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import BookingModal from "./BookingModal";
import CheckAuth from "../auth/CheckAuth";

function ConcertDetails() {
  const { id } = useParams();
  const [concert, setConcert] = useState(null);
  const [showModal,setShowModal] = useState(false);
  // const [availableticket ,setAvailable]=useState(0)
  // const user = useSelector(store => store.auth.user);

  useEffect(() => {
    fetchConcertDetails();
  }, [showModal]);

  const fetchConcertDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/retrieve_concert/${id}`);
      setConcert(res.data.data);
      // setAvailable(res.data.data.available)
      // console.log(res.data.data.available)
    } catch (err) {
      console.error("Error fetching concert details:", err);
    }
  };

  if (!concert) {
    return <p className="text-center mt-4">Concert not found</p>;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card mx-auto" style={{ width: "60%" }}>
          <img
            src={`data:image/png;base64,${concert.image}`}
            className="card-img-top"
            alt={concert.name}
            style={{ height: "250px", objectFit: "cover" }}
            />
          <div className="card-body">
            <h3 className="card-title">{concert.name}</h3>
            <strong>Date:</strong> {concert.date} <br />
            <strong>Time:</strong> {concert.time} <br />
            <strong>Venue:</strong> {concert.venue} <br />
            <strong>Price:</strong> ₹{concert.price} <br />
            <strong>Available Tickets:</strong> {concert.available}
          </div>
          <button className="btn btn-primary"
          onClick={() => setShowModal(true)}>
            Book now
          </button>
        </div>
      </div>

      {showModal && (
        <BookingModal
          concert={concert}
          onClose={() => setShowModal(false)}
          onBookingSuccess={(booking) => console.log("Booking confirmed:", booking)}
        />
      )}
      
    </>
  );
}

export default CheckAuth(ConcertDetails);
