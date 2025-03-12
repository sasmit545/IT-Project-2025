import multer from "multer";


const storage = multer.diskStorage({
    destination:function (req,file,cal){
        cal(null,"../../public")
    },
    filename : function (req,file,cal){
        cal(null,file.originalname)
    }
})

export const upload = multer({
    storage:storage
})