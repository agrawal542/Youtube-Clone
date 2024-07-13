import { Joi } from "express-validation";

const userLogin = {
  body: Joi.object({
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().required(),
  }).xor('username', 'email')
}

export { userLogin }