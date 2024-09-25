'use client'
import { Provider } from 'react-redux';
import { store } from './store';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <div>{children}</div>
    </Provider>
  );
};

export default Layout;