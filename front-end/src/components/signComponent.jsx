import React from 'react';
import { useState, useEffect } from 'react';
const SignComponent = (props) => {
  const fields = {
    SIGN_IN: ['email', 'password'],
    SIGN_UP: ['username', 'email', 'password', 'confirmPassword'],
    FORGOT_PASSWORD: ['email'],
    RESET_PASSWORD: ['newPassword', 'confirmNewPassword'],
  };
  
  const [formFields, setFormFields] = useState(fields[props.type] || []);

  useEffect(() => {
    setFormFields(fields[props.type] || []);
  }, [props.type]);

  return (
    <div className='sign-component'>
      {formFields.map((field) => (
        <input key={field} type="text" placeholder={field} />
      ))}
      <button>{props.type === 'SIGN_UP' ? 'Sign Up' : 'Sign In'}</button>
    </div>
  );
};

export default SignComponent;