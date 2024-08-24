import React from 'react'
import { Link } from 'react-router-dom'

const CButton = ( {children, active, setter, id} ) => {
  return (
      <button className={`text-center text-[13px] px-6 py-3 rounded-md font-bold ${active ? "bg-yellow-50 text-black" : "bg-richblack-800"}`} onClick={() => { setter(id); }}>
        {children}
      </button>
  )
}

export default CButton;