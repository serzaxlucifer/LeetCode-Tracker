import React from 'react'
import CTAbutton from './CTAbutton'
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation'

const CodeBlocks = ({position, heading, subheading, image, backgroundGradient}) => {
  return (
    <div className={`flex ${position} my-20 justify-between flex-wrap`}>
      {/* Section 1 */}
      <div className='md:w-[50%] flex flex-col gap-8'>
        {heading}
        <div className='text-richblack-300 font-bold'>
          {subheading}
        </div>
      </div>

      {/* Section 2 */}
      <div className=' mt-10 flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]'>
        {backgroundGradient}
        <img src={image} alt="Image" className="rounded-lg border-4 border-gray-300 border-opacity-50" />

      </div>
    </div>
  )
}

export default CodeBlocks