import React, { useState } from 'react'
import PersonalDataUploader from './Settings/PersonalDataUploader'
import AccountDeleter from './Settings/AccountDeleter'

const Settings = ({setConfirmationModel}) => {
  console.log("rendering settings");
  return (
    <>
    <div className="mt-8 mb-8">
      <h1 className="mb-14 text-3xl font-medium text-black-5">Edit Profile</h1>
      <PersonalDataUploader />
      { <AccountDeleter setConfirmationModel={setConfirmationModel} /> }
    </div>
    </>
  )
}

export default Settings