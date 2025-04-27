import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const AuthForm = ({ mode }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here, connect to your backend API
    console.log(`${mode === 'signin' ? 'Signing in' : 'Signing up'} with`, email, password);

    // Dummy navigation after login/signup
    navigate('/');
  };

  return (
    <div className="card-border lg:min-w-[566px]">
    <div className="flex flex-col card gap-6 py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
            <img src="/academia-1293362.svg" alt="logo" height={100} width={100} className='invert' />
            <h2 className='text-primary-100'>AlumniConnect</h2>
        </div>

        <h3 className='text-light-100'>Get connected with us</h3>

    <form onSubmit={handleSubmit} className="w-full space-y-6 mt-4 form">
      
        <label htmlFor="email" className='label'>Email</label>
        <div>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='input w-full'
        />
        </div>
        
        <label htmlFor="password" className='label'>Password</label>
        <div>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='input w-full'
        />
        </div>
       

      <button type="submit" className="w-full !bg-primary-200 !text-dark-100 hover:!bg-primary-200/80 !rounded-full !min-h-10 !font-bold !px-5 cursor-pointer;">
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </button>

      {mode === 'signin' ? (
        <p className="text-center">
          Don't have an account? <a href="/signup" className="font-bold text-user-primary ml-1">Sign Up</a>
        </p>
      ) : (
        <p className="text-center">
          Already have an account? <a href="/signin" className="font-bold text-user-primary ml-1">Sign In</a>
        </p>
      )}
    </form>
    </div>
    </div>
  );
};

export default AuthForm;
