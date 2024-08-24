import React from 'react'
import { Link } from 'react-router-dom';


const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];


const Footer = () => {
  return (
    <div className="bg-richblack-800">
        

        <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto mt-7 pb-14 text-sm">
          {/* Section 1 */}
          <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
            <div className="flex flex-row">
              {BottomFooter.map((ele, i) => {
                return (
                  <div
                    key={i}
                    className={` ${
                      BottomFooter.length - 1 === i
                        ? ""
                        : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    } px-3 `}
                  >
                    <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                      {ele}
                    </Link>
                  </div>
                );
              })}
            </div>
            <div className="text-right">Handcrafted with ❤️ by Mukul Malik © 2024 LeetCode Tracker<br/><strong>PLEASE NOTE: THIS APPLICATION IS NOT ASSOCIATED WITH LEETCODE.</strong></div>
          </div>
        </div>
      </div>
  )
}

export default Footer