const asyncHandler = fn => (req, res, next) => {
    try {
        fn(req, res, next);
    } catch (error) {
        res.status(error.statusCode).json({
            success:false,
            message :error.message,
            data:error.data,
            errorcode:error.statusCode,
            errors:error.errors

        })
    }
}
export default asyncHandler;