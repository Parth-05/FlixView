import React from 'react';
import "./style.scss";
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className='registerContainer'>
            <div className='title'>
                <span>Register</span>
            </div>
            <div className='registerForm'>
                <div className='inputFields'>
                    <input type='text' placeholder='Full Name' />
                    <input type='text' placeholder='Email' />
                    <input type='password' placeholder='Password' />
                </div>
                <div className='registerButton'>
                    <button>Register</button>
                </div>
                <div className='textContainer'>
                    <span className='text-white'>Already have an account? &nbsp;</span>
                    <Link className='text' to="/login">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Register