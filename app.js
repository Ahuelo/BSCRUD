//1. invocar express
const express=require('express');
const app=express();


//2. express urlencoded ayuda a que no genere problemas los inicios de sesión
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3. invocar dotenv
const dotenv=require('dotenv');
dotenv.config({path:'./env/.env'});

//4. Directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname+'/public'));

//5. Motor de plantillas ejs
app.set('view engine', 'ejs');

//6. invocamos a bcryptjs
const bcryptjs=require('bcryptjs');

//7. var. de session
const session=require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true
}));

//8. INVOCAR MODULO DE CONEXIÓN DE LA BASE DE DATOS
const connection = require('./database/db');
const { response } = require('express');

//9. Estableciendo las Rutas
app.get('/registro_producto', (req, res) => {
    res.render(('registro_producto'));
});

app.get('/inicio', (req, res) => {
    res.render(('inicio'));
});

app.get('/register', (req, res) => {
    res.render(('register'));
});

//10. Registration Usuarios
app.post('/register', async (req, res) => {
    const id=req.body.id;
    const name_=req.body.name_;
    const last_name=req.body.last_name;
    const rol=req.body.rol;
    const user_=req.body.user_;
    const pass=req.body.pass;
    let passwordHaash= await bcryptjs.hash(pass,8);
    connection.query('insert into usuarios set ?', {id_empleado:id, name_:name_, last_name:last_name, rol:rol, user_:user_, pass:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        } else{
            //Codigo para ventana emergente en registro de ususario
            res.render('register', {
                alert:true,
                alertTitle:'Registro de Nuevo Usuario',
                alertMessage:'Registro Exitoso',
                alerticon:'success',
                showConfirmButton: false,
                timer: 1500,
                ruta:'register'
            });
        }
    });

});

//10.1  Registration Producto
app.post('/registro_producto', (req, res) => {
    const id_produ=req.body.id_produ;
    const nom_producto=req.body.nom_producto;
    const cantidad_producto=req.body.cantidad_producto;
    const magnitud_producto=req.body.magnitud_producto;
    const unidades=req.body.unidades;
    const categoria=req.body.categoria;
    const descrip=req.body.descrip;
    const fecha_v=req.body.fecha_v;

    connection.query('insert into producto set ?', {id_producto:id_produ, nom_producto:nom_producto, cla_producto:categoria, cant_existente:cantidad_producto, desc_producto:descrip,
        valor_magn_producto:magnitud_producto, magn_producto:unidades, fch_venci:fecha_v}, async(error, results)=>{
            if(error){
                console.log(error);
            } else{
                //Codigo para ventana emergente en registro de ususario
                res.render('registro_producto', {
                    alert:true,
                    alertTitle:'Registro de Producto',
                    alertMessage:'Registro Exitoso',
                    alerticon:'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta:'registro_producto'
                });
            }
        });
});

//11. Login autenticación
app.post('/auth', async (req, res) => {
    const usuar=req.body.usuar;
    const passw=req.body.passw;
    let passwordHaash=await bcryptjs.hash(passw,8);
    if(usuar && passw){
        connection.query('select * from usuarios where user_ = ?', [usuar], async(error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(passw, results[0].pass))){
                res.render('index', {
                    alert: true,
                    alertTitle: 'Error',
                    alertMessage: 'usuario y/o contraseña Incorrectas',
                    alerticon: 'error',
                    showConfirmButton: true,
                    timer:false,
                    ruta:''
                });
            } else{
                req.session.loggedin = true;
                //el 'req.session.loggedin = true;' sirve para verificar en el resto de paginas
                req.session.name = results[0].name_
                res.render('index', {
                    alert: true,
                    alertTitle: 'Conexión Exitosa',
                    alertMessage: 'Login Correcto',
                    alerticon: 'success',
                    showConfirmButton: false,
                    timer:1500,
                    ruta:'inicio'
                });
            }
        })
    } else{
        req.session.name = results[0].name_
        res.render('index', {
            alert: true,
            alertTitle: 'Advertencia',
            alertMessage: 'Por favor Ingrese un usuario y/o password',
            alerticon: 'warning',
            showConfirmButton: true,
            timer:false,
            ruta:''
        });
    }
});


//12 auth pages
app.get('/', (req, res) => {
    if(req.session.loggedin){
        res.render('inicio',{
            login: true,
            name: req.session.name_
        });
    }else{
        res.render('index', {
            login: false,
            name:'Debe iniciar sesión primero'
        });
    }
});

//13. Logout
app.get('/logout', (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/');
    })
});

//14. conexión datos a consulta
app.use('/', require('./routes'));

//Conexión de server
app.listen(3000, (req, res) => {
    console.log(`Server started on port in http://localhost:3000`);
});

