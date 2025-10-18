import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function QRCode({ bookingData }) {
  const pdfRef = useRef();

  if (!bookingData) return null;

  const qrValue = JSON.stringify({
    bookingId: bookingData._id,
    concert: bookingData.concert?.name,
    venue: bookingData.concert?.venue,
    tickets: bookingData.tickets,
    totalPrice: bookingData.totalPrice,
    bookingDate: bookingData.bookingDate,
  });

  const downloadPDF = async () => {
    const element = pdfRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    pdf.save(`Booking_${bookingData._id}.pdf`);
  };

  return (
    <div className="text-center p-3">
      <div
        ref={pdfRef}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          border: "2px solid #007bff",
          borderRadius: "15px",
          backgroundColor: "#f8f9fa",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {/* Left Side: Booking Details */}
        <div style={{ textAlign: "left", flex: 1, paddingRight: "10px" }}>
          <h3 style={{ color: "#007bff", marginBottom: "10px" }}>
            🎫 {bookingData.concert?.name}
          </h3>
          <p><strong>Booking ID:</strong> {bookingData._id}</p>
          <p><strong>Venue:</strong> {bookingData.concert?.venue}</p>
          <p><strong>Date:</strong> {new Date(bookingData.bookingDate).toLocaleDateString()}</p>
          <p><strong>Tickets:</strong> {bookingData.tickets}</p>
          <p><strong>Total Price:</strong> ₹{bookingData.totalPrice || "0"}</p>
          <p style={{ marginTop: "15px", fontSize: "0.8rem", color: "#555" }}>
            Thank you for booking with us!
          </p>
        </div>

        <div style={{ textAlign: "center", flex: "0 0 180px" }}>
          <QRCodeCanvas
            value={qrValue}
            size={150}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
          />
        </div>
      </div>
      
      <div className="mt-3">
        <button onClick={downloadPDF} className="btn btn-sm btn-primary">
          📄 Download Ticket (PDF)
        </button>
      </div>
    </div>
  );
}

export default QRCode;
