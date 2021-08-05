const express = require('express'); 
const router = express.Router();
const crud = require('./controllers/crud')



//14. conexión datos a consultas
const connection = require('./database/db');

router.get('/consultas', (req, res)=>{

    connection.query('SELECT * FROM producto', (error, results)=>{
        if (error){
            throw error;
        }else{
            res.render('consultas', {results:results});
        }
    });
});

//15. editar datos a consulta
/*router.get('/edit', (req, res) => {
    res.render('edit');
});*/

router.get('/edit/:id_producto', (req, res) => {
    const id_producto=req.params.id_producto;
    connection.query('SELECT * FROM producto WHERE id_producto=?', [id_producto], (error, results)=>{
        if (error){
            throw error;
        }else{
            res.render('edit', {producto:results[0]});
        }
    });
});


//16. eliminar producto
router.get('/delete/:nom_producto', (req, res) => {
    const nom_producto = req.params.nom_producto;
    connection.query('DELETE FROM producto WHERE nom_producto = ?', [nom_producto], (error, results)=>{
        if (error){
            throw error;
        }else{
            res.redirect('/consultas');
        }
    });
});

router.post('/update_prod', crud.update_prod);

module.exports = router;