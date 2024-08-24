import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo/LTLOGO.png";
import { useSelector, useDispatch } from "react-redux";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import {login} from "../../services/operation/authAPI";

import { FcGoogle } from "react-icons/fc";

function Navbar() {
	const { token } = useSelector((state) => state.auth);
	const { user } = useSelector((state) => state.profile);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	return (
		<div
			className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 
				bg-white transition-all duration-200`}>
			<div className="flex w-11/12 max-w-maxContent items-center justify-between">
				{/* Logo */}

				<Link to="/">
					<img src={logo} className="object-contain h-10" alt="Logo" width={160} height={32} loading="lazy" />
				</Link>

				{/* Login / Signup / Dashboard */}
				<div className="items-center gap-x-4 sm:flex">
					{token === null ? (
							<button onClick={() => {dispatch(login(navigate))}} className="rounded-md border border-black bg-white hover:bg-richblack-700 hover:text-white px-[20px] py-[9px] text-black">
								<div className="flex items-center space-x-2">
									<FcGoogle className="text-2xl" />
									<span>Log In/Sign Up</span>	
								</div>
							</button>
					) : ( <ProfileDropDown /> )}
				</div>
			</div>
		</div>
	);
}

export default Navbar;