import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from 'components/Login';
import Main from 'components/Main';
import NotFound from 'components/NotFound';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thoughts from 'reducers/thoughts';
import user from 'reducers/user';
import { AppContainer } from 'components/styled/RegLog.styled';

const reducer = combineReducers({
  user: user.reducer,
  thoughts: thoughts.reducer,
});

const store = configureStore({ reducer });

export const App = () => {
  return (
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/' element={<Main />}></Route>
            <Route path='*' element={<NotFound />}></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </AppContainer>
  );
};
