const successResponse = (req, res, next) => {
    res.success = (data, message = 'Done', statusCode = 200) => {
        res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    };
    next();
};
export default successResponse;
