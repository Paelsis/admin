import React, { createContext, useState, useContext, useEffect } from 'react';
import {serverFetchData} from './services/serverFetch'
import {compareFunc} from './components/EditText'

const initialState = () => {
  return({  
    pageName:'',
    language:'EN',
  })
}

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

