import multer from "multer";
const storage = multer.diskStorage({
    destination:function (req,file,cal){
        cal(null,"../../public/temp/")
    },
    filename : function (req,file,cal){
        cal(null,file.originalname)
    }
})

 const  upload = multer({
    storage:storage
})
export default upload