import { body, validationResult } from 'express-validator';
let valid = (req, res, next) => {
    let error = validationResult(req)
    if (error.isEmpty()) return next()
    return res.status(400).json({
        errors: error.array()
    })
}
export let validateItems = [
    body('title').notEmpty().withMessage('Title is required'),
    body('url').notEmpty().withMessage('Url is required'),
    body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
    body('type').notEmpty().withMessage('Type is required').isIn(['article','video','tweet','image','pdf']),
    body('notes').optional().isString().withMessage('Notes must be a string'),
    valid
]