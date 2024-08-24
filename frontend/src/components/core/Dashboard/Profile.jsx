import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../../services/operation/profileAPI';

const Profile = () => {
  
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(false);

  if(loading)
  {
    return (<div className="mx-auto"> LOADING... </div>);
  }

  console.log("rednering profuekl");
  return (
    <div>
      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-8 px-12">
        <div className="flex w-full">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
        </div>
        <div className="flex max-w-[500px] justify-between">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.firstName}</p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Email Id</p>
              <p className="text-sm font-medium text-richblack-5">{user?.email}</p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Spreadsheet ID</p>
              <p className="text-sm font-medium text-richblack-5">{user?.spreadsheetId}</p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.lastName}</p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">LeetCode ID</p>
              <p className="text-sm font-medium text-richblack-5">{user?.leetcodeId}</p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Total Submissions Logged</p>
              <p className="text-sm font-medium text-richblack-5">{user?.totalSubmissions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile