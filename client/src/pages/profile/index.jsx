import { useAppStore } from '@/store'
import { Avatar } from '../../components/ui/avatar';
import React, { useEffect, useRef, useState } from 'react'
import {IoArrowBack} from "react-icons/io5"
import { colors, getColor } from '@/lib/utils';
import {FaPlus , FaTrash} from "react-icons/fa"
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { ADD_PROFILE_IMAGE, HOST, REMOVE_PROFILE_IMAGE, UPDATE_PROFILE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { AvatarImage } from '@radix-ui/react-avatar';

const Profile = () => {

  const {userInfo , setUserInfo} = useAppStore();
  const [firstName , setFirstName] = useState("");
  const [lastName , setLastName] = useState("");
  const [image , setImage] = useState(null);
  const [selectedColor , setSelectedColor] = useState(0);
  const [hovered , setHovered] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }

    if(userInfo.image){
     setImage(`${HOST}/${userInfo.image}`);
    }
  } , [userInfo]);


  const navigate = useNavigate();

  const validateProfile = () => {
    if(!firstName){
      toast.error("First Name is required!");
      return false;
    }
    if(!lastName){
      toast.error("Last Name is required!");
      return false;
    }
    return true;
  }

  const saveChanges = async () => {
    if(validateProfile()){
      try{
        const response = await apiClient.post(
          UPDATE_PROFILE , 
          {firstName , lastName , color : selectedColor},
          {withCredentials : true}
        );

        if(response.status === 200 && response.data){
          setUserInfo({...response.data});
          toast.success("Profile updated successfully!");
        }
      }
      catch(error){
        toast.error("Some error occured while updating profile !");
      }
    }
  };

  const handleNavigate  = () => {
    if(userInfo.profileSetup){
      navigate('/chat');
    }
    else{
      toast.error("Please complete the profile set up!")
    }
  }

  const handleInputImageClick = () => {
    fileInputRef.current.click();
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    if(file){
      const formData = new FormData();
      formData.append("profile-image" , file);
      
      const response = await apiClient.post(ADD_PROFILE_IMAGE , 
        formData , 
        {withCredentials : true}
      );

      console.log("response for image -->" , response);

      if(response.status === 200 && response.data.image){
        setUserInfo({...userInfo , image : response.data.image});
        toast.success("Image updated successfully !");
      }
    }
  };

  const handleDeleteImage = async () => {
    try{
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE , 
        {withCredentials : true}
      );
      if(response.status === 200){
        setUserInfo({...userInfo , image : null});
        toast.success("Image removed successfully !");
        setImage(null);
      }
    }
    catch(error){
      toast.error("Some error occured while deleting image !");
    }
  };


  return (
    <div className = "bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className = "flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick = {handleNavigate}>
          <IoArrowBack className = "text-4xl lg:text-6xl text-white/90 cursor-pointer"/>
        </div>
        <div className = "grid grid-cols-2">
          <div className = "h-full w-32 md:w-48 relative flex items-center justify-center"
           onMouseEnter = {() => setHovered(true)}
           onMouseLeave = {() => setHovered(false)}
          >
           <Avatar className = "h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
            {
              image ? (
                <AvatarImage src = {image} alt = "profile" 
                  className = "object-cover w-full h-full bg-black"/>
              ) : (
                <div className = {`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full text-white ${getColor(selectedColor)}`}>
                  {
                    firstName ? 
                    firstName.split("").shift() : 
                         /* split(""): Converts the string into an array of characters
                         shift(): Gets the first element of the array (the first letter). */
                    userInfo.email.split("").shift()
                  }
                </div>
              )
            }
           </Avatar>
             {hovered && (
               <div className = "absolute h-32 w-32 md:h-48 md:w-48  flex items-center justify-center  bg-black/50 ring-fuchsia-50  rounded-full cursor-pointer"
                onClick = {image ? handleDeleteImage : handleInputImageClick}
               >
                {
                 image ? <FaTrash className = "text-white text-3xl cursor-pointer"/>  : <FaPlus className = "text-white text-3xl cursor-pointer"/>
                }
               </div>) 
              }
              <input
                type = "file"
                ref = {fileInputRef}
                className = "hidden"
                onChange = {handleImageChange}
                name = "profile-image"
                accept = ".png , .svg , .jpg , .jpeg , .webp"
              />
          </div>
          <div className = "flex flex-col min-w-32 md:min-w-64 gap-5 text-white items-center justify-center">
          <div className='w-full'>
               <input
                 placeholder = "Email"
                 type = "email"
                 disabled
                 value = {userInfo.email}
                 className = "rounded-lg border-none p-6 bg-[#2c2e3b] outline-none"
               />
            </div>
            <div className='w-full'>
               <input
                 placeholder = "First Name"
                 type = "text"
                 value = {firstName}
                 onChange = {(e) => setFirstName(e.target.value)}
                 className = "rounded-lg border-none p-6 bg-[#2c2e3b] outline-none"
               />
            </div>
            <div className='w-full'>
               <input
                 placeholder = "Last Name"
                 type = "text"
                 value = {lastName}
                 onChange = {(e) => setLastName(e.target.value)}
                 className = "rounded-lg border-none p-6 bg-[#2c2e3b] outline-none"
               />
            </div>
            <div className='w-full flex gap-5'>
              {colors.map((color , index) => (
                <div className = {`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ? "outline outline-white/50 outline-1" : ""}`} 
                  key = {index}
                  onClick = {(e) => setSelectedColor(index)}
                >
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className = "w-full">
         <Button className = "h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
           onClick = {saveChanges}
         >
          Save
         </Button>
        </div>
      </div>

    </div>
  )
}

export default Profile