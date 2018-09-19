(function (global) {
    var registryViewModel,
        app = global.app = global.app || {}; 
 
    registryViewModel = kendo.data.ObservableObject.extend({ 
        validar: function(e){
            e.preventDefault();
            $('.campoRegistro').blur();
            var expr = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
            var datos = {};
            
            datos.name = $('#name').val();
    	    datos.username = $('#email').val();
    	    datos.password = $('#password-r').val();
    		datos.country =  $('#country').val();
    		datos.work = $('#work-country').val();
    		datos.current = $('#current').val();
    		datos.company = $('#company').val();
            if ($('#checkboxTerms').is(":checked")){
              datos.terminos = 1;
            } else {
              datos.terminos = 0;
            }    		
            
			if( datos.name.length < 1 ){ 
                $("#name").css("box-shadow","0px 0px 5px red"); 
                app.mostrarMensaje('error','Enter name'); 
            } else if (!expr.test(datos.username)) { 
                $("#name").css("box-shadow","none"); 
                $("#email").css("box-shadow","0px 0px 5px red"); 
                app.mostrarMensaje('error','Enter valid email'); 
            } else if( datos.password.length < 1 ) { 
                $("#name").css("box-shadow","none"); 
                $("#email").css("box-shadow","none"); 
                $("#password-r").css("box-shadow","0px 0px 5px red"); 
                app.mostrarMensaje('error','Enter password'); 
            } else if (!$("#checkboxTerms").is(":checked")) { 
                 $("#checkboxTerms").css("box-shadow","0px 0px 5px red");
                 app.mostrarMensaje('error','Accept the terms and conditions');  
            } else {
                console.log(datos);
                $.ajax({
                    data:  datos,
				    url: app.servidor+'crear_cuenta',
                    type:  'POST',
                })
                .done(function(response){
                    console.log(response);
                    if(response.id){                    
                        app.mostrarMensaje('success','Account created successfully');      
                        app.loginService.viewModel.login(datos.username,datos.password);
                    } else {
                        alert(response);
                    }
                });                
			}
        }
    });
    
    
    app.registryService = {
        viewModel: new registryViewModel()
    };
})(window);

// (function (global) {
//     var registryViewModel,
//         app = global.app = global.app || {}; 
 
//     registryViewModel = kendo.data.ObservableObject.extend({ 
//         validar: function(e){
//             e.preventDefault();
//             $('.campoRegistro').blur();
//             var expr = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
//             var datos = {};
            
//             datos.name = $('#name').val();
//             datos.username = $('#email').val();
//             datos.password = $('#password-r').val();
//             datos.country =  $('#country').val();
//             datos.work = $('#work-country').val();
//             datos.current = $('#current').val();
//             datos.company = $('#company').val();
//             if ($('#checkboxTerms').is(":checked")){
//               datos.terminos = 1;
//             } else {
//               datos.terminos = 0;
//             }           
            
//             if( datos.name.length < 1 ){ 
//                 $("#name").css("box-shadow","0px 0px 5px red"); 
//                 app.mostrarMensaje('error','Enter name'); 
//             } else if (!expr.test(datos.username)) { 
//                 $("#name").css("box-shadow","none"); 
//                 $("#email").css("box-shadow","0px 0px 5px red"); 
//                 app.mostrarMensaje('error','Enter valid email'); 
//             } else if( datos.password.length < 1 ) { 
//                 $("#name").css("box-shadow","none"); 
//                 $("#email").css("box-shadow","none"); 
//                 $("#password-r").css("box-shadow","0px 0px 5px red"); 
//                 app.mostrarMensaje('error','Enter password'); 
//             } else if (datos.country.length < 1) { 
//                 $("#name").css("box-shadow","none"); 
//                 $("#email").css("box-shadow","none"); 
//                 $("#password-r").css("box-shadow","none"); 
//                 $("#country").css("box-shadow","0px 0px 5px red"); 
//                 app.mostrarMensaje('error','Enter country'); 
//             } else if (datos.work.length < 1) { 
//                 $("#name").css("box-shadow","none"); 
//                 $("#email").css("box-shadow","none"); 
//                 $("#password-r").css("box-shadow","none");
//                 $("#country").css("box-shadow","none");
//                 $("#work-country").css("box-shadow","0px 0px 5px red");
//                 app.mostrarMensaje('error','Enter work country');
//             } else if (datos.current.length < 1) { 
//                 $("#name").css("box-shadow","none"); 
//                 $("#email").css("box-shadow","none"); 
//                 $("#password-r").css("box-shadow","none");
//                 $("#country").css("box-shadow","none");
//                 $("#work-country").css("box-shadow","none");
//                 $("#current").css("box-shadow","0px 0px 5px red");
//                 app.mostrarMensaje('error','Enter current position'); 
//             } else if(datos.company.length < 1) { 
//                 $("#name").css("box-shadow","none"); 
//                 $("#email").css("box-shadow","none"); 
//                 $("#password-r").css("box-shadow","none");
//                 $("#country").css("box-shadow","none");
//                 $("#work-country").css("box-shadow","none");
//                 $("#current").css("box-shadow","none");
//                 $("#company").css("box-shadow","0px 0px 5px red");
//                 app.mostrarMensaje('error','Enter company'); 
//             } else if (!$("#checkboxTerms").is(":checked")) { 
//                  $("#checkboxTerms").css("box-shadow","0px 0px 5px red");
//                  app.mostrarMensaje('error','Accept the terms and conditions');  
//             } else {
//                 console.log(datos);
//                 $.ajax({
//                     data:  datos,
//                     url: app.servidor+'crear_cuenta',
//                     type:  'POST',
//                 })
//                 .done(function(response){
//                     console.log(response);
//                     if(response.id){                    
//                         app.mostrarMensaje('success','Account created successfully');      
//                         app.loginService.viewModel.login(datos.username,datos.password);
//                     } else {
//                         alert(response);
//                     }
//                 });                
//             }
//         }
//     });
    
    
//     app.registryService = {
//         viewModel: new registryViewModel()
//     };
// })(window);