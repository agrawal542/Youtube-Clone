import {v2 as cloudinary} from "cloudinary"
import fs from "fs" ;
import { config } from 'dotenv';

config(); 


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) 
             return null

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        
        return response;

    } catch (error) {
        console.error("Error during file upload or deletion:", error);

        // Attempt to delete the file if it exists
        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (deleteError) {
                console.error("Error deleting file:", deleteError);
            }
        }
        return null;
    }
}

export {uploadOnCloudinary}