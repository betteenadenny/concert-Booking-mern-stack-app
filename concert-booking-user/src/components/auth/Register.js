import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import CheckGuest from "./CheckGuest";

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    function registerUser(event){
        event.preventDefault();
        const user = {
            name: name,
            email: email,
            password: password,
            password_confirmation: passwordConf
        }
        axios.post('http://localhost:5000/api/register',user).then(response=>{
            setErrorMessage('');
            navigate('/login');
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
                    <h2 className="fw-bold mb-5">Register now</h2>
                    {errorMessage?<div className="alert alert-danger">{errorMessage}</div>:''}
                    <form onSubmit={registerUser}>
                        <div className="form-outline mb-2">
                            <label htmlFor="name">Name</label>
                            <input type="text"className="form-control" id="name" value={name} 
                            onChange={(event)=>setName(event.target.value)}/>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" value={email}
                            onChange={(event)=>setEmail(event.target.value)}/>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" value={password}
                            onChange={(event)=>setPassword(event.target.value)} />
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="passwordConf">Confirm Password</label>
                            <input type="password" className="form-control" id="passwordConf" value={passwordConf}
                            onChange={(event)=>setPasswordConf(event.target.value)}/>
                        </div>
                        <div className="form-group ">
                            <button type="submit" className="btn btn-primary btn-block mb-4">Register</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default CheckGuest(Register);


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