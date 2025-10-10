import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setUserData } from '../redux/userSlice'
import { getCurrentUser } from '../APICalls/userCalls'

function useCurrentUser() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        if (userData) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                setLoading(true);
                const rslt = await getCurrentUser();
                
                dispatch(setUserData(rslt.user));
            } catch (error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        fetchUser();
    }, [dispatch, userData]);
     
    return { loading };
}

export default useCurrentUser;