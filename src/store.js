import React, { createContext, useState, useEffect, useContext } from 'react';
import {search} from './services/search'

const initialState = {
    pageName:'',
};

const useMyState = () => useState(initialState);

const MyContext = createContext(null);

export const useSharedState = () => {
  const value = useContext(MyContext);
  if (value === null) throw new Error('Please add SharedStateProvider');
  return value;
};

export const SharedStateProvider = ({ children }) => {
  return(
    <MyContext.Provider value={useMyState()}>
      {children}
    </MyContext.Provider>
  )
};

