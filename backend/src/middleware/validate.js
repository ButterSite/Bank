import Joi from "joi";


export const validateRegister = (req,res,next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        telephoneNumber: Joi.string().required(),
        password: Joi.string().min(8).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        currency: Joi.string().optional()
    })

    const {error} = schema.validate(req.body,{abortEarly: false});

   if (error) {
        if (error.details.some(detail => detail.path.includes('email'))) {
            return res.status(422).json({ error: "Invalid email format", details: error.details.map(d => d.message) });
        }
  
        if (error.details.some(detail => detail.path.includes('password'))) {
            return res.status(422).json({ error: "Password must be at least 8 characters", details: error.details.map(d => d.message) });
        }

        return res.status(400).json({ error: "Validation error", details: error.details.map(d => d.message) });
    }

    next()

}


export const validateLogin = (req,res,next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(8).required(),
    })

    const {error} = schema.validate(req.body,{abortEarly: false});

    if(error) {
        const errors = error.details.map((detail) => detail.message );
        return res.status(400).json({error: errors})
    }

    next()

}