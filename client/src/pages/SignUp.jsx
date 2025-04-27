import React from 'react';
import AuthForm from '../components/AuthForm';

const SignUp = () => {
  return (
    <div className="auth-layout">
      <AuthForm mode="signup" />
    </div>
  );
};

export default SignUp;