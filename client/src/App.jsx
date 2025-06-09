import React, { useState , useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import apiClient from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  // console.log("when refreshing chat page" , isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/auth" />;
};


const AuthRoute = ({children}) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/profile" /> : children;
};

export default function App() {


  const [loading , setLoading] = useState(true);
  const [error , setError] = useState("");

  const {userInfo , setUserInfo} = useAppStore();

  const getUserData = async () => {
    try{
      setLoading(true);
      const response = await apiClient.get(GET_USER_INFO , 
        {withCredentials : true},
      );
      if(response.status === 200 && response.data.user.id){
        setUserInfo(response.data.user);
      }
      else{
        setUserInfo(undefined);
      }

      // console.log("response from app page" ,response);
    }
    catch(error){
      console.log(error);
      setError(error);
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    if(!userInfo) {
      getUserData();
    }
    else setLoading(false);
  } , [userInfo]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}