// import { setAllAdminJobs } from '@/redux/jobSlice'
// import { JOB_API_END_POINT } from '@/utils/constant'
// import axios from 'axios'
// import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'

// const useGetAllAdminJobs = () => {
//     const [jobs, setJobs] = useState([]);
//     const [error, setError] = useState(null);
//     const dispatch = useDispatch();
//     useEffect(()=>{
//         const fetchAllAdminJobs = async () => {
//             try {
//                 const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true});
//                 if(res.data.success){
//                     dispatch(setAllAdminJobs(res.data.jobs));
//                 }
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         fetchAllAdminJobs();
//     },[])
// }

// export default useGetAllAdminJobs
import axios from 'axios';
import { useEffect, useState } from 'react';
import { JOB_API_END_POINT } from '@/utils/constant';

const useGetAllAdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                console.log('Fetching admin jobs...');
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
                    withCredentials: true
                });
                console.log('Admin jobs response:', res.data);
                setJobs(res.data.jobs);
            } catch (error) {
                console.error('Error fetching admin jobs:', error);
                setError(error.response ? error.response.data.message : 'An error occurred');
            }
        };

        fetchAdminJobs();
    }, []);

    return { jobs, error };
};

export default useGetAllAdminJobs;
