const mysql=require('mysql');
const connection=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
});


connection.connect((error)=>{
    if(error){
        console.log('error de conexión a la base de datos'+error);
        return;
    }
    console.log('Conexión Exitosa a la base de Datos');
});

module.exports=connection;



