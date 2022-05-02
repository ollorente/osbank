// @ts-check
const Joi = require('@hapi/joi')

/* Register Validation */
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(256).min(3),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: {
          allow: ['com', 'net', 'org', 'co']
        }
      })
      .required(),
    password: Joi.string().max(255).min(3).required(),
    phone: Joi.string().max(10).min(10).required()
  })

  return schema.validate(data)
}

/* Login Validation */
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().max(80).min(5).required(),
    password: Joi.string().max(255).min(3).required()
  })

  return schema.validate(data)
}

module.exports = {
  registerValidation,
  loginValidation
}
