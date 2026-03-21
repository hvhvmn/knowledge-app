import {body,validationResult} from 'express-validator';

let valid=(req,res,next)=>{
    let error=validationResult(req)
    if(error.isEmpty()) return next()
    return res.status(400).json({
error:error.array()
})    
}
export const validateRegister = [
    body('username').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    valid
];

export const validateLogin = [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    valid
];