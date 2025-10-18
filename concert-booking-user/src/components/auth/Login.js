import { useState,useEffect } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUser } from "../../store/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import CheckGuest from "./CheckGuest";
import { removeUser } from "../../store/authSlice";

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


    function attemptLogin() {
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
        if(response.data.userRole == 'admin'){
            window.location.href = `http://localhost:5000?token=${response.data.token}`
        }else{
            navigate('/concerts');
        }
        

    }).catch(error=>{
        if(error.response.data.errors){
            setErrorMessage(Object.values(error.response.data.errors).join(' '))
        }else if(error.response.data.message){
            setErrorMessage(error.response.data.message)
        }else{
            setErrorMessage('Failed to login user. Please contact admin')
        }
    })
    }

    return (<div>
        <Navbar/>
        <div className="container">
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
        </div>
    </div>)
}

export default CheckGuest(Login);