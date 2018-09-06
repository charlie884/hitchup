(function (global) {
    var loginViewModel,
        app = global.app = global.app || {}; 
 
    loginViewModel = kendo.data.ObservableObject.extend({ 
        mostrar: function(e){            
            $('#username').val('');
    	    $('#password').val('');
        },
        // Validación formulario login
        validar: function(e)
        {
            e.preventDefault();
            $('.campotxt').blur();
            //var expr = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
            
            var username = $('#username').val();
    	    var contrasena = $('#password').val();
            var remember = false;
            if ($('#remember').is(":checked"))
            {
              remember = true;
            }
            
            if (username == ''){
                $("#username").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Enter email or username');
            }
            else if (contrasena == '')
            { 
                $("#username").css("box-shadow","none"); 
                $("#password").css("box-shadow","0px 0px 5px red"); 
                app.mostrarMensaje('error', 'Enter password');
            }
            else{
                $("#username, #password").css("box-shadow","none"); 
                app.loginService.viewModel.login(username,contrasena,remember);
                
            }
        }
       ,
       // Inicio de sesion
        login: function(username,pass,remember){ 
             $.ajax({
                data:  {
                    user: username,
                    pass: pass
                },
    		    url: app.servidor+'iniciar_sesion',
                type:  'POST',
            })
            .done(function(response){
                console.log(response);
                if(response.id){
                    window.localStorage.setItem('idUsuario',response.id);
                    window.localStorage.setItem('name',response.name);
                    window.localStorage.setItem('username',response.username);
                    window.localStorage.setItem('password',pass);
                    window.localStorage.setItem('remember',remember);
                    window.localStorage.setItem('country',response.custom[0].value);
                    window.localStorage.setItem('work',response.custom[1].value);
                    window.localStorage.setItem('current',response.custom[2].value);
                    window.localStorage.setItem('company',response.custom[3].value);
                    $('#nombrePartner').val(response.partner);
                    $('.nombre_partner').text(response.partner);
                    app.application.navigate('view-menu');
                    app.mostrarMensaje('success','Welcome, '+response.name);
                } else {
                    app.mostrarMensaje('error',response.message);
                }
            });
        },
        // Iniciar sesión de caché
        iniciarSesionNoAPP: function(username,pass){
             $.ajax({
                data:  {
                    user: username,
                    pass: pass
                },
			    url: app.servidor+'iniciar_sesion',
                type:  'POST',
            })
            .done(function(response){
                console.log(response);
                if(response.id){
                    window.localStorage.setItem('idUsuario',response.id);
                    window.localStorage.setItem('username',username);
                    window.localStorage.setItem('password',pass); 
                    $('#nombrePartner').val(response.partner);
                    $('.nombre_partner').text(response.partner);
                    app.application = new kendo.mobile.Application(document.body, {
                        skin: 'flat',
                        initial: '#view-menu'
                    });
                    app.mostrarMensaje('success','Welcome, '+response.name);
                } else {
                    app.alerta('warning', response.message);
                }
            });
        },        
        cerrarSesion: function(){
              var n = new Noty
              ({
                 text: 'Do you want to continue?',
                 layout: 'centerTop',
                 buttons: 
                 [
                     Noty.button('Log Out', 'Cancel', function () 
                     {
                         $.ajax({
                                method:'POST',
                                url: app.servidor+'cerrar_sesion',
                                dataType: 'json',
                                data:{
                                    userId:window.localStorage.getItem('idUsuario')
                                }
                         })
                         .done(function( respuesta ) {
                                console.log(respuesta);
                                if(respuesta){
                                    // Eliminar variables de cache
                                    window.localStorage.clear();
                                    app.application.navigate('#view-login');
                                    app.mostrarMensaje('success','Session closed successfully');
                                }
                        }); 
                         n.close();
                     }, 
                     {
                         id: 'button1', 'data-status': 'ok'}),

                     Noty.button('Cancel', 'error', function () 
                     {
                         //console.log('button 2 clicked');
                         n.close();
                     
                    })
               ]
           }).show();
        },
        mostrarRemember:function(){
            $('#email-remember').val('');
        },
        recuperacion: function(e)
        {
            e.preventDefault();
            $('.campoRemember').blur();
             var expr = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
            
            var email = $('#email-remember').val();
            
            if ((email.length < 1 )|| (!expr.test(email)))
            { 
                    $("#email-remember").css("box-shadow","0px 0px 5px red"); 
                    app.mostrarMensaje('error','Enter valid email');    
            }
            else
            {
                $.ajax({
			        url: app.servidor+'recuperar_password_usuario',
                    type:  'POST',
                    data:  {
                        email: email
                    },
                })
                .done(function(response){
                    console.log(response);
                    if(response.error == false){
                        app.mostrarMensaje('success', 'We have sent a verification code to your email address, remember to check your spam Inbox');
                        app.application.navigate('view-reset');
                    } else {
                       app.mostrarMensaje('error', response.message);  
                    }
                });
            }
        },
        mostrarReset:function(){
            $('#codigo').val('');
            $('#ncontra').val('');
            $('#rcontra').val('');
        },
         codigo: function(e){
           e.preventDefault();
           $('.campoReset').blur();
             
           var codigo = $('#codigo').val();
           var ncontra = $('#ncontra').val();
           var rcontra = $('#rcontra').val();
            
           if(codigo < 1){
               $("#codigo").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error','Enter verification code'); 
           }
           else if (ncontra < 1)
           {
               $("#ncontra").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Enter new password');  
            }
            
           else if (rcontra < 1)
           {
               $("#rcontra").css("boxdat-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Re enter password');   
           }
            
          else if ( ncontra != rcontra )
          { app.alerta('error', 'The passwords you entered do not match.'); }
          else { 
              $.ajax({
                    
                    data: {
                        codigo: codigo,
                        ncontra: ncontra
                    },
                    url: app.servidor+'verificar_token',
                    type:  'POST',
               })
              .done(function(response){
                  if(response.error == false){
                      app.mostrarMensaje('success','Password update');
                      app.application.navigate('#view-login');
                  } else {
                      app.mostrarMensaje('error',response.message);
                  }
              })
          }
        },
        mostrarTerminos:function(e){
            e.view.scroller.scrollTo(0, 0);
            
            $('#contentTerminos').html('');
            $.ajax({
            method:'GET', 
            url: app.servidor+'obtener_terminos',
            dataType: 'json'
            })
            .done(function( terms ) {
            	//console.log(terms);
            	$('#contentTerminos').html(terms);
            });
        },
        iniciarPush:function(){
             /* Token para push */
            if(window.localStorage.getItem('idUsuario')){
                // Mostrar una alerta si el usuario tiene abierta la app
                if (window.navigator.simulator !== true){
                    //window.plugins.OneSignal.enableInAppAlertNotification(true);
                    // Registrar Token
                    window.plugins.OneSignal.registerForPushNotifications();
                    //Obtener el id del dispositivo en el servicio - Para envíos sólo a este dispositivo
                 
                    window.plugins.OneSignal.getIds(function(ids) {
                       console.log( "UserId: " + ids.userId );  
                       //alert( "UserId: " + ids.userId );  
                       var deviceId = ids.userId;
                        // Modificar Token Usuario
                        var id = window.localStorage.getItem('idUsuario');
                        Pace.track(function(){
                			$.ajax({
                				url: app.servidor+'guardar_token',
                				type: 'GET',
                				dataType: 'json',
                                data: {
                                    token:deviceId,
                                    id:id
                                }
                			})
                			.done(function(success) {                             
                                if(success){                    
                                    //app.mostrarMensaje('Tus datos han sido almacenados correctamente','success');                               
                                } else {
                                    //app.mostrarMensaje('Hubo un error con tu solicitud, verifica tu internet e intenta nuevamente','error');                                    
                                }
                			})                          
                		}); 
                    });
                }
                
             }
        }
    });
    
    
    app.loginService = {
        viewModel: new loginViewModel()
    };
})(window);