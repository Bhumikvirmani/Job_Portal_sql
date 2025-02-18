// import React, { useState } from 'react'
// import Navbar from '../shared/Navbar'
// import { Label } from '../ui/label'
// import { Input } from '../ui/input'
// import { Button } from '../ui/button'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { COMPANY_API_END_POINT } from '@/utils/constant'
// import { toast } from 'sonner'
// import { useDispatch } from 'react-redux'
// import { setSingleCompany } from '@/redux/companySlice'

// const CompanyCreate = () => {
//     const navigate = useNavigate();
//     const [companyName, setCompanyName] = useState();
//     const dispatch = useDispatch();
//     const registerNewCompany = async () => {
//         try {
//             const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
//                 headers:{
//                     'Content-Type':'application/json'
//                 },
//                 withCredentials:true
//             });
//             if(res?.data?.success){
//                 dispatch(setSingleCompany(res.data.company));
//                 toast.success(res.data.message);
//                 const companyId = res?.data?.company?._id;
//                 navigate(`/admin/companies/${companyId}`);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     return (
//         <div>
//             <Navbar />
//             <div className='max-w-4xl mx-auto'>
//                 <div className='my-10'>
//                     <h1 className='font-bold text-2xl'>Your Company Name</h1>
//                     <p className='text-gray-500'>What would you like to give your company name? you can change this later.</p>
//                 </div>

//                 <Label>Company Name</Label>
//                 <Input
//                     type="text"
//                     className="my-2"
//                     placeholder="JobHunt, Microsoft etc."
//                     onChange={(e) => setCompanyName(e.target.value)}
//                 />
//                 <div className='flex items-center gap-2 my-10'>
//                     <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancel</Button>
//                     <Button onClick={registerNewCompany}>Continue</Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CompanyCreate

// import React, { useState } from 'react';
// import Navbar from '../shared/Navbar';
// import { Label } from '../ui/label';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { COMPANY_API_END_POINT } from '@/utils/constant';
// import { toast } from 'sonner';
// import { useDispatch } from 'react-redux';
// import { setSingleCompany } from '@/redux/companySlice';

// const CompanyCreate = () => {
//     const navigate = useNavigate();
//     const [companyName, setCompanyName] = useState("");
//     const [description, setDescription] = useState("");
//     const [website, setWebsite] = useState("");
//     const [location, setLocation] = useState("");
//     const [logo, setLogo] = useState(null);
//     const dispatch = useDispatch();

//     const handleFileChange = (e) => {
//         setLogo(e.target.files[0]);
//     }

//     const registerNewCompany = async () => {
//         try {
//             if (!companyName || !description || !website || !location || !logo) {
//                 toast.error("All fields are required");
//                 return;
//             }
//             const formData = new FormData();
//             formData.append("name", companyName);
//             formData.append("description", description);
//             formData.append("website", website);
//             formData.append("location", location);
//             formData.append("file", logo);
//             const res = await axios.post(`${COMPANY_API_END_POINT}/register`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 },
//                 withCredentials: true
//             });
//             if (res?.data?.success) {
//                 dispatch(setSingleCompany(res.data.company));
//                 toast.success(res.data.message);
//                 const companyId = res?.data?.company?.id;
//                 navigate(`/admin/companies/${companyId}`);
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error("An error occurred while registering the company");
//         }
//     }

//     return (
//         <div>
//             <Navbar />
//             <div className='max-w-4xl mx-auto'>
//                 <div className='my-10'>
//                     <h1 className='font-bold text-2xl'>Your Company Name</h1>
//                     <p className='text-gray-500'>What would you like to give your company name? you can change this later.</p>
//                 </div>
//                 <Label>Company Name</Label>
//                 <Input
//                     type="text"
//                     className="my-2"
//                     placeholder="JobHunt, Microsoft etc."
//                     onChange={(e) => setCompanyName(e.target.value)}
//                 />
//                 <Label>Description</Label>
//                 <Input
//                     type="text"
//                     className="my-2"
//                     placeholder="Company description"
//                     onChange={(e) => setDescription(e.target.value)}
//                 />
//                 <Label>Website</Label>
//                 <Input
//                     type="text"
//                     className="my-2"
//                     placeholder="https://example.com"
//                     onChange={(e) => setWebsite(e.target.value)}
//                 />
//                 <Label>Location</Label>
//                 <Input
//                     type="text"
//                     className="my-2"
//                     placeholder="Company location"
//                     onChange={(e) => setLocation(e.target.value)}
//                 />
//                 <Label>Logo</Label>
//                 <Input
//                     type="file"
//                     className="my-2"
//                     onChange={handleFileChange}
//                 />
//                 <div className='flex items-center gap-2 my-10'>
//                     <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancel</Button>
//                     <Button onClick={registerNewCompany}>Continue</Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CompanyCreate;




// import React, { useState } from 'react';
// import Navbar from '../shared/Navbar';
// import { Label } from '../ui/label';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { COMPANY_API_END_POINT } from '@/utils/constant';
// import { toast } from 'sonner';
// import { useDispatch } from 'react-redux';
// import { setSingleCompany } from '@/redux/companySlice';

// const CompanyCreate = () => {
//     const navigate = useNavigate();
//     const [companyName, setCompanyName] = useState("");
//     const dispatch = useDispatch();

//     const registerNewCompany = async () => {
//         try {
//             if (!companyName) {
//                 toast.error("Company name is required");
//                 return;
//             }
//             const payload = { name: companyName };
//             const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 withCredentials: true
//             });
//             if (res?.data?.success) {
//                 dispatch(setSingleCompany(res.data.company));
//                 toast.success(res.data.message);
//                 const companyId = res?.data?.company?.id; // Adjusted to match the expected field
//                 navigate(`/admin/companies/${companyId}`);
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error("An error occurred while registering the company");
//         }
//     }

//     return (
//         <div>
//             <Navbar />
//             <div className='max-w-4xl mx-auto'>
//                 <div className='my-10'>
//                     <h1 className='font-bold text-2xl'>Your Company Name</h1>
//                     <p className='text-gray-500'>What would you like to give your company name? you can change this later.</p>
//                 </div>
//                 <Label>Company Name</Label>
//                 <Input
//                     type="text"
//                     className="my-2"
//                     placeholder="JobHunt, Microsoft etc."
//                     onChange={(e) => setCompanyName(e.target.value)}
//                 />
//                 <div className='flex items-center gap-2 my-10'>
//                     <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancel</Button>
//                     <Button onClick={registerNewCompany}>Continue</Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CompanyCreate;
import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        location: '',
        file: null
    });
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            file: e.target.files[0]
        }));
    };

    const registerNewCompany = async () => {
        try {
            const { name, description, website, location, file } = formData;

            if (!name || !description || !website || !location || !file) {
                toast.error("All fields are required.");
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('name', name);
            formDataToSend.append('description', description);
            formDataToSend.append('website', website);
            formDataToSend.append('location', location);
            formDataToSend.append('file', file);

            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?.id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error("Registration failed.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Register Your Company</h1>
                    <p className='text-gray-500'>Provide the details below to register your company.</p>
                </div>
                <Label>Company Name</Label>
                <Input
                    type="text"
                    name="name"
                    className="my-2"
                    placeholder="JobHunt, Microsoft etc."
                    onChange={handleInputChange}
                />
                <Label>Description</Label>
                <Input
                    type="text"
                    name="description"
                    className="my-2"
                    placeholder="Company description"
                    onChange={handleInputChange}
                />
                <Label>Website</Label>
                <Input
                    type="url"
                    name="website"
                    className="my-2"
                    placeholder="https://example.com"
                    onChange={handleInputChange}
                />
                <Label>Location</Label>
                <Input
                    type="text"
                    name="location"
                    className="my-2"
                    placeholder="Company location"
                    onChange={handleInputChange}
                />
                <Label>Company Logo</Label>
                <Input
                    type="file"
                    name="file"
                    className="my-2"
                    onChange={handleFileChange}
                />
                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancel</Button>
                    <Button onClick={registerNewCompany}>Continue</Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
