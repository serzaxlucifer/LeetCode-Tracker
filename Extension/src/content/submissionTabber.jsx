import React, { useEffect } from 'react';
import './submissionTabber.css';
import { useState } from 'react';
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'
import { useForm } from 'react-hook-form';


const topics = [
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

async function getSubmission(token, u, id) {
    const RANDOM = "http://localhost:5000/submissions/get-entry";
    let result = [];
  
    console.log('Inside Fetch Function');
  
    try {
      console.log('RANDOM API INITIATING!');
      const response = await apiConnector('GET', RANDOM + `?leetcode_username=${u}&problem_id=${id}`, null, {
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

  async function sendSubmission(token, data) 
  {
    const RANDOM = "http://localhost:5000/submissions/send-entry";
    let result = [];
  
    console.log('Inside Send Function');
    console.log("SUBMISSION, ", data);
  
    try {
      console.log('RANDOM API INITIATING!');
      const response = await apiConnector('PUT', RANDOM, JSON.stringify(data),
      {
        "Content-Type": "application/json",
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


const Submission = ({token, data, PROBLEM}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [popup, setPopup] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm();
    const userName = PROBLEM.userName;
    const problem = {problemName: PROBLEM.name, problemID: PROBLEM.ID, problemTopic: data.problemTopic, problemLink: PROBLEM.link, learning: data.learning, code: data.code, markForRevisit: +data.markForRevisit};
    const [revisit, setRevisit] = useState(problem.markForRevisit); 

    const submitForm = async (formData) => {
        console.log(formData);
        if(formData.learning != problem.learning || formData.code != problem.learning || formData.markForRevisit != problem.markForRevisit || formData.problemTopic != problem.problemTopic)      // otherwise no need to put load on backend.
        {
          await sendSubmission(token, {leetcode_username: userName, problem_id: problem.problemID, problemName: problem.problemName, problem_link: problem.problemLink, problem_topic: formData.problemTopic, learning: formData.learning, code: formData.code, markForRevisit: formData.markForRevisit});
          onClose();
        }
    };

    console.log("Inside Random Composer");

  return (
    <div className="containerr">
    <button onClick={()=>{if(popup === false) {setPopup(true); onOpen();}}}><img src="chrome-extension://jmgegkadbojmamlkpajabahjadkleccc/sword.png" style={{ "margin-top": "4px", height: "20px", width: "20px" }}/></button>
      <ChakraProvider>
        <Modal className="mainMOD" isOpen={isOpen} onClose={() => {setPopup(false);}}>
        <ModalOverlay />
          <ModalContent maxW="90%" w="1200px" maxH="600px" h="auto">

            <div className="wrapperr">
              <div className="maincontentt">
              <form onSubmit={handleSubmit(submitForm)}>
                <div className='navbarr'>
                  <img src="chrome-extension://jmgegkadbojmamlkpajabahjadkleccc/051f610785d337c22c0e.png"/>
                  <div className="trackerr">
                    <p className='Congratss'><strong>Submission</strong></p>
                    <p className='CongratsFooterr'><strong>Here's your previous submission~</strong></p>
                  </div>
                  <div className="optionss">
                    <div className='o1' ><strong>DISABLE</strong></div>
                    <div className='o2' onClick={handleSubmit(submitForm)} ><strong>SUBMIT</strong></div>
                    <div className='o3' onClick={() => {onClose(); setPopup(false);}}><strong>X</strong></div>
                  </div>
                </div>

                <div className='contentt'>
                  <div className='leftHandd'>
                    <div className='problemLabell'><strong>Problem:</strong></div>
                    <p className='problemm'><a href={problem.problemLink}>{`${problem.problemID}. ${problem.problemName}`}</a></p>
                    <div className='problemLabell'><strong>Would you like to revisit this question?</strong></div>
                      <div className='OPTIONSS'>
                      <div>
                        <input 
                            type="radio" 
                            id="option1" 
                            value={0} 
                            className='radioo'
                            {...register('markForRevisit', { required: true })}
                        />
                          <label htmlFor="option1"><div className={'oo1 ' + ((revisit == 0) ? ("oo1tick") : (""))} onClick={() => {setRevisit(0)}}><strong>NO</strong></div></label>
                      </div>

                      <div>
                          <input 
                              type="radio" 
                              id="option2" 
                              value={1}
                              className='radioo'
                              {...register('markForRevisit', { required: true })}
                          />
                          <label htmlFor="option2"><div className={'oo2 ' + ((revisit == 1) ? ("oo2tick") : (""))} onClick={() =>{setRevisit(1); }} ><strong>YES</strong></div></label>
                      </div>

                      <div>
                          <input 
                              type="radio" 
                              id="option3" 
                              value={2} 
                              className='radioo'
                              {...register('markForRevisit', { required: true })}
                          />
                          <label htmlFor="option3"><div className={'oo3 ' + ((revisit == 2) ? ("oo3tick") : (""))} onClick={() => {setRevisit(2); /*onClose();*/}}><strong>SPECIAL</strong></div></label>
                      </div>
                    </div>

                    <div className='problemLabell'>
                    <label><strong>Select a Topic:</strong></label>
                    <select className='problemListt'
                      name='problemTopic'
                      id='problemTopic'
                      placeholder="Select topic of your choice"
                      {...register("problemTopic", {required: true})}
                      defaultValue={problem.problemTopic}
                    >
                      {topics.map(({topic, index}) => (<option>{topic}</option>))}
                    </select>
                    {
                      errors.problemTopic && (
                        <span >
                          Please select problem topic.
                        </span>
                      )
                    }
                    </div>

                    <div className='learningWrapperr'>
                      <label>
                        <p className='learningHeaderr'><strong>What's your learning?</strong></p>
                        <p className='learningInfoo'>Any previous entries will be pre-loaded for direct editing.</p>
                      </label>

                      <textarea className='learningEditorr'
                        name='learning'
                        id='learning'
                        type='text'
                        placeholder="Enter learning"
                        {...register("learning", {required: false})}
                        defaultValue={problem.learning}
                      />
                      {
                        errors.firstName && (
                          <span >
                            Please enter your learning.
                          </span>
                        )
                      }
                    </div>
                      
                    
                  </div>
                  <div className='rightHandd'>
                  <div className='codeWrapperr'>
                      <label>
                        <p className='codeHeaderr'><strong>CODE</strong></p>
                        <p className='codeInfoo'>Your accepted code will be loaded below any existing code.</p>
                      </label>

                      <textarea className='codeEditorr'
                        name='code'
                        id='code'
                        type='text'
                        placeholder="Enter code"
                        {...register("code", {required: false})}
                        defaultValue={problem.code}
                      />
                      {
                        errors.firstName && (
                          <span>
                            Please enter your code.
                          </span>
                        )
                      }
                    </div>
                  </div>
                </div>
              </form>
              </div>
            </div>
          </ModalContent>
        </Modal>
        </ChakraProvider>
    </div>
  );
};

export default Submission;
