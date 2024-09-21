import React from 'react'
import { Link } from 'react-router-dom';


const BottomFooter = ["Check Website Status", "Privacy Policy"];


const Footer = () => {
  return (
    <div className="bg-richblack-800">
        

        <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto mt-7 pb-14 text-sm">
          {/* Section 1 */}
          <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
            <div className="flex flex-row">
                  <div
                    className="border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200 px-3">
                    <Link to="/privacy-policy">
                      Privacy Policy
                    </Link>
                  </div>
                  <div
                  className={`border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200 px-3`}
                >
                  <a href="https://stats.uptimerobot.com/5lyXyhxvUI">
                    Check Website Status
                  </a>
                </div>

                <div
                  className={`cursor-pointer hover:text-richblack-50 transition-all duration-200 px-3`}
                >
                  <a href="https://forms.gle/wgkf7zd5up6qFzhA7">
                    Report Bugs or Give Feedback
                  </a>
                </div>
            </div>
            <div className="text-right">Handcrafted with ❤️ by <a href="mailto:mukulsinghmalik@gmail.com">Mukul Malik</a> © 2024 LeetCode Tracker<br/><strong>PLEASE NOTE: THIS APPLICATION IS NOT ASSOCIATED WITH LEETCODE.</strong></div>
          </div>
        </div>
      </div>
  )
}

export default Footer