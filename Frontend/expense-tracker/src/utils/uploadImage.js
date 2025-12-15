import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    //APPEND IMAGE FILE TO FORM DATA
    formData.append('image',imageFile);

    try{
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE,formData, {
            headers:{
                "Content-Type":"multipart/form-data",
            },
        });
        return response.data;
    }catch(err){
        console.error("error uploading error: ", err);
        throw err;
    }

}

export default uploadImage;