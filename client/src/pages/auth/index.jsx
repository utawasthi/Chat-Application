import React, { useEffect, useState } from 'react'
import Victory from "../../assets/victory-svg.svg"
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const Auth = () => {

  const navigate = useNavigate();
  const {userInfo , setUserInfo} = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const validateSignup = () => {
    if(!email.length){
      toast.error("Invalid Email");
      return false;
    }

    if(!password.length){
      toast.error("Invalid Password");
      return false;
    }

    if(password !== confirmPassword){
      toast.error("Password and Confirm Password must be same !");
      return false;
    }

    return true;
  }

  const validateLogin = () => {
    if(!email.length){
      toast.error("Invalid Email");
      return false;
    }

    if(!password.length){
      toast.error("Invalid Password");
      return false;
    }

    return true;
  }

  const handleSignup = async () => {
  try {
    if (validateSignup()) {
      const response = await apiClient.post(SIGNUP_ROUTE, { email, password });
      
      if(response.status === 201){
        setUserInfo(response.data.user);
        navigate('/profile');
      }
      console.log(response);
    }
  } catch (error) {
    console.error("Signup Error:", error);
    toast.error(error.response?.data?.message || "Sign up failed!");
  }
};

  const handleLogin = async () => {
    if(validateLogin()){
      const response = await apiClient.post(LOGIN_ROUTE , {email , password});
      if(response.data.user.id){
        setUserInfo(response.data.user);
        if(response.data.user.profileSetup) navigate('/chat');
        else navigate('/profile');
      }
      console.log(response);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-white border-2 shadow-2xl text-opacity-90 w-[80vw] md:w-[90vw] lg:w-[60vw] xl:w-[55vw] rounded-3xl flex items-center justify-center">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center ">
              <div className="flex items-center justify-center">
                <h1 className="text-5xl font-bold mb-3 md:text-6xl">Let's Connect</h1>
                <img src={Victory} alt="victory-emogi" className="h-[60px]" />
              </div>
              <p className="font-medium text-center mt-3">
                Fill in the following details to get started !!
              </p>
            </div>
            <div className="flex items-center justify-center w-full mt-5">
              <Tabs className="w-3/4" defaultValue = "login">
                <TabsList className="bg-transparent rounded-none w-full">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-500 p-3 transition-all duration-300"
                  >
                    Log In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-blue-500 p-3 transition-all duration-300"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="flex flex-col gap-5">
                  <input
                    placeholder="Email..."
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-full p-4 outline-none"
                  />
                  <input
                    placeholder="Password..."
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-full p-4 outline-none"
                  />
                  <Button onClick = {handleLogin}>Log In</Button>
                </TabsContent>
                <TabsContent value="signup" className="flex flex-col gap-5">
                  <input
                    placeholder="Email..."
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-full p-4 outline-none"
                  />
                  <input
                    placeholder="Password..."
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-full p-4 outline-none"
                  />
                  <input
                    placeholder="Confirm Password..."
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-full p-4 outline-none"
                  />
                  <Button onClick = {handleSignup}> Sign Up</Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth