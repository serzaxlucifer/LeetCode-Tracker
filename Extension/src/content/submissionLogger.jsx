import React, { forwardRef, useImperativeHandle } from 'react';
import './submissionLogger.css';
import { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'
import { useForm } from 'react-hook-form';
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

const Submissionn = forwardRef((props, ref) => 
{
    console.log("Trying to render modal");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [properties, setProperties] = useState({problemID: 0, problemName: "", problemTopic: "", problemLink: "", markForRevisit: 0, learning: "", code: ""});
    const [revisit, setRevisit] = useState(0);

    useImperativeHandle(ref, () => {console.log("Imperative Handler Called!"); return {
        setModal: onOpen,
        properties: properties,
        setProperties: setProperties,
        setRevisit: setRevisit
    };}, []);

    const {register, setValue, handleSubmit, reset, formState, formState: {errors}} = useForm();

    console.log("Inside Submit Render");

    const handleClose = () => {
      console.log("resetting form!");
        reset(); // This will reset all the form fields to their default values
      };


    const submitForm = async (formdata) => {
        console.log("INSIDE FORM", properties);
        sendSubmission(props.token, {leetcode_username: props.uName, problem_id: properties.problemID, problemName: properties.problemName, problem_link: properties.problemLink, problem_topic: formdata.problemTopic, learning: formdata.learning, code: formdata.code, markForRevisit: formdata.markForRevisit});
    };

    console.log("Inside Random Composer");
    console.log("properties,", properties);
    console.log(formState);

    // setValue('markForRevisit', '');
    // setValue('problemTopic', properties.problemTopic);
    // setValue('learning', properties.learning);
    // setValue('code', properties.code);


  return (
    <div className="containerr">
      <ChakraProvider>
        <Modal className="mainMOD" isOpen={isOpen}>
        <ModalOverlay />
          <ModalContent maxW="90%" w="1200px" maxH="600px" h="auto">

            <div className="wrapperr">
              <div className="maincontentt">
              <form onSubmit={handleSubmit(submitForm)}>
                <div className='navbarr'>
                  <img src="chrome-extension://jmgegkadbojmamlkpajabahjadkleccc/051f610785d337c22c0e.png"/>
                  <div className="trackerr">
                    <p className='Congratss'><strong>Congrats!</strong></p>
                    <p className='CongratsFooterr'><strong>Time to make an entry in the log~</strong></p>
                  </div>
                  <div className="optionss">
                    <div className='o1' ><strong>DISABLE</strong></div>
                    <button className='o2' type='submit'><strong>SUBMIT</strong></button>
                    <div className='o3' onClick={(e) => {e.preventDefault(); handleClose(); onClose(); }}><strong>X</strong></div>
                  </div>
                </div>

                <div className='contentt'>
                  <div className='leftHandd'>
                    <div className='problemLabell'><strong>Problem:</strong></div>
                    <p className='problemm'><a href={properties.problemLink}>{`${properties.problemID}. ${properties.problemName}`}</a></p>
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
});

export default Submissionn;