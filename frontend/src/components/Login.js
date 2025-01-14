import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from 'utils/utils';
import user from 'reducers/user';
import { Button } from './styled/Buttons.styled';
import { RadioContainer, StyledForm } from './styled/RegLog.styled';

const Login = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((store) => store.user.accessToken);
  const errorMessage = useSelector((store) => store.user.error);

  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken]);

  const onFormSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    };

    fetch(API_URL(mode), options)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(user.actions.setUsername(data.response.username));
          dispatch(user.actions.setUserId(data.response.id));
          dispatch(user.actions.setAccessToken(data.response.accessToken));
          dispatch(user.actions.setError(null));
        } else {
          dispatch(user.actions.setUsername(null));
          dispatch(user.actions.setUserId(null));
          dispatch(user.actions.setAccessToken(null));
          dispatch(user.actions.setError(data.response));
        }
      });
  };

  return (
    <>
      <RadioContainer>
        <label htmlFor='register'>
          Register
          <input
            type='radio'
            id='register'
            checked={mode === 'register'}
            onChange={() => setMode('register')}
          />
        </label>
        <label htmlFor='login'>
          Log in
          <input
            type='radio'
            id='login'
            checked={mode === 'login'}
            onChange={() => setMode('login')}
          />
        </label>
      </RadioContainer>
      <StyledForm onSubmit={onFormSubmit}>
        <fieldset>
          <legend>
            <label htmlFor='username'>Username</label>
          </legend>
          <input
            type='text'
            id='username'
            value={username}
            onChange={(event) => setUserName(event.target.value)}
            placeholder='Your Username'
            required
          />
        </fieldset>
        
        {mode === 'register' && 
        <fieldset>
          <legend>
            <label htmlFor='email'>E-mail</label>
          </legend>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder='john.doe@example.com'
            required
          />
        </fieldset>}
        
        <fieldset>
          <legend>
            <label htmlFor='password'>Password</label>
          </legend>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder='••••••••'
            required
          />
        </fieldset>
        <div>
          <Button type='submit'>
            {mode === 'register' ? 'Register' : 'Log in'}
          </Button>
        </div>
      </StyledForm>
      {errorMessage && <p>{errorMessage}</p>}
    </>
  );
};

export default Login;
