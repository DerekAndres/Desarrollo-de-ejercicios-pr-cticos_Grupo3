const e = require('express');
const Persona = require('../../domain/models/personaModel');
const { validationResult } = require('express-validator');

exports.createPersona = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const persona = new Persona(req.body);
        await persona.save();
        res.status(201).json(persona);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getAllPersonas = async (req, res) => {
    try {
        const personas = await Persona.find();
        res.status(200).json(personas);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getPersonaById = async (req, res) => {
    try {
        const persona = await Persona.findById(req.params.id);
        if (!persona) {
            return res.status(404).json({ message: 'Persona not found' });
        }
        res.json(persona);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updatePersona = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const persona = await Persona.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!persona) {
            return res.status(404).json({ message: 'Persona not found' });
        }
        res.json(persona);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deletePersona = async (req, res) => {
    try {
        const persona = await Persona.findByIdAndDelete(req.params.id);
        if (!persona) {
            return res.status(404).json({ message: 'Persona not found' });
        }
        res.json({ message: 'Persona deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
