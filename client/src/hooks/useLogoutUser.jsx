import { useState } from "react";
import { useDispatch } from "react-redux";

import { setUserData } from "../redux/userSlice";
import { logout } from "../APICalls/authCalls";

export function useLogoutUser(){
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);

    const logoutUser = async () => {
        try {
            setLoading(true);
            const response = await logout();

            dispatch(setUserData(null));
            console.log(response);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
  };
    return { logoutUser, loading }
}