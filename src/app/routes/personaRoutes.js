const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');
const { body } = require('express-validator');

router.post('/',
    [
        body('nombre').notEmpty().withMessage('Nombre is required'),
        body('edad').isInt({ min: 0 }).withMessage('Edad must be a positive integer'),
        body('email').isEmail().withMessage('Email is not valid')
    ],
    personaController.createPersona
);

router.get('/', personaController.getAllPersonas);
router.get('/:id', personaController.getPersonaById);
router.put('/:id',
    [
        body('nombre').optional().notEmpty().withMessage('Nombre is required'),
        body('edad').optional().isInt({ min: 0 }).withMessage('Edad must be a positive integer'),
        body('email').optional().isEmail().withMessage('Email is not valid')
    ],
    personaController.updatePersona
);
router.delete('/:id', personaController.deletePersona);

module.exports = router;