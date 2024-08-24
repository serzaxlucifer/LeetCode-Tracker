import React from 'react';
import CodeBlocks from '../components/core/homepage/CodeBlocks';
import LearningLanguageSection from '../components/core/homepage/LearningLanguageSection';
import img1 from "./images/First.png";
import img2 from "./images/Second.png";
import leetCodeText from "./images/LeetCodeText.png"
import Meteors from './Meteor';


const Home = () => {
  return (
    <div>

      {/* Section 1 */}
      <div className='absolute mt-10 relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
        <Meteors> </Meteors>
        <div className=' z-[2] flex space-x-2 text-center mt-7 text-4xl'>
          <div className=' text-black  font-semibold '>
          Master
          </div>

          <div className=' text-brown-100 font-extrabold'>
          LeetCode
          </div>

          <div className=' text-black font-semibold'>
          with Ease:
          </div>
        </div>

        <div className='z-[2] text-center text-4xl mt-3 font-semibold'>
        {/* <HighlightText color={"blue"} text={"Track"}/>,  */}
        <span className={` not-italic hover:italic font-bold hover:font-extrabold text-yellow-100`}>Track</span>
        <span className=' text-black'>,</span>
        <span className={` not-italic hover:italic font-bold hover:font-extrabold text-blue-100`}> Learn</span>
        <span className=' text-black'>, and </span>
        <span className={`not-italic hover:italic font-bold hover:font-extrabold text-caribbeangreen-200`}> Revise Efficiently</span>
        </div>

        <div className='z-[2] mt-7 mb-10 w-[90%] text-center text-lg font-bold text-richblack-700'> 
        ⚡Supercharge Your LeetCode Practice
        </div> 
        
        {/* Code Section 1 */}
        <div className="mt-7">
          <CodeBlocks
            position={'lg:flex-row'}
            heading={<div className='text-4xl text-black font-semibold'>Automatic Submission Logging</div>}
            subheading={<div>No more manual tracking. All your accepted solutions are logged automatically in a private Google Spreadsheet.</div>}
            image = {img1}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={'lg:flex-row-reverse'}
            heading={<div className='text-4xl text-black font-semibold'> Community Statistics </div>}
            subheading={<div> Stay on top of your learning with a customized dashboard that highlights your strengths and areas for improvement. </div>}
            image = {img2}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>

        {/* Code Section 3 */}
        <div>
          <CodeBlocks
            position={'lg:flex-row'}
            heading={<div className='text-4xl text-black font-semibold'> Random Review Questions </div>}
            subheading={<div> Never lose touch with what you've learned. Get random review questions to keep your skills sharp. </div>}
            image = {img2}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={'lg:flex-row-reverse'}
            heading={<div className='text-4xl text-black font-semibold'> Transparency and Data Security </div>}
            subheading={<div> Stay on top of your learning with a customized dashboard that highlights your strengths and areas for improvement. </div>}
            image = {img2}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>

        {/* Code Section 3 */}
        <div>
          <CodeBlocks
            position={'lg:flex-row'}
            heading={<div className='text-4xl text-black font-semibold'> See Previous Submissions Efficiently </div>}
            subheading={<div> Never lose touch with what you've learned. Get random review questions to keep your skills sharp. </div>}
            image = {img2}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        
      </div>

      {/* Section 2 */}
      <div className='bg-white border-t text-richblack-700'>
        
        <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-16 mx-auto'>

          <LearningLanguageSection/>
        </div>
      </div>
    </div>
  )
}

export default Home