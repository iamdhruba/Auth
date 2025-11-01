import joi from "joi";

//For SignUp Validation
export const singupValidation = async (req,res, next) =>  {
    try {
        const schema = joi.object({
            username: joi.string().min(3).max(30).required(),
            email: joi.string().email().required(),
            password: joi.string().min(6).max(30).required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();   
    } catch (error ) {
        res.status(500).json({ message: "Server error", error });
    }
}


//For Login Validation
export const loginValidation = async (req, res, next) => {
    try {
        const schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(6).max(30).required(),
            rememberMe: joi.boolean().optional(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}