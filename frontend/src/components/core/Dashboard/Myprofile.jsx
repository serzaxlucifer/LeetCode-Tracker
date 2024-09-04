import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import  CButton from "../homepage/CButton";
import  Profile from "./Profile";
import  Stats from "./Stats";
import  ComStats from "./ComStats";
import  Settings from "./Settings"
import { useEffect } from "react";
import ConfirmationModel from '../../common/ConfirmationModel';
import ConfirmationModel2 from '../../common/ConfirmationModel2';
import { getUser } from "../../../services/operation/profileAPI"

const Myprofile = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmationModel, setConfirmationModel] = useState(null);
  const [c2, setc2] = useState(null);
  const [ page, setPage ] = useState("1");

  useEffect( () => {
    dispatch(getUser(token));
  }, []);

  return (
    <div className=" w-11/12 flex flex-col items-center mx-auto">
      <h1 className="mb-8 mt-8 sm:mb-10 text-center text-5xl font-medium text-black-5">Dashboard</h1>
      <div className="flex w-11/12 justify-center rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 sm:px-12">
        <div className="flex items-center gap-x-5">
          <CButton id="1" setter={setPage} active="true">Profile</CButton>
          <CButton id="2" setter={setPage} active="true">My Statistics</CButton>
          <CButton id="3" setter={setPage} active="true">Community Statistics</CButton>
          <CButton id="4" setter={setPage} active="true">Settings</CButton>
        </div>
      </div>

      { /* CONDITIONAL CODE */ }

      <div className="w-11/12">

      {page === "1" && (<Profile/>)}
      {page === "2" && (<Stats setConfirmationModel={setc2}/>)}
      {page == "3" && (<ComStats/>)}
      {page == "4" && (<Settings setConfirmationModel={setConfirmationModel}/>)} 
      </div>
      {confirmationModel && <ConfirmationModel modelData={confirmationModel} />} 
      {c2 && <ConfirmationModel2 modelData={c2} />}
    </div>
  )
}

export default Myprofile