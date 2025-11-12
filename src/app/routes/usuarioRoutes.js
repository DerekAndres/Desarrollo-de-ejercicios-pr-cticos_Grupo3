const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { body } = require('express-validator');

router.post('/',
    [
        body('nombre').notEmpty().withMessage('Nombre is required'),
        body('email').isEmail().withMessage('Email is not valid'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('rol').optional().isIn(['admin', 'usuario', 'moderador']).withMessage('Rol must be admin, usuario, or moderador'),
        body('activo').optional().isBoolean().withMessage('Activo must be a boolean')
    ],
    usuarioController.createUsuario
);

router.get('/', usuarioController.getAllUsuarios);
router.get('/:id', usuarioController.getUsuarioById);

router.put('/:id',
    [
        body('nombre').optional().notEmpty().withMessage('Nombre is required'),
        body('email').optional().isEmail().withMessage('Email is not valid'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('rol').optional().isIn(['admin', 'usuario', 'moderador']).withMessage('Rol must be admin, usuario, or moderador'),
        body('activo').optional().isBoolean().withMessage('Activo must be a boolean'),
        body('ultimoLogin').optional().isISO8601().withMessage('UltimoLogin must be a valid date')
    ],
    usuarioController.updateUsuario
);

router.delete('/:id', usuarioController.deleteUsuario);

// Special endpoint to update last login
router.patch('/:id/login', usuarioController.updateUltimoLogin);

module.exports = router;
