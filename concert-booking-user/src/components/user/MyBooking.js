import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import CheckAuth from "../auth/CheckAuth";
import QRCode from "./QRCode";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const user = useSelector((store) => store.auth.user);
  const userId = user?.userId;
  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:5000/api/retrieve_booking/${userId}`)
      .then((res) => {
        console.log("Booking API response:", res.data);
        setBookings(res.data.data);
    })
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <>
    <Navbar/>
    <div className="container mt-5">
      <h3 className="text-center mb-4">🎟️ My Bookings</h3>

      {bookings.length === 0 ? (
        <div className="text-center">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="row">
          {bookings.map((b, index) => (
            <div className="mb-4" key={index}>
              <div className="card shadow-sm h-100 border-0">
                <QRCode bookingData={b}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default CheckAuth(MyBookings);
