import React from 'react';
import AuthForm from '../components/AuthForm';

const SignUp = () => {
  return (
    <div className="auth-layout">
      <AuthForm mode="signin" />
    </div>
  );
};

export default SignUp;