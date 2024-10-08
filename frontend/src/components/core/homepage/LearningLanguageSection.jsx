import React from 'react'
import HighlightText from './HighlightText'
import CTAbutton from './CTAbutton'
import know_your_progress  from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"

import logo from "../../../pages/images/LOGO.png";


const LearningLanguageSection = () => {
  return (
		<div className="flex flex-col bg-white items-center gap-5 mt-[50px] border-t-black mb-5">
			
			<div className=' flex space-x-2 text-center mt-7 text-4xl'>
				<div className=' text-black  font-semibold '>
					Effortless Installation, 	
				</div>
				<div className=' text-pink-100  font-extrabold '>
					Immediate Efficiency! 	
				</div>
			</div>

			<div className="text-center text-richblack-700 mx-auto text-base font-medium">
				Install the LeetCode Tracker chrome extension now and take control of your coding journey. Download by clicking the logo below!.
			</div>

			<div className="flex flex-row items-center justify-center w-[65%] md:w-[100%]">
			<a href="https://chromewebstore.google.com/detail/leetcode-tracker/pijbfpmfgbcilhigpdnoibjaoijijmpp">
			<img
				src={logo}
				alt="KnowYourProgressImage"
				className="object-contain w-1/2 h-auto"
				/></a>

			</div>
			
		</div>
	);
}

export default LearningLanguageSection