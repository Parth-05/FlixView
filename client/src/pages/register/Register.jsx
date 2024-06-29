import React, { useState, useEffect } from 'react';
import "./style.scss";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from "../../store/authSlice";
import useFetch from '../../hooks/useFetch';
import Img from '../../components/lazyLoadImage/Img';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isLoading = useSelector(state => state.auth.isLoading);
    const error = useSelector(state => state.auth.error);

    const [background, setBackground] = useState("");
    const { url } = useSelector((state) => state.home);
    const { data, loading } = useFetch("/movie/upcoming");

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    // validate email
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // validate password
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };
    
    // handle email change
    const  handleEmailChange = (e) => {
         setEmail(e.target.value);
         setEmailError('');
     }
 
    //  handle password change
     const handlePasswordChange = (e) => {
         setPassword(e.target.value)
         setPasswordError(null);
     }

    //  handle register btn action
    const handleRegister = async (e) => {
        e.preventDefault();
        // check if email is valid
        if (!validateEmail(email)) {
            setEmailError('Invalid email address');
            return;
        }
        // check if password is valid
        if (!validatePassword(password)) {
            // setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
                setPasswordError('Invalid Password');
                return;
        }
        // dispatch register
        await dispatch(register({ name, email, password }));
        if (user) {
            navigate('/');
        }
    }

    useEffect(() => {
        const bg =
            url.backdrop +
            data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
        setBackground(bg);
    }, [data]);


    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]); 

    return (
        <div className='registerContainer'>
                {!loading && (
                <div className="backdrop-img">
                    <Img src={background} />
                </div>
            )}

            <div className='title'>
                <span>Register</span>
            </div>
            <form onSubmit={handleRegister}>
                <div className='registerForm'>
                    <div className='inputFields'>
                        <input type='text' required minLength="3" placeholder='Full Name' onChange={(e) => setName(e.target.value)} />
                        <input type='text' required placeholder='Email' onChange={handleEmailChange} className={emailError ? "mb-5" : ''} />
                        {emailError && <span className='validationError'>Error: {emailError}</span>}
                        <input type='password' required placeholder='Password' onChange={handlePasswordChange} />
                        {passwordError && <span className='validationError'>Error: {passwordError}</span>}
                    </div>
                    <div className='registerButton'>
                        <button>Register</button>
                    </div>
                    {isLoading && <span className='loadingText'>Loading...</span>}
                    {error && <span className='errorText'>Error: {error}</span>}
                    <div className='textContainer'>
                        <span className='text-white'>Already have an account? &nbsp;</span>
                        <Link className='text' to="/login">Login</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register