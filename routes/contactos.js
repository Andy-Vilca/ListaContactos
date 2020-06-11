var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');


router.get('/', function(req, res, next) {

    dbConn.query('SELECT * FROM personas',function(err,rows)     {

        if(err) {
            req.flash('error', err);
            res.render('contactos',{data:''});
        } else {
            res.render('contactos',{data:rows});
        }
    });
});

router.get('/agregar', function(req, res, next) {
    res.render('contactos/agregar', {
        nombre: '',
        apellido: '',
        correo: '',
        telefono: ''
    })
})

router.post('/agregar', function(req, res, next) {

    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let correo = req.body.correo;
    let telefono = req.body.telefono
    let errors = false;

    if(nombre.length === 0 || apellido.length === 0 || correo.length === 0 || telefono.length === 0)  {
        errors = true;

        req.flash('error', "Por favor complete los datos");
        res.render('contactos/agregar', {
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            telefono: telefono
        })
    }

    if(!errors) {

        var form_data = {
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            telefono: telefono
        }

        dbConn.query('INSERT INTO personas SET ?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)

                res.render('contactos/agregar', {
                    nombre: form_data.nombre,
                    apellido: form_data.apellido,
                    correo: form_data.correo,
                    telefono: form_data.telefono
                })
            } else {
                req.flash('success', 'Contacto agregado correctamente');
                res.redirect('/contactos');
            }
        })
    }
})

router.get('/editar/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM personas WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        if (rows.length <= 0) {
            req.flash('error', 'Contacto no encontrado con esta id' + id)
            res.redirect('/contactos')
        }
        else {
            res.render('contactos/editar', {
                title: 'Editar Contacto',
                id: rows[0].id,
                nombre: rows[0].nombre,
                apellido: rows[0].apellido,
                correo: rows[0].correo,
                telefono: rows[0].telefono
            })
        }
    })
})

router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let correo = req.body.correo;
    let telefono = req.body.telefono
    let errors = false;

    if(nombre.length === 0 || apellido.length === 0 || correo.length === 0 || telefono.length === 0) {
        errors = true;

        req.flash('error', "Please enter name and author");
        res.render('contactos/editar', {
            id: req.params.id,
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            telefono: telefono
        })
    }

    if( !errors ) {

        var form_data = {
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            telefono: telefono
        }
        dbConn.query('UPDATE personas SET ? WHERE id = ' + id, form_data, function(err, result) {
            if (err) {
                req.flash('error', err)
                res.render('contactos/editar', {
                    id: req.params.id,
                    nombre: form_data.nombre,
                    apellido: form_data.apellido,
                    correo: form_data.correo,
                    telefono: form_data.telefono
                })
            } else {
                req.flash('success', 'Contacto actualizado correctamente');
                res.redirect('/contactos');
            }
        })
    }
})

router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM personas WHERE id = ' + id, function(err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/contactos')
        } else {
            req.flash('success', 'Contacto eliminado correctamente con el ID: ' + id)
            res.redirect('/contactos')
        }
    })
})

module.exports = router;