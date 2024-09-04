import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import IconBtn from '../../../common/IconBtn';
import { updateUser, changeSettings } from '../../../../services/operation/profileAPI';

const PersonalDataUploader = () => {
  const {user} = useSelector((state) => state.profile);
  const originalDB = user.storeToDB;
  const {token} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {register, handleSubmit, formState: {errors}} = useForm();
  const submitForm = async (formdata) => {
    try{
      if(originalDB != formdata.storeToDB)
      {
        console.log("db api called");
        dispatch(changeSettings(token, formdata.storeToDB));
      }
      console.log(formdata);
      dispatch(updateUser(token, formdata));
    } catch(err){}
  }

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>
        <div className='flex flex-col gap-5 lg:flex-row'>
          <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label className="text-white" htmlFor='firstName'>
              First Name
            </label>
            <input
              name='firstName'
              id='firstName'
              type='text'
              placeholder="Enter first name"
              {...register("firstName", {required: true})}
              defaultValue={user?.firstName}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            />
            {
              errors.firstName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
									Please enter your first name.
								</span>
              )
            }
          </div>
          <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label className="text-white" htmlFor='lastName'>
              Last Name
            </label>
            <input
              name='lastName'
              id='lastName'
              type='text'
              placeholder="Enter last name"
              {...register("lastName", {required: true})}
              defaultValue={user?.lastName}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            />
            {
              errors.lastName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
									Please enter your last name.
								</span>
              )
            }
          </div>
        </div>
        <div className='flex flex-col gap-5 lg:flex-row'>
          <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label className="text-white" htmlFor='dateOfBirth'>
              Leetcode ID
            </label>
            <input
              name='leetcodeId'
              id='leetcodeId'
              type='text'
              placeholder="Enter leetcode ID"
              {...register("leetcodeId", {
                required: {
                  value: true,
                  message: "Please enter your Leetcode ID"
                },
                })
              }
              defaultValue={user?.leetcodeId}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
            />
            {
              errors.leetcodeId && (
                <span className="-mt-1 text-[12px] text-yellow-100">
									{errors.leetcodeId.message}
								</span>
              )
            }
          </div>
          <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label className="text-white" htmlFor='storeToDB'>Store to Database</label>
            <select 
              name='storeToDB'
              id='storeToDB'
              placeholder='Enter your preference'
              type='text'
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-600 p-[12px] text-richblack-5"
              {...register("storeToDB", {required:true})}
              defaultValue={user.storeToDB === true ? 1 : 0}
            >
                  <option value={1} >
                    True
                  </option>
                  <option value={0} >
                  False
                  </option>
            </select>
            {errors.storeToDB && (
							<span className="-mt-1 text-[12px] text-yellow-100">
								Please enter your preference.
							</span>
						)}
          </div>
        </div>
      </div>
      <div className='flex justify-end gap-2'>
          <Link
            to='/dashboard'
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </Link>
          <IconBtn type='submit' text="Save"/>
      </div>
    </form>
  )
}

export default PersonalDataUploader