import { Schema } from "express-validator";

export const registerUserSchema = (): Schema => {
    return {
        "email": {
            in: 'body',
            exists: {
                errorMessage: "email is required"
            },
            isString: {
                errorMessage: 'email must be a valid string',
                bail: true
            },
            trim: true
        },
        "password": {
            in: 'body',
            exists: {
                errorMessage: "password is required"
            },
            isString: {
                errorMessage: 'password must be a valid string',
                bail: true
            },
            trim: true
        },
    }
};