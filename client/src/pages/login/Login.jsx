import React, { useState, useEffect } from 'react';
import "./style.scss";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector  } from 'react-redux';
import { authenticateUser, clearError } from "../../store/authSlice";
import useFetch from '../../hooks/useFetch';
import Img from '../../components/lazyLoadImage/Img';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isLoading = useSelector(state => state.auth.isLoading);
    const error = useSelector(state => state.auth.error);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [background, setBackground] = useState("");
    const { url } = useSelector((state) => state.home);
    const { data, loading } = useFetch("/movie/upcoming");

    const handleLogin = async (e) => {
        e.preventDefault();
        await dispatch(authenticateUser({ email, password }));
        if (user) {
            navigate("/");
        }
    };

    const navigateToRegister = () => {
        if (error){
            dispatch(clearError());
        }
        navigate("/register");
    }

    useEffect(() => {
        const bg =
            url.backdrop +
            data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
        setBackground(bg);
    }, [data]);

    // Using useEffect to handle post-login actions based on user state
    useEffect(() => {
        if (user) {
            navigate("/"); // Navigate when user state updates to a logged-in state
        }
    }, [user, navigate]); // Depend on user and navigate to re-run the effect


    return (
        <div className='loginContainer'>
        {!loading && (
                <div className="backdrop-img">
                    <Img src={background} />
                </div>
            )}

            <div className='title'>
                <span>Login</span>
            </div>
            <form onSubmit={handleLogin}>
                <div className='loginForm'>
                    <div className='inputFields'>
                        <input type='text' required placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                        <input type='password' required placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className='loginButton'>
                        <button type='submit'>Login</button>
                    </div>
                        {isLoading && <span className='loadingText'>Loading...</span>}
                        {error && <span className='errorText'>Error: {error}</span>}
                    <div className='textContainer'>
                        <span className='text' onClick={navigateToRegister}>New user? Create account</span>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login