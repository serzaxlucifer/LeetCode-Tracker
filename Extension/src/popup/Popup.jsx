import React, { useEffect } from 'react';
import logo from '../assets/img/LTLOGO.png';
import './Popup.css';
import { useState } from 'react';
import axios from 'axios';

const axiosInstance = axios.create();
const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};

async function getValue(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function(result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
}

function requestToken() {
  return new Promise((resolve, reject) => {
    console.log("Creating call to background scripts");
    chrome.runtime.sendMessage({ action: 'getToken' }, function(response) {
      console.log("Submission received from background");
      if (response.error) {
        console.log(response.error);
        reject(response.error); // Reject with error message
      } else {
        resolve(response.token); // Resolve with the token
      }
    });
  });
}

async function loginAndGetToken() 
{
  console.log("Requesting token");
  const token = await requestToken();
  console.log("token = ", token);
  return token;
}


const Popup = () => {
  console.log("Rendering Popup!");
  const [page, setPage] = useState("WELCOME");
  const [status, setStatus] = useState(false);
  console.log(status);
  const [logging, setLogging] = useState(false);
  console.log(logging);
  const [properties, setProperties] = useState({token: "", FN: "", LN: "", LC: ""});

  const fetchUserData = (async() => {

    const GET_USER_DETAILS_API = await getValue('userRoute');
    let result = [];

    try {
      
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${await getValue('token')}`,
      });
      if (response.data.message !== "Success") {
        throw new Error(response.data.error);
      }
      result = response.data.data;
      chrome.storage.local.set({ user: {firstName: result.firstName, lastName: result.lastName, uName: result.leetcodeId}
      });
      setProperties((prevData) => ({...prevData, FN: result.firstName, LN: result.lastName, LC: result.leetcodeId}));

    } catch (err) {
      console.log("Failed to fetch, ", err);
    }
  });

  const logoutHandler = (() => {
    chrome.storage.local.set({ token: false, extension: false, logging: false, user: {uName: "", firstName: "", lastName: ""} });
    setProperties({token: "", FN: "", LN: "", LC: ""});
  });

  const loginHandler = (async () => {
    try {
      console.log("Invoking login handler");
      const result = await loginAndGetToken();
      if(result !== null)
      {
        chrome.storage.local.set({ token: result, extension: true, logging: true });
        setProperties({token: result, FN: "", LN: "", LC: ""});
        fetchUserData();
      }
      else
      {
        alert("Please login with the Dashboard!");
      }
    }
    catch(err) {
      alert(err);
    }
  });

  useEffect(async () => {
      const e = await getValue('extension'), l = await getValue('logging'), t = await getValue('token'), u = await getValue('user');
      setStatus(e);
      setLogging(l);
      setProperties({token: t, FN: u?.firstName, LN: u?.lastName, LC: u?.uName});
      await fetchUserData();
  }, []);


  return (
    <div className="App">
      {(page === "WELCOME") ?
        (<header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <div className={(properties.token) ? ("Hi") : ("Hi NotSignedIn")}><img src={"chrome-extension://" + chrome.runtime.id + "/051f610785d337c22c0e.png"}></img>
          <hr/></div>
          <div>
            <h2>Welcome!</h2>
          </div>
  
          {(properties.token) && (<p className="User"> {`${properties.FN} ${properties.LN}`} </p>)}
          {(properties.token) && (<p className="User Leet"> <strong>Regd. LeetCode ID: {properties.LC} </strong></p>)}
          {(properties.token ? (<div className='Returner'><button onClick={() => {setPage("SETTINGS")}} className='Sider'>Settings</button><button onClick={logoutHandler}>Logout</button></div>) : (<div className="login"><button onClick={loginHandler}>Login/Sign Up</button></div>))}

          <footer onClick={() => {
            window.open('https://leetcode-tracker.pages.dev/', '_blank', 'noopener,noreferrer');}}><strong>Visit Dashboard</strong></footer>
        </header>) 
        :
        (
        <div className="MainSettings">
          <header className="App-header">
            <div className="Head">
            <p onClick={() => {setPage("WELCOME")}} className="Back"> {"<Back"} </p>
          <div className="Hi"><img className="SecondMedia" src={"chrome-extension://" + chrome.runtime.id + "/051f610785d337c22c0e.png"}></img>
          </div></div>
          <hr/>
          <div className="SettingsContainer">
            <h3 className='p2'>Settings</h3>
            <p className='p1'>Automatic Submission Logging</p>
            <label className="switch checker1">
              <input checked={logging} onChange={(e) => {setLogging(e.target.checked); chrome.storage.local.set({ logging: e.target.checked});}} type="checkbox"/>
              <span className="slider round"></span>
            </label>
            <p className='p3'>Switch {(status) ? ("Off") : ("On")} Extension</p>
            <label className="switch checker2">
              <input checked={status} onChange={(e) => {setStatus(e.target.checked); chrome.storage.local.set({ extension: e.target.checked});}} type="checkbox"/>
              <span className="slider round"></span>
            </label>
          </div>
          
        </header> </div>)
      }
    </div>
  );
};

export default Popup;
