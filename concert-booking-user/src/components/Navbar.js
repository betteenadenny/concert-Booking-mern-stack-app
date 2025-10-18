import { useDispatch,useSelector } from "react-redux";
import { NavLink,useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";

function Navbar() {
  let user = useSelector(store=> store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function logout() {
    dispatch(removeUser());
    navigate('/login')
  }
  const userId = user?.userId;
  // console.log("userId from Redux:", userId);
  return (
    <nav className="navbar navbar-expand-sm" style={{ backgroundColor: "#70c1fbff" }} data-bs-theme="light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Concert Booking App</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>

            {!user && (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
              </>
            )}
            
            {user && (
              <>
                <li className="nav-item">
                  <NavLink to="/concerts" className="nav-link">Concerts</NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to={`/mybookings/${userId}` }className="nav-link">My Booking</NavLink>
                </li>

                <li className="nav-item">
                  <span className="nav-link" onClick={logout} style={{ cursor: 'pointer' }}>Logout</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
