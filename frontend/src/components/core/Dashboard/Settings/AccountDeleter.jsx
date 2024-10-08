import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProfile } from "../../../../services/operation/profileAPI";

const AccountDeleter = ({ setConfirmationModel }) => {
	const { token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	async function handleDeleteAccount() {
		try {
			dispatch(deleteProfile(token, navigate));
			setConfirmationModel(null)
		} catch (err) {}
	}
	return (
		<div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
			<div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
				<FiTrash2 className="text-3xl text-pink-200" />
			</div>
			<div className="flex flex-col space-y-2">
				<h2 className="text-lg font-semibold text-richblack-5">
					Delete Account
				</h2>
				<div className=" text-pink-25">
					<p>Would you like to delete account?</p>
				</div>
				<button
					onClick={() =>
						setConfirmationModel({
							text1: "Are you sure?",
							text2: "Your account will be deleted permanently! (It will take upto 30 minutes to remove all your data)",
							btn1Text: "Delete",
							btn2Text: "Cancel",
							btn1Handler: () => handleDeleteAccount(),
							btn2Handler: () => setConfirmationModel(null),
						})
					}
					className="italic w-fit text-pink-300 cursor-pointer">
					<span>Delete</span>
				</button>
			</div>
		</div>
	);
};

export default AccountDeleter;
