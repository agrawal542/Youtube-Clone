import { Joi } from 'express-validation';

export const channelId = {
    params: Joi.object({
        channel_id: Joi.string().required()
    })
};

  
