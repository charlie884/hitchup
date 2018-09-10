'use strict';

(function(global) {
    var app = global.app = global.app || {};
    
    app.urlServidor = 'https://app.myhitchplanner.com/';
    app.servidor = 'https://app.myhitchplanner.com/index.php?option=com_functions&task=';

    app.mostrarMensaje = function(type,text){
         new Noty({
         type: type,
         text: text,
         timeout: 3000
       }).show();  
    } 
    app.numbersonly = function(myfield,e,dec){
        var key;
		var keychar;
		if (window.event)
		   key = window.event.keyCode;
		else if (e)
		   key = e.which;
		else
		   return true;
		keychar = String.fromCharCode(key);
		// control keys
		if ((key==null) || (key==0) || (key==8) || 
		    (key==9) || (key==13) || (key==27) )
		   return true;
		// numbers
		else if ((("0123456789,").indexOf(keychar) > -1))
		   return true;
		// decimal point jump
		else if (dec && (keychar == ","))
		   {
		   myfield.form.elements[dec].focus();
		   return false;
		   }
		else
		   return false;
    }
    
    if (window.cordova) {
        // document.addEventListener("resume", function(){ 
        //     console.log('cordova file: '+cordova.file);
        //     $.ajax({
        //         method:'GET',
        //         url: app.servidor+'validateAppVersion',
        //         dataType: 'json',
        //         data:{
        //             appVersion:value,
        //         }
        //     })
        //     .done(function(response) {
        //         console.log('done version'+JSON.stringify(response));  
        //         if(response.status === 1){ 
        //             console.log('version actual'+response.message);
        //         } else {
        //             console.log('version nueva'+response.message);
        //             function updateApp() {
        //                if (device.platform == 'Android') {
        //                    //fallbackLink = 'https://play.google.com/store/apps/details?id=com.emeraldstudio.DirecTv&hl=es'; 
        //                    fallbackLink =""
        //                     window.open(fallbackLink, '_blank', 'location=yes'); 
        //                 }
        //                 if (device.platform == 'iOS') { 
        //                     //fallbackLink = 'https://itunes.apple.com/us/app/FaciDoc/id1141940366?mt=8';
        //                     fallbackLink =""
        //                     window.open(fallbackLink, '_blank', 'location=yes'); 
        //                 }                     
        //             }

        //             navigator.notification.alert(
        //                 response.message, // message
        //                 updateApp, // callback
        //                 'Actualización', // title
        //                 'Ir a la tienda' // buttonName
        //             );
        //         }
        //     });
        // });
        document.addEventListener('deviceready', function() {
            
            StatusBar.backgroundColorByHexString("#363e5f");
            
            //Cuando se encuentre listo...
            if (window.navigator.simulator !== true){
                 
   
                //Google Analytics
                //window.analytics.startTrackerWithId('UA-75229632-1'); 
                
                 //Proceso para iniciar los Push en el dispositivo.
                window.plugins.OneSignal.init(
                	"86863d2f-cf06-43dd-ae0c-0bb49a1394d6", //ID creado en OneSignal
                	{googleProjectNumber: "167094528604",autoRegister:false}, //ID creado en Google Console
                    notificationOpenedCallback); //Función ejecutada al llegar el push
              
                /*$.ajaxSetup({
                  error:function(e){
                      app.mostrarMensaje('Error de conexión','Error comunicando con la plataforma','error','OK');
                  }
                });*/ 
                
                cordova.getAppVersion(function(value) {
                    console.log('getAppVersion: '+value);
                    // Validate AppVersion
                    $.ajax({
                        method:'GET',
                        url: app.servidor+'validateAppVersion',
                        dataType: 'json',
                        data:{
                            appVersion:value,
                        }
                    })
                    .done(function(response) {
                        console.log(JSON.stringify(response));  
                        if(response.status === 1){ 
                            console.log('version actual'+response.message);
                        } else {
                            console.log('version nueva'+response.message);
                            function updateApp() {
                               if (device.platform == 'Android') {
                                   //fallbackLink = 'https://play.google.com/store/apps/details?id=com.emeraldstudio.DirecTv&hl=es'; 
                                   fallbackLink =""
                                    window.open(fallbackLink, '_blank', 'location=yes'); 
                                }
                                if (device.platform == 'iOS') { 
                                    //fallbackLink = 'https://itunes.apple.com/us/app/FaciDoc/id1141940366?mt=8';
                                    fallbackLink =""
                                    window.open(fallbackLink, '_blank', 'location=yes'); 
                                }                     
                            }

                            navigator.notification.alert(
                                response.message, // message
                                updateApp, // callback
                                'Actualización', // title
                                'Ir a la tienda' // buttonName
                            );
                        }
                    });
                });
            }
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }

            var element = document.getElementById('appDrawer');
            if (typeof(element) != 'undefined' && element !== null) {
                if(window.navigator.msPointerEnabled) {
                    $('#navigation-container').on('MSPointerDown', 'a', function(event) {
                        app.keepActiveState($(this));
                    });
                }else{
                    $('#navigation-container').on('touchstart', 'a', function(event) {
                        app.keepActiveState($(this));
                    });
                }
            }
            var usuario = window.localStorage.getItem('username');
            var password = window.localStorage.getItem('password');
            var remember = window.localStorage.getItem('remember');
            if(usuario && password && remember){
                console.log('cache');
                app.loginService.viewModel.iniciarSesionNoAPP(usuario,password);
            }else{
                app.application = new kendo.mobile.Application(document.body, {
                    skin: 'flat',
                    initial: '#view-login'
                });
            }
        }, false);
    } else {
        bootstrap();
    }
    
    
    
    var notificationOpenedCallback = function(jsonData) {
    	console.log('Push recibida: ' + JSON.stringify(jsonData));
    	//Aquí se recibe la información enviada desde el servicio
    	var mensaje = jsonData.message; //Título de la notificación enviada
    	//Así se recibe la información a través del parámetro data, enviado desde el servidor
    	//Data Object
    	var datosAdicionales = jsonData.additionalData;
    	//Ejemplo con una variable id enviada
    	//var id = datosAdicionales.id;
        if(jsonData.isActive == true){
            
            navigator.notification.confirm(
                '', // message
                 function(boton){
                     if(boton === 1){
                         app.application.navigate(datosAdicionales.vista);
                     }
                 },            // callback to invoke with index of button pressed
                mensaje,           // title
                ['Ver','Omitir']     // buttonLabels
            );
             
        } else {    
            
            navigator.notification.confirm(
                '', // message
                 function(boton){
                     if(boton === 1){                  
                        if(window.localStorage.getItem('idUsuario')){
                            app.application.navigate(datosAdicionales.vista);
                        } 
                     }
                 },            // callback to invoke with index of button pressed
                mensaje,           // title
                ['Ver','Omitir']     // buttonLabels
            ); 
            
        }
    	//alert('Push Recibida: ' + JSON.stringify(jsonData));
    };
    
    
    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function(url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };

    /// start appjs functions
    /// end appjs functions
    app.showFileUploadName = function(itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function(event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function(formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function(key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };

    /// start kendo binders
    kendo.data.binders.widget.buttonText = kendo.data.Binder.extend({
        init: function(widget, bindings, options) {
            kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        },
        refresh: function() {
            var that = this,
                value = that.bindings["buttonText"].get();

            $(that.element).text(value);
        }
    });
    /// end kendo binders
})(window);
