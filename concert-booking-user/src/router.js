import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import DisplayConcerts from "./components/user/DisplayConcerts";
import ConcertDetails from "./components/user/ConcertDetails";
import MyBookings from "./components/user/MyBooking";


const router = createBrowserRouter([
    { path: '/', element: <App/> },
    {path:'/register',element:<Register/>},
    {path:'/login',element:<Login/>},
    {path:'/concerts',element:<DisplayConcerts/>},
    {path:'/concerts/:id',element:<ConcertDetails/>},
    {path:'/mybookings/:id',element:<MyBookings/>},
    
]);

export default router;