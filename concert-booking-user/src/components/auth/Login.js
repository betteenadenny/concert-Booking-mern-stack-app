import { useState,useEffect } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUser,removeUser } from "../../store/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import CheckGuest from "./CheckGuest";

function Login() {
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    var [errorMessage, setErrorMessage] = useState('');
    const navigate= useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const isLoggedOut = params.get("loggedOut");
        if (isLoggedOut) {
        dispatch(removeUser());
        }
    }, [location.search])


    function attemptLogin(event) {
        event.preventDefault();
        axios.post('http://localhost:5000/api/login',{
            email:email,
            password:password
        }).then(response=>{
            setErrorMessage('');
            let user = {
                email:email,
                token:response.data.token,
                role:response.data.userRole,
                userId:response.data.userId
            }
            dispatch(setUser(user));
            if(response.data.userRole === 'admin'){
                window.location.href = `http://localhost:5000`
            }else{
                navigate('/concerts');
            }            
        }).catch(error=>{
            if (error.response) {
                const data = error.response.data;
                if (data.message) {
                setErrorMessage(data.message);
                } else if (data.errors) {
                setErrorMessage(data.errors.join(' '));
                } else {
                setErrorMessage('Something went wrong. Please try again.');
                }
            } else {
                setErrorMessage('Unable to connect to the server.');
            }
        })
    }

    return <div>
        <Navbar/>
        <div className="container d-flex align-items-center justify-content-center " style={{
            marginTop: '10px',backdropFilter: 'blur(30px)'}}>
            <div className="card-body py-5 px-md-5 ">    
                <div className="row d-flex justify-content-center">
                    <div className="col-6">
                    <h2 className="fw-bold mb-5">Login</h2>
                    {errorMessage?<div className="alert alert-danger">{errorMessage}</div>:''}
                    <form onSubmit={attemptLogin}>
                        <div className="form-outline mb-2">
                            <label htmlFor="email">Email</label>
                            <input type="email"className="form-control" id="email" value={email} 
                            onChange={(event)=>setEmail(event.target.value)}/>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" value={password}
                            onChange={(event)=>setPassword(event.target.value)}/>
                        </div>
                        <div className="form-group ">
                            <button type="submit" className="btn btn-primary btn-block mb-4">Login</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default CheckGuest(Login);


{/* <div className="container">
            <div className="row">
                <div className="col-8 offset-2">
                    <h1>Login</h1>
                    {errorMessage?<div className="alert alert-danger">{errorMessage}</div>:''}
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="text"
                        className="form-control"
                        value={email}
                        onInput={(event)=>setEmail(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password"
                        className="form-control"
                        value={password}
                        onInput={(event)=>setPassword(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary float-right" onClick={attemptLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div> */}