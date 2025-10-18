import {  useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export const CheckAuth = (WrappedComponent) => {
    function Wrapper(props){
        let user = useSelector(store => store.auth.user);
        let navigate = useNavigate();
        useEffect(() => {
            if(!user){
                navigate('/login');
            }
        },[user]);
        return <WrappedComponent {...props}/>;
    }
    return Wrapper;
}

export default CheckAuth;