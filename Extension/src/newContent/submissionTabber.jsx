import React, { useImperativeHandle, forwardRef, useCallback, memo } from 'react';
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
import { toast } from "react-hot-toast";

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

  async function sendSubmission(data) 
  {
    const ROUTE = await getValue('sendRoute');
    let result = [];
    const token = await getValue('token');
    
    if(token === null )
      {
        return 1;
      }
      
      if(await getValue('extension') === false)
        {
          return 1;
        }

    const toastId = toast.loading("Submitting...");
  
    try {
      const response = await apiConnector('PUT', ROUTE, JSON.stringify(data),
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });

      toast.dismiss(toastId);
  
      if (response.data.message !== 'Success') {
        throw new Error(response.data.error);
      }
  
      result = response.data.data;
    } catch (err) {
      alert("Operation Failed. Reverting back changes. ERROR DETAILS: " + response.data.error);
      return 1;
    }

    toast.success("Submission Successful!");
    return 2;
  }

const Submission = forwardRef((props, ref) =>  {

    const [initialData, setInitialData] = useState({problemID : props.ID, problemName : props.name, problemLink : props.link, learning : props.learning, code : props.code, revisit : props.revisit, topic : props.topic});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState({ID: initialData.problemID, name: initialData.problemName, link: initialData.problemLink, learning: initialData.learning, code: initialData.code, markForRevisit: initialData.revisit, problemTopic: initialData.topic});
    const [type, setType] = useState(0);                // 0 --> default
    let embedCode = false;

    useImperativeHandle(ref, () => {  return {
        setModal: onOpen,
        setFormData: setFormData,
        setType: setType,
        refVal: initialData.problemID+1
    };}, []);

    const changeHandler = useCallback((event) => {
      setFormData((prevData) => ({
        ...prevData,
        [event.target.name]: event.target.value,
      }))
    }, []);

    const OCTP = useCallback((num) => {
      setFormData((prevData) => ({
        ...prevData,
        markForRevisit: num,
      }))
    }, []);

    const userName = props.userName;

    const submitForm = useCallback( async (event) => {
        event.preventDefault();
        if(formData.learning != initialData.learning || formData.code != initialData.code || formData.markForRevisit != initialData.revisit || initialData.topic != formData.problemTopic)      // otherwise no need to put load on backend.
        {
          if(await sendSubmission({leetcode_username: userName, problem_id: formData.ID, problemName: formData.name, problem_link: formData.link, problem_topic: formData.problemTopic, learning: formData.learning, code: formData.code, markForRevisit: formData.markForRevisit}) === 2)
          {
            embedCode = true;
          };
        }
        else
        {
          toast("No Change in Form Content Detected.");
        }
    }, [formData, initialData]);

    function handleClosing () {
      setType(0);
      if(embedCode === false)
      {
        setFormData((prevData) => ({
          ...prevData,
          learning: initialData.learning, code: initialData.code, markForRevisit: initialData.revisit, problemTopic: initialData.topic
        }))
      }
      else
      {
        embedCode = false;
        setInitialData((prevData) => ({
          ...prevData,
          learning : formData.learning, code : formData.code, revisit : formData.markForRevisit, topic : formData.problemTopic
        }));
      }
    }

  return (
    <div className="containerr">
    <button onClick={()=>{onOpen();}}><img src={"chrome-extension://" + chrome.runtime.id + "/sword.png"} style={{ "margin-top": "4px", height: "20px", width: "20px" }}/></button>
      <ChakraProvider>
        <Modal className="mainMOD" isOpen={isOpen} onClose={() => {console.log("Modal is closing"); setType(0);}}>
        <ModalOverlay />
          <ModalContent maxW="90%" w="1200px" maxH="600px" h="auto">

            <div className="wrapperr">
              <div className="maincontentt">
              <form onSubmit={submitForm}>
                <div className='navbarr'>
                  <img src={"chrome-extension://" + chrome.runtime.id + "/051f610785d337c22c0e.png"}/>
                  <div className="trackerr">
                    <p className='Congratss'><strong>{(type) ? ("Congrats!") : ("Submission")}</strong></p>
                    <p className='CongratsFooterr'><strong>{(type) ? ("Time to make an entry in the log~") : ("Here's your previous submission ~")}</strong></p>
                  </div>
                  <div className="optionss">
                    <div className='o1' onClick={(e) => {e.preventDefault(); chrome.storage.local.set({logging: false}); handleClosing(); onClose();}}><strong>DISABLE</strong></div>
                    <button className='o2' type='submit' ><strong>SUBMIT</strong></button>
                    <div className='o3' onClick={(e) => {e.preventDefault(); handleClosing(); onClose();}}><strong>X</strong></div>
                  </div>
                </div>

                <div className='contentt'>
                  <div className='leftHandd'>
                    <div className='problemLabell'><strong>Problem:</strong></div>
                    <p className='problemm'><a href={initialData.problemLink}>{`${initialData.problemID}. ${initialData.problemName}`}</a></p>
                    <Revisit value={formData.markForRevisit} onChange={OCTP}/>
                    <Topic value={formData.problemTopic} onChange={changeHandler}/>
                    <Learning value={formData.learning} onChange={changeHandler}/>
                  </div>
                  <div className='rightHandd'>
                  <Code value={formData.code} onChange={changeHandler}/>
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
});

const Topic = memo(({value, onChange}) => (
                    <div className='problemLabell'>
                    <label><strong>Select a Topic:</strong></label>
                    <select className='problemListt'
                      name='problemTopic'
                      id='problemTopic'
                      placeholder="Select topic of your choice"
                      onChange={onChange}
                      value={value}
                    >
                      {topics.map(({topic, index}) => (<option key={index}>{topic}</option>))}
                    </select>
                    
                    </div>
));

const Revisit = memo(({value, onChange}) => (
  <>
                      <div className='problemLabell'><strong>Would you like to revisit this question?</strong></div>
                      <div className='OPTIONSS'>
                      <div>
                        <input 
                            type="radio" 
                            id="option1" 
                            value={0} 
                            className='radioo'
                        />
                          <label htmlFor="option1"><div className={'oo1 ' + ((value == 0) ? ("oo1tick") : (""))} onClick={() => {onChange(0)}}><strong>NO</strong></div></label>
                      </div>

                      <div>
                          <input 
                              type="radio" 
                              id="option2" 
                              value={1}
                              className='radioo'


                          />
                          <label htmlFor="option2"><div className={'oo2 ' + ((value == 1) ? ("oo2tick") : (""))} onClick={() =>{onChange(1); }} ><strong>YES</strong></div></label>
                      </div>

                      <div>
                          <input 
                              type="radio" 
                              id="option3" 
                              value={2} 

                              className='radioo'

                          />
                          <label htmlFor="option3"><div className={'oo3 ' + ((value == 2) ? ("oo3tick") : (""))} onClick={() => {onChange(2); /*onClose();*/}}><strong>SPECIAL</strong></div></label>
                      </div>
                    </div>
  </>                   
));

const Learning = memo(({value, onChange}) => (
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
                        onChange={onChange}
                        value={value}
                      />
                      
                    </div>
));

const Code = memo(({value, onChange}) => (
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
                        onChange={onChange}
                        value={value}
                      />
                      
                    </div>
));

export default Submission;
