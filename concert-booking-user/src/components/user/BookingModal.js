import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function BookingModal({ concert, onClose, onBookingSuccess }) {
    const [tickets, setTickets] = useState(1);
    const [total, setTotal] = useState(concert.price);
    const [available, setAvailable] = useState(concert.available);
    const user = useSelector((store) => store.auth.user);
    console.log("Redux user:", user); 
    const token = user?.token || localStorage.getItem("token");
    console.log("Token:", token);
  
    useEffect(() => {
        setTotal(concert.price * tickets);
    }, [tickets, concert.price]);

    const handleBooking = async () => {
        if (!user || !token) {
        alert("Please login to book tickets.");
        return;
    }
    
    if (tickets < 1) {
      alert("Enter at least 1 ticket.");
      return;
    }

    if ( 3<tickets){
      alert('maximum 3 no of tickets can be booked');
      return;
    }
    if (tickets > available) {
      alert(`Only ${available} tickets are available.`);
      return;
    }

    if(available === 0){
      alert('No tickets available');
      return;
    }
    
    try {
      const res = await axios.post(
        "http://localhost:5000/api/book_ticket",
        { concertId: concert._id, tickets },
        {
            headers: {
            Authorization: `Bearer ${token}` 
            }
        }
      );
      alert(" Booking successful!");
      setAvailable((prev) => prev - tickets);
      onBookingSuccess(res.data.booking); 

      try {
        await axios.get(
          `http://localhost:5000/api/booking_confirmation/${res.data.booking._id}`
        );
        console.log("Confirmation email sent successfully");
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
      }
      
      onClose();

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Booking failed: ${err.response.data.message}`);
      } else {
        alert("Booking failed! Please try again.");
      }
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Book Ticket</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Concert:</strong> {concert.name}</p>
            <p><strong>Price:</strong> ₹{concert.price}</p>
            <p><strong>Available Tickets:</strong> {available}</p>

            <input
              type="number"
              className="form-control"
              min="1"
              max={available}
              value={tickets}
              onChange={(e) => setTickets(Number(e.target.value))}
            />

            <p className="mt-2"><strong>Total:</strong> ₹{total}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleBooking}>
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
