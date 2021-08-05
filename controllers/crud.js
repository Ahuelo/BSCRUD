const connection = require('../database/db');

exports.update_prod=(req, res)=>{
    const id_produ=req.body.id_produ;
    const nom_producto=req.body.nom_producto;
    const cantidad_producto=req.body.cantidad_producto;
    const magnitud_producto=req.body.magnitud_producto;
    const unidades=req.body.unidades;
    const categoria=req.body.categoria;
    const descrip=req.body.descrip;
    const fecha_v=req.body.fecha_v;
    connection.query('UPDATE producto SET ? WHERE id_producto = ?', [{nom_producto:nom_producto, cla_producto:categoria, cant_existente:cantidad_producto, desc_producto:descrip,
        valor_magn_producto:magnitud_producto, magn_producto:unidades, fch_venci:fecha_v}, id_produ], (error, results)=>{
            if(error){
                console.log(error);
            } else{
                res.redirect('consultas');
            }
        })
};