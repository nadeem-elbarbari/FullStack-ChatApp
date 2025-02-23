export const validation = (schema) => {
    return (req, res, next) => {
        const inputs = { ...req.body, ...req.params, ...req.query };
        const { error } = schema.validate(inputs, { abortEarly: false });
        if (error) {
            const errorMsg = new Error(error.message.replace(/"/g, ''), { cause: 400 });
            return next(errorMsg);
        }
        return next();
    };
};
