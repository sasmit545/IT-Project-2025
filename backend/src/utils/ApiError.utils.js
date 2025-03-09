class ApiError extends Error{

   constructor(
    statusCode,
    message="Default Error Message",
    errors =[],
    stack= ""
   ) 
   {
    super(message)
    this.statusCode=statusCode
    this.errors =errors
    
    this.data = null
    this.message = message 
    if (stack){
        this.stack =stack
    }
    else
    {
        Error.captureStackTrace(this,this.constructor)
    }
    
   }
}
export {ApiError}