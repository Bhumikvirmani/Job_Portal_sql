import { checkCompanyExists, createCompany, initializeCompanyTable , getAllCompanies, getCompanyById, updateCompanyById, getCompanyIdByName} from "../models/company.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'media', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const registerCompanySql = async (req, res) => {
    try {
          console.log("Received Request Body:", req.body);
        console.log("Received File:", req.file);
        await initializeCompanyTable();
        console.log("call create company");

        const { name, description, website, location } = req.body;
        const file = req.file;

        if (!name || !description || !website || !location || !file) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }
        const companyExists = await checkCompanyExists(name);
        if (companyExists) {
            console.error("Validation Failed: Company already exists");
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        const logo = path.join('media', 'uploads', file.filename);
        const companyId = await createCompany({ name, description, website, location, logo });

        const tokenData = {
            companyId: companyId
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(201).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Company ${name} registered successfully`,
            company: { id: companyId, name, description, website, location, logo },
            success: true
        });
    } catch (error) {
        console.error('Error registering company:', error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
};
// export const registerCompanySql = async (req, res) => {
//     try {
//         console.log("connection call:", req.body);
//         await initializeCompanyTable();
//         console.log("call create company");

//         const { name, description, website, location, logo } = req.body;

//         if (!name || !description || !website || !location || !logo) {
//             return res.status(400).json({
//                 message: "All fields are required",
//                 success: false
//             });
//         }

//         const companyExists = await checkCompanyExists(name);
//         if (companyExists) {
//             return res.status(400).json({
//                 message: "You can't register the same company.",
//                 success: false
//             });
//         }

//         const companyId = await createCompany({ name, description, website, location, logo });

//         const tokenData = {
//             companyId: companyId
//         };
//         const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

//         return res.status(201).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
//             message: `Company ${name} registered successfully`,
//             company: { id: companyId, name, description, website, location, logo },
//             success: true
//         });
//     } catch (error) {
//         console.error('Error registering company:', error.stack);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

export const getCompanySql = async (req, res) => {
    try {
        const companies = await getAllCompanies();
        if (companies.length === 0) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }
        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error('Error retrieving companies:', error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getCompanyByIdSql = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await getCompanyById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.error('Error retrieving company:', error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const updateCompanySql = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;

        const companyExists = await getCompanyById(req.params.id);
        if (!companyExists) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        let logo = companyExists.logo;
        if (file) {
            logo = path.join('media', 'uploads', file.filename);
        }

        const updateData = { name, description, website, location, logo };
        const updated = await updateCompanyById(req.params.id, updateData);
        if (!updated) {
            return res.status(500).json({
                message: "Failed to update company information.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully.",
            success: true
        });
    } catch (error) {
        console.error('Error updating company:', error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
export const fetchCompanyIdByName = async (req, res) => {
    try {
        const { name } = req.query;
        console.log("Received company name:", name);
        const companyId = await getCompanyIdByName(name);
        if (companyId) {
            return res.status(200).json({ companyId });
        }
        return res.status(404).json({ message: "Company not found" });
    } catch (error) {
        console.error('Error fetching company ID:', error.stack);
        return res.status(500).json({ message: "Internal server error" });
    }
};






export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
 export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
 
        const file = req.file;
        // idhar cloudinary ayega
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;
    
        const updateData = { name, description, website, location, logo };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}