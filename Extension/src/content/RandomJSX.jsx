import React, { useEffect } from 'react';
import './Panel.css';
import sparkle from "../assets/img/sparkles.svg";
import leetLogo from "../assets/img/LTLOGO.png";
import { useState } from 'react';
import axios from 'axios';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton
} from '@chakra-ui/react';

const topics = [
  { topic: "ALL", index: 1},
  { topic: "Arrays", index: 2 },
  { topic: "Backtracking and Recursion", index: 3 },
  { topic: "Binary Search", index: 4 },
  { topic: "Bit Manipulation", index: 5 },
  { topic: "Divide and Conquer", index: 6 },
  { topic: "Dynamic Programming", index: 7 },
  { topic: "Graphs", index: 8 },
  { topic: "Greedy", index: 9 },
  { topic: "Hashing", index: 10 },
  { topic: "Linked List", index: 11 },
  { topic: "Logic Building and Optimizations", index: 12 },
  { topic: "Map", index: 13 },
  { topic: "Monotonic Structures", index: 14 },
  { topic: "Prefix Sums", index: 15 },
  { topic: "Priority Queues", index: 16 },
  { topic: "Queues", index: 17 },
  { topic: "Range Query", index: 18 },
  { topic: "Sliding Window", index: 19 },
  { topic: "Sorting", index: 20 },
  { topic: "Special Algorithms", index: 21 },
  { topic: "Stack", index: 22 },
  { topic: "Strings", index: 23 },
  { topic: "Trees", index: 24 }
];

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

async function getRandom(token) {
  const RANDOM = "http://localhost:5000/dashboard/get-random";
  let result = [];

  console.log('Inside Fetch Function');

  try {
    console.log('RANDOM API INITIATING!');
    const response = await apiConnector('GET', RANDOM, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log('Call is ended');

    if (response.data.message !== 'Success') {
      throw new Error(response.data.error);
    }

    result = response.data.data;
  } catch (err) {
    return [];
  }

  return result;
}


async function getRandomTopic(token, topic) {
  const RANDOM = "http://localhost:5000/dashboard/get-random-topic?problemTopic=" + topic;
  let result = [];

  console.log('Inside Fetch Function');

  try {
    console.log('RANDOM API INITIATING!');
    const response = await apiConnector('GET', RANDOM, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log('Call is ended');

    if (response.data.message !== 'Success') {
      throw new Error(response.data.error);
    }

    result = response.data.data;
  } catch (err) {
    return [];
  }

  return result;
}


const Random = () => {
  const [topic, setTopic] = useState("ALL");
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState({ status: 0, problem: {}});

  console.log("Inside Random Composer");

  useEffect(() => {
    async function fetchData()
    {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmM5MzY4ODkxMjkxOWE2ZGY2NGQ4NjgiLCJpYXQiOjE3MjQ4NDAwNzB9.UWsXPDwCkPBMiQLbtcHZJBLidaABTDumMbfsibeDtXk";//localStorage.getItem('token');
        try {
          console.log("Beginning Call");
          let result = [];
          if(topic === "ALL")
          {
            result = await getRandom(token);
          }
          else
          {
            result = await getRandomTopic(token, topic);
          }
          console.log("Ending Call");
          console.log(result);
          console.log(result.length)
          if(result.length === 0)
          {
            console.log("NOT SETTING PROBLEM")
            setProblem({...problem, status: 1});
          }
          else
          {
            console.log("SETTING PROBLEM");
            setProblem({problem: result[0], status: 2});
            console.log(problem.status);
          }
          setLoading(false);
        }
      
        catch(err)
        {
          setLoading(1);
        }
    }

    if(popup) {
      fetchData();
    }
  }, [popup, topic]);

  return (
    <div className="container">
      <Popover onClose={() => {setPopup(false)}}>
            <PopoverTrigger>
              <button onClick={()=>{if(popup === false) {setPopup(true)}}}><img src="chrome-extension://jmgegkadbojmamlkpajabahjadkleccc/R.png" style={{ "margin-top": "4px", height: "20px", width: "20px" }}/></button>
            </PopoverTrigger>
            <PopoverContent width="400px"> {/* Adjust the width as needed */}
            <div className="popupContainer">
              <div className="popupHeader">
                <img src={"chrome-extension://jmgegkadbojmamlkpajabahjadkleccc/051f610785d337c22c0e.png"} alt="Tracker Logo" className="popupLogo" />
                <PopoverCloseButton />
              </div>

              <div className="popupData"> 
                
                <div className="popupBody">
                  <div className='flexor'>
                  <p className = "boldText">Select a specific topic:</p>
                  <select
                      className='problemListt' 
                      name='problemTopic'
                      id='problemTopic'
                      placeholder="Select topic of your choice"
                      defaultValue={topic}
                      onChange={(e) => {setTopic(e.target.value)}}
                    >
                      {topics.map(({topic, index}) => (<option>{topic}</option>))}
                    </select> </div>
                  <h1 className="mainText">We think you should <span className="revisit">re-visit</span></h1>
                  {(loading ? (
                    <p href="https://www.leetcode.com" className="popupLink">LOADING!</p>
                  ) : 

                    ((problem.status == 2) ?
                    (<><a href={problem.problem.problemLink} className="popupLink">{problem.problem.problemId + ". " + problem.problem.problemName}</a>
                    <p className="topicLabel">TOPIC: <span className="topicName">{problem.problem.problemTopic}</span></p></>)
                    : (
                      <p href="https://www.leetcode.com" className="popupLink">No Submissions Found!</p>
                    ))
                
                  )}
                </div>

                <img src={"chrome-extension://jmgegkadbojmamlkpajabahjadkleccc/683d1c319b415918eac5.svg"} alt="sparkles" className="sparkle" />
              </div>
            </div>
            </PopoverContent>
          </Popover>
    </div>
  );
};

export default Random;
