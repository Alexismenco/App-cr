const express=require('express');
const app=new express();
require('dotenv').config();
const {conexion} = require('./db');
const jwt = require('./utils/jwt');
const { prevenirLogin, permisosAdmin } = require('./middleware/autenticacion');
const nodemailer=require('nodemailer');

const upload = require('express-fileupload');

// configuracion nodmeailer
var transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:process.env.MAILUSER,
    pass:process.env.MAILPASS
  }
});

// configuracion server
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'));
app.use(upload());
app.set('view engine',"ejs");
app.set("views",__dirname+"/views");

// Inicio
app.get('/', async (req,res) => {
  var user;
  var cookie = req.headers.cookie || 'none';
  var nombre;

  try{
    var token = await jwt.verificarToken(cookie);
    var email = await jwt.obtenerEmail(cookie);
    if(token==null){
    user = false;
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('login')
    }else{
      user=true
    }
  }catch (error){
    token=null;
    console.log('Error cookie invalida');
    user = false;
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('login')
  }

  // Buscar nombre
  var buscarNombre='SELECT "Nombre" FROM "Usuarios" WHERE "Email"=$1'
    var parametros=[email]
    var respuestaNombre;
    try{
      respuestaNombre = await conexion.query(buscarNombre,parametros);
      nombre = respuestaNombre.rows[0].Nombre
    } catch(err){
        console.log("Error buscar nombre: "+err.message);
    }
    // Consulta foto perfil
    var consultaFoto='SELECT "Foto_perfil" FROM "Usuarios" WHERE "Email"=$1'
    const parametros2=[email];
    var respuestaFotoPerfil;
    try{
      respuestaFotoPerfil = await conexion.query(consultaFoto,parametros2);
    } catch(err){
        console.log("Error consulta: "+err.message);
    }
    var fotoPerfil;
    try{
      if(respuestaFotoPerfil.rows[0].Foto_perfil==null){
        fotoPerfil= 'perfil.webp';
      }else{
      fotoPerfil= respuestaFotoPerfil.rows[0].Foto_perfil;
      }
    }catch(err){
      console.log("Error encontrar nombre: "+err.message);
      fotoPerfil= 'perfil.webp';
    }


    res.render('index',{user, nombre, fotoPerfil})
})

// Perfil
app.get('/perfil', async (req,res) => {
  var user;
  var cookie = req.headers.cookie || 'none';
  var nombre;

  try{
    var token = await jwt.verificarToken(cookie);
    var email = await jwt.obtenerEmail(cookie);
    if(token==null){
    user = false;
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('/login')
    }else{
      user=true
    }
  }catch (error){
    token=null;
    console.log('Error cookie invalida');
    user = false;
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('/login')
  }

  // Buscar nombre
  var buscarNombre='SELECT "Nombre" FROM "Usuarios" WHERE "Email"=$1'
    var parametros=[email]
    var respuestaNombre;
    try{
      respuestaNombre = await conexion.query(buscarNombre,parametros);
      nombre = respuestaNombre.rows[0].Nombre
    } catch(err){
        console.log("Error buscar nombre: "+err.message);
    }
    // Consulta foto perfil
    var consultaFoto='SELECT "Foto_perfil" FROM "Usuarios" WHERE "Email"=$1'
    const parametros2=[email];
    var respuestaFotoPerfil;
    try{
      respuestaFotoPerfil = await conexion.query(consultaFoto,parametros2);
    } catch(err){
        console.log("Error consulta: "+err.message);
    }
    var fotoPerfil;
    try{
      if(respuestaFotoPerfil.rows[0].Foto_perfil==null){
        fotoPerfil= 'perfil.webp';
      }else{
      fotoPerfil= respuestaFotoPerfil.rows[0].Foto_perfil;
      }
    }catch(err){
      console.log("Error encontrar nombre: "+err.message);
      fotoPerfil= 'perfil.webp';
    }

  res.render('perfil',{user, nombre, fotoPerfil})
})

// Editar perfil
app.get('/perfil/edit', async (req,res) => {
  var user;
  var cookie = req.headers.cookie || 'none';
  var nombre;

  try{
    var token = await jwt.verificarToken(cookie);
    var email = await jwt.obtenerEmail(cookie);
    if(token==null){
    user = false;
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('/login')
    }else{
      user=true
    }
  }catch (error){
    token=null;
    console.log('Error cookie invalida');
    user = false;
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('/login')
  }

  // Buscar nombre
  var buscarNombre='SELECT "Nombre" FROM "Usuarios" WHERE "Email"=$1'
    var parametros=[email]
    var respuestaNombre;
    try{
      respuestaNombre = await conexion.query(buscarNombre,parametros);
      nombre = respuestaNombre.rows[0].Nombre
    } catch(err){
        console.log("Error buscar nombre: "+err.message);
    }

     // Consulta foto perfil
    var consultaFoto='SELECT "Foto_perfil" FROM "Usuarios" WHERE "Email"=$1'
    const parametros2=[email];
    var respuestaFotoPerfil;
    try{
      respuestaFotoPerfil = await conexion.query(consultaFoto,parametros2);
    } catch(err){
        console.log("Error consulta: "+err.message);
    }
     var fotoPerfil;
   try{
      if(respuestaFotoPerfil.rows[0].Foto_perfil==null){
        fotoPerfil= 'perfil.webp';
      }else{
      fotoPerfil= respuestaFotoPerfil.rows[0].Foto_perfil;
      }
    }catch(err){
      console.log("Error encontrar nombre: "+err.message);
      fotoPerfil= 'perfil.webp';
    }

  res.render('perfiledit',{user, nombre, email, fotoPerfil})
})

// Editar perfil
app.post('/perfil/edit', async (req,res) => {
  var cookie = req.headers.cookie || 'none';

  try{
    var token = await jwt.verificarToken(cookie);
    var email = await jwt.obtenerEmail(cookie);
    if(token==null){
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('/login')
    }
  }catch (error){
    token=null;
    console.log('Error editar perfil');
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('/login')
  }

  if(req.body.nombre){
    // Cambiar nombre
    var actualizaNombre='UPDATE "Usuarios" SET "Nombre"=$1 WHERE "Email"=$2'
    var parametros=[req.body.nombre, email]
    var respuestaNombre;
    try{
      respuestaNombre = await conexion.query(actualizaNombre,parametros);
    } catch(err){
        console.log("Error cambiar nombre: "+err.message);
    }
    console.log(respuestaNombre)
  }else if(req.body.email){
    // Cambiar email
    var actualizaEmail='UPDATE "Usuarios" SET "Email"=$1 WHERE "Email"=$2'
    var parametros2=[req.body.email, email]
    var respuestaEmail;
    try{
      respuestaEmail = await conexion.query(actualizaEmail,parametros2);
      // Destruye la cookie
      res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    } catch(err){
        console.log("Error cambiar email: "+err.message);
    }

    // Buscar datos usuario
  var consultaUsuario='SELECT "Nombre" ,"Email" from "Usuarios" WHERE "Email"=$1'
  const parametros3=[req.body.email];
  var respuestaUsuario;

  try{
    respuestaUsuario = await conexion.query(consultaUsuario,parametros3);
     // Si existe genera la cookie
    if(respuestaUsuario.rows[0]!==undefined){
      const usuario = {
        email:respuestaUsuario.rows[0].Email,
        nombre:respuestaUsuario.rows[0].Nombre
      }
      const token = await jwt.generarToken(usuario);
      res.cookie(process.env.JWT_COOKIE,token,{httpOnly:true});
    }
  } catch(err){
      console.log("Error generar cookie: "+err.message);
  }

  }else if(req.files.foto){
    // Agregar foto de perfil
   var perfil=req.files.foto;

   var insertarFoto='UPDATE "Usuarios" SET "Foto_perfil"=$1 WHERE "Email"=$2;'
   const parametros14=[perfil.name,email];
   var respuestaFoto;
   try{
      respuestaFoto = await conexion.query(insertarFoto,parametros14);
      perfil.mv(`./public/perfil/${perfil.name}`,err => {
        if(err) return res.status(500).send({ message : err })     
    })
   } catch(err){
       console.log("Error añadir foto perfil: "+err.message);
   }

  }else if(req.body.passworda){
    // Cambiar contraseña
    var actualizaPassword='UPDATE "Usuarios" SET "Password"=$1 WHERE "Email"=$2 AND "Password"=$3'
    var parametros4=[req.body.passwordn, email, req.body.passworda]
    var respuestaPassword;
    try{
      respuestaPassword = await conexion.query(actualizaPassword,parametros4);
    } catch(err){
        console.log("Error cambiar email: "+err.message);
    }
  }

  res.redirect('/perfil/edit')
})


// Calculadora
app.get('/calculadora', async (req,res) => {
  var user;
  var cookie = req.headers.cookie || 'none';
  var nombre;

  try{
    var token = await jwt.verificarToken(cookie);
    var email = await jwt.obtenerEmail(cookie);
    if(token==null){
    user = false;
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('login')
    }else{
      user=true
    }
  }catch (error){
    token=null;
    console.log('Error cookie invalida');
    user = false;
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('login')
  }

  // Buscar nombre
  var buscarNombre='SELECT "Nombre" FROM "Usuarios" WHERE "Email"=$1'
    var parametros=[email]
    var respuestaNombre;
    try{
      respuestaNombre = await conexion.query(buscarNombre,parametros);
      nombre = respuestaNombre.rows[0].Nombre
    } catch(err){
        console.log("Error buscar nombre: "+err.message);
    }
    // Consulta foto perfil
    var consultaFoto='SELECT "Foto_perfil" FROM "Usuarios" WHERE "Email"=$1'
    const parametros2=[email];
    var respuestaFotoPerfil;
    try{
      respuestaFotoPerfil = await conexion.query(consultaFoto,parametros2);
    } catch(err){
        console.log("Error consulta: "+err.message);
    }
     var fotoPerfil;
     try{
      if(respuestaFotoPerfil.rows[0].Foto_perfil==null){
        fotoPerfil= 'perfil.webp';
      }else{
      fotoPerfil= respuestaFotoPerfil.rows[0].Foto_perfil;
      }
    }catch(err){
      console.log("Error encontrar nombre: "+err.message);
      fotoPerfil= 'perfil.webp';
    }

  res.render('calculadora',{user, nombre, fotoPerfil})
})

// Comunidad
app.get('/comunidad', async (req,res) => {
  var user;
  var cookie = req.headers.cookie || 'none';
  var nombre;

  try{
    var token = await jwt.verificarToken(cookie);
    var email = await jwt.obtenerEmail(cookie);
    if(token==null){
    user = false;
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('login')
    }else{
      user=true
    }
  }catch (error){
    token=null;
    console.log('Error cookie invalida');
    user = false;
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('login')
  }

  // Buscar nombre
  var buscarNombre='SELECT "Nombre" FROM "Usuarios" WHERE "Email"=$1'
    var parametros=[email]
    var respuestaNombre;
    try{
      respuestaNombre = await conexion.query(buscarNombre,parametros);
      nombre = respuestaNombre.rows[0].Nombre
    } catch(err){
        console.log("Error buscar nombre: "+err.message);
    }
    // Consulta foto perfil
    var consultaFoto='SELECT "Foto_perfil" FROM "Usuarios" WHERE "Email"=$1'
    const parametros2=[email];
    var respuestaFotoPerfil;
    try{
      respuestaFotoPerfil = await conexion.query(consultaFoto,parametros2);
    } catch(err){
        console.log("Error consulta: "+err.message);
    }
    var fotoPerfil;
    try{
      if(respuestaFotoPerfil.rows[0].Foto_perfil==null){
        fotoPerfil= 'perfil.webp';
      }else{
      fotoPerfil= respuestaFotoPerfil.rows[0].Foto_perfil;
      }
    }catch(err){
      console.log("Error encontrar nombre: "+err.message);
      fotoPerfil= 'perfil.webp';
    }
  // Buscar su nick
  var consultaNick='SELECT "Nick" from "Usuarios" WHERE "Email"=$1'
  var parametros=[email]
  var respuestaNick;
  try{
    respuestaNick = await conexion.query(consultaNick,parametros);
  } catch(err){
      console.log("Error consulta: "+err.message);
  }

  var nickExiste;
  try{
    if(respuestaNick.rows[0].Nick!==null){
      nickExiste = respuestaNick.rows[0].Nick;
    }else{
      nickExiste='';
    }
  }catch(err){
    nickExiste='';
  }
 
  res.render('comunidad',{user, nombre,fotoPerfil, nickExiste})
})

//Agregar nick a usuario
app.post('/nick', async (req,res) => {
  var cookie = req.headers.cookie || 'none';
  try{
    var token = await jwt.verificarToken(cookie);
    var email = await jwt.obtenerEmail(cookie);
    if(token==null){
    user = false;
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('login')
    }
  }catch (error){
    token=null;
    console.log('Error cookie invalida');
    res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
    res.redirect('login')
  }

  // Agregar el nick
  var agregarNick='UPDATE "Usuarios" SET "Nick"=$1 WHERE "Email"=$2'
  var parametros=[req.body.nick, email];
  var respuestaNick;
  try{
    respuestaNick = await conexion.query(agregarNick,parametros);
  } catch(err){
      console.log("Error agregar nick: "+err.message);
  }

  setTimeout(function() {
    res.redirect('comunidad');
  }, 700);
})

//------------------------------------------------------------------------------------------

//Register
app.get('/register',prevenirLogin, (req,res) => {
  var user=req.headers.cookie || false ;
  var existe=false;
  var codigoExiste=true;
  res.render('register',{user:user, existe,codigoExiste:codigoExiste})
})

app.post("/register", async function (req,res){
  // Consulta si el email esta registrado
  var consultaUser='SELECT "Email" from "Usuarios" WHERE "Email"=$1'
  const parametros=[req.body.email];
  var respuestaUser;
  var existe=false;
  try{
    respuestaUser = await conexion.query(consultaUser,parametros);
  } catch(err){
      console.log("Error consulta: "+err.message);
  }


  try{
    if(respuestaUser.rows[0].Email==req.body.email){
      existe= true;
      var user=req.headers.cookie || false ;
      var codigoExiste=true;

      res.render('register',{user:user, existe:existe, codigoExiste:codigoExiste})
    }
  }catch(err){
    console.log("Error consulta: "+err.message);
    
  }  

  // Codigo valido
  var consultaCodigo='SELECT "codigo" FROM "codigo" WHERE "codigo"=$1;'
  var parametros7 = [req.body.codigo];
  var codigoExiste= false;
  var respuestaCodigo;

  try{
    respuestaCodigo = await conexion.query(consultaCodigo,parametros7);
  } catch(err){
      console.log("Error consulta: "+err.message);
  }

  try{
    if(respuestaCodigo.rows[0].codigo==req.body.codigo){
      codigoExiste= true;

      // Borrar codigo
      var borrarCodigo='DELETE FROM "codigo" WHERE "codigo"=$1;'
      const parametros8=[req.body.codigo];
      var respuestaBorrar;
      try{
        respuestaBorrar = await conexion.query(borrarCodigo,parametros8);
      } catch(err){
          console.log("Error consulta: "+err.message);
      }

    }
  }catch(err){
    console.log("Error consulta: "+err.message);
    codigoExiste=false;

    res.render('register',{user:user, existe:existe, codigoExiste:codigoExiste})

    
  }  

  // Agrega Usuario
    var registrar='INSERT INTO "Usuarios"("Nombre", "Email", "Password", "Tipo") VALUES ($1, $2, $3, 2);';
    const parametros2=[req.body.name,req.body.email,req.body.password[0]];
    var respuestaRegistro;
    try{
      respuestaRegistro = await conexion.query(registrar,parametros2);
    } catch(err){
        console.log("Error consulta: "+err.message);
        var user=req.headers.cookie || false ;
        var existe=false;

        res.render('register',{user:user, existe})
    }

    // Añadir codigo a usuario
    var agregarCodigo='UPDATE "Usuarios" SET "Codigo"=$1 WHERE "Email"=$2;'
    const parametros9=[req.body.codigo,req.body.email];
    var resultadoAgregar;
    try{
      resultadoAgregar = await conexion.query(agregarCodigo,parametros9);
    } catch(err){
        console.log("Error consulta: "+err.message);
    }

    var rolAdmin=req.headers.cookie || false ;
    var nouser=true;
  // msg si viene de restauracion contraseña
    var msg=false;
    var existeUsuario= true;

    res.render('login',{rolAdmin:rolAdmin, nouser:nouser, msg:msg, existeUsuario:existeUsuario})
  })

  // Restaurar contraseña
  app.get('/resetpassword', async (req,res) => {
    var rolAdmin=req.headers.cookie || false ;
    var mensaje = false;
    res.render('restorePass',{rolAdmin:rolAdmin, mensaje:mensaje})
})


app.post('/resetpassword', async (req,res) => {
  var rolAdmin=req.headers.cookie || false ;

  // Genera codigo de restauracion
  var codigo='';

  while(codigo.length<=5){
    codigo+= Math.floor((Math.random() * 10))

  }
  codigo = parseInt(codigo);

  // Almacenar en la db codigo
  var ingresarCodigo='UPDATE "Usuarios" SET "Restore"=$1 WHERE "Email"=$2;';
    const parametros3=[codigo,req.body.email];
    var respuestaCodigo;
    try{
      respuestaCodigo = await conexion.query(ingresarCodigo,parametros3);
    } catch(err){
        console.log("Error consulta: "+err.message);
      
    }

  // Envia correo al user
  let mensajeCorreo = "Restaurar contraseña\n";
  mensajeCorreo+="codigo:"+codigo+"\n";
  let mail={
    from: req.body.email,
    to: req.body.email,
    subject:'Restaurar contraseña',
    text:mensajeCorreo
  }
  transporter.sendMail(mail,function(err,info){
    if(err){
      console.log("Error en correo: "+err.message);
      res.status(500).send("Error al enviar correo");
    }else{
      console.log("Correo restaurar contraseña enviado: "+ info.response);
    }
  })

  var rolAdmin=req.headers.cookie || false ;
  var correo=req.body.email
  var mensaje=false;

  res.render('restoreCode',{rolAdmin:rolAdmin, correo:correo, mensaje:mensaje})
})


// Restaurar contraseña
app.get('/restoreCode', async (req,res) => {
  var rolAdmin=req.headers.cookie || false ;
  var mensaje=false;
  res.render('restoreCode',{rolAdmin:rolAdmin, mensaje:mensaje})
})

app.post('/restoreCode', async (req,res) => {
  var rolAdmin=req.headers.cookie || false ;

  var consultaPass='SELECT "Email","Restore" from "Usuarios" WHERE "Email"=$1 AND "Restore"=$2'

  const parametrosPass=[req.body.email,req.body.codigo];
  var respuestaPass;

  try{
    respuestaPass = await conexion.query(consultaPass,parametrosPass);
  } catch(err){
      console.log("Error consulta: "+err.message);
  }

  if(respuestaPass.rows[0]==undefined){
    var rolAdmin=req.headers.cookie || false ;
    var mensaje=true;
    var correo= 'none';


    res.render('restoreCode',{rolAdmin:rolAdmin, mensaje:mensaje, correo:correo})
    
  }else{
    var correo=req.body.email;

    res.render('passwordNew',{rolAdmin:rolAdmin, correo:correo})

  }
})

app.post('/passwordNew', async (req,res) => {

  var actualizarPass='UPDATE "Usuarios" SET "Password"=$1 WHERE "Email"=$2;';
    const parametros5=[req.body.password,req.body.email];
    var respuestaActualizacion;
    try{
      respuestaActualizacion = await conexion.query(actualizarPass,parametros5);

    } catch(err){
        console.log("Error consulta: "+err.message);
      
    }
    var rolAdmin=req.headers.cookie || false ;
    var nouser=true;
    var msg=true;
    var existeUsuario= true;

    res.render('login',{rolAdmin:rolAdmin, nouser:nouser, msg:msg, existeUsuario:existeUsuario})

})

//------------------------------------------------------------------------------------------

// Agregar Productos
app.get("/product" ,permisosAdmin , async function (req,res){

  var user;
  var cookie = req.headers.cookie || 'none';

  try{
    var token = await jwt.verificarToken(cookie);
    if(token==null){
    user = false;
    }else{
      user=true
    }
  }catch (error){
    token=null;
    console.log('Error cookie invalida');
    user = false;
  }
  res.render('productos', {user})
})

app.post("/product" , async function (req,res){

  //Buscar el ultimo id
  var buscarId = 'SELECT "id" FROM "Pistas" ORDER BY id DESC LIMIT 1'
  var respuestaId;
  try{
    respuestaId = await conexion.query(buscarId);
  } catch(err){
      console.log("Error buscar ultimo id: "+err.message);
  }

  var idPista = 1;
  if(respuestaId.rows[0]!==undefined){ 
    idPista = respuestaId.rows[0].id + 1;
  }
    

  // Agregar pista
   var insertarPista='INSERT INTO "Pistas"(id, nombre, autor, link) VALUES ($1, $2, $3, $4);'
   const parametrosPista=[idPista, req.body.nombre,req.body.autor, req.body.link];
   var respuestaPista;
 
   try{
     respuestaPista = await conexion.query(insertarPista,parametrosPista);
   } catch(err){
       console.log("Error agregar pista: "+err.message);
   }

   res.redirect('product');
})

// Login
app.get("/login",prevenirLogin , async function (req,res){
    var existeUsuario=true;
 
    res.render('login',{existeUsuario})
})

app.post("/login", async function (req,res){

  // Usuario registrado en la db
  var consultaUsuario='SELECT "Nombre" ,"Email","Password" from "Usuarios" WHERE "Email"=$1 AND "Password"=$2'
  const parametros=[req.body.email,req.body.password];
  var respuestaUsuario;
  var existeUsuario=true;

  try{
    respuestaUsuario = await conexion.query(consultaUsuario,parametros);
  } catch(err){
      console.log("Error login: "+err.message);
  }
  // Si existe genera la cookie
  if(respuestaUsuario.rows[0]!==undefined){

    const usuario = {
      email:respuestaUsuario.rows[0].Email,
      nombre:respuestaUsuario.rows[0].Nombre
    }
    const token = await jwt.generarToken(usuario);
    
    res.cookie(process.env.JWT_COOKIE,token,{httpOnly:true});
    res.redirect('/');
  }else{
    existeUsuario=false;
    res.render('login', {existeUsuario});
  }
 
})


// Contactar
app.get('/contacto', async (req,res) => {
  
  var user;
  var cookie = req.headers.cookie || 'none';

  try{
    var token = await jwt.verificarToken(cookie);
    if(token==null){
    user = false;
    }else{
      user=true
    }
  }catch (error){
    token=null;
    console.log('Error cookie invalida');
    user = false;

  }
  res.render('contacto',{user})
})


  // Se envia correo
app.post("/enviarcontacto",function(req,res){
  let mensaje = "Mensaje desde formulario de contacto\n";
  mensaje+="de :"+req.body.nombre+"\n";
  mensaje+="correo: "+req.body.correo+"\n";
  mensaje+="mensaje: "+req.body.comentario;
  let mail={
    from: req.body.correo,
    to: 'mencoalexis@gmail.com',
    subject:'mensaje formulario contacto',
    text:mensaje
  }
  transporter.sendMail(mail,function(err,info){
    if(err){
      console.log("Error en correo: "+err.message);
      res.status(500).send("Error al enviar correo");
    }else{
      console.log("Correo enviado: "+ info.response);
      res.redirect("/contacto");
    }
  })
})

// Cerrar sesión
app.post("/logout", function (req,res){
  res.cookie(process.env.JWT_COOKIE,"",{httpOnly:true,maxAge:1});
  res.redirect("/login");

})


module.exports={app}