(function (global) {
    var profileViewModel,
        app = global.app = global.app || {}; 
 
    profileViewModel = kendo.data.ObservableObject.extend({ 
        mostrar: function(){
            
            $('#nameEditar').val(window.localStorage.getItem('name'));
    	    $('#emailEditar').val(window.localStorage.getItem('username'));
    	    $('#passwordEditar').val(window.localStorage.getItem('password'));
    		$('#countryEditar').val(window.localStorage.getItem('country'));
    		$('#work-countryEditar').val(window.localStorage.getItem('work'));
    		$('#currentEditar').val(window.localStorage.getItem('current'));
    		$('#companyEditar').val(window.localStorage.getItem('company'));
        },
        validar: function(e){
            e.preventDefault();
            $('.campoEditar').blur();
            var expr = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
            var datos = {};
            datos.id = window.localStorage.getItem('idUsuario');
            datos.name = $('#nameEditar').val();
    	    datos.username = $('#emailEditar').val();
    	    datos.password = $('#passwordEditar').val();
    		datos.country =  $('#countryEditar').val();
    		datos.work = $('#work-countryEditar').val();
    		datos.current = $('#currentEditar').val();
    		datos.company = $('#companyEditar').val();
            
			if( datos.name.length < 1 ){ 
                $("#nameEditar").css("box-shadow","0px 0px 5px red"); 
                app.mostrarMensaje('error','Enter name'); 
            } else if (!expr.test(datos.username)) { 
                $("#nameEditar").css("box-shadow","none"); 
                $("#emailEditar").css("box-shadow","0px 0px 5px red"); 
                app.mostrarMensaje('error','Enter valid email'); 
            } else if( datos.password.length < 1 ) { 
                $("#nameEditar").css("box-shadow","none"); 
                $("#emailEditar").css("box-shadow","none"); 
                $("#passwordEditar").css("box-shadow","0px 0px 5px red"); 
                app.mostrarMensaje('error','Enter password'); 
            } else if (datos.country.length < 1) { 
                $("#nameEditar").css("box-shadow","none"); 
                $("#emailEditar").css("box-shadow","none"); 
                $("#passwordEditar").css("box-shadow","none"); 
                $("#countryEditar").css("box-shadow","0px 0px 5px red"); 
                app.mostrarMensaje('error','Enter country'); 
            } else if (datos.work.length < 1) { 
                $("#nameEditar").css("box-shadow","none"); 
                $("#emailEditar").css("box-shadow","none"); 
                $("#passwordEditar").css("box-shadow","none");
                $("#countryEditar").css("box-shadow","none");
                $("#work-countryEditar").css("box-shadow","0px 0px 5px red");
                app.mostrarMensaje('error','Enter work country');
            } else if (datos.current.length < 1) { 
                $("#nameEditar").css("box-shadow","none"); 
                $("#emailEditar").css("box-shadow","none"); 
                $("#passwordEditar").css("box-shadow","none");
                $("#countryEditar").css("box-shadow","none");
                $("#work-countryEditar").css("box-shadow","none");
                $("#currentEditar").css("box-shadow","0px 0px 5px red");
                app.mostrarMensaje('error','Enter current position'); 
            } else if(datos.company.length < 1) { 
                $("#nameEditar").css("box-shadow","none"); 
                $("#emailEditar").css("box-shadow","none"); 
                $("#passwordEditar").css("box-shadow","none");
                $("#countryEditar").css("box-shadow","none");
                $("#work-countryEditar").css("box-shadow","none");
                $("#currentEditar").css("box-shadow","none");
                $("#companyEditar").css("box-shadow","0px 0px 5px red");
                app.mostrarMensaje('error','Enter company'); 
            } else {
                console.log(datos);
                $.ajax({
                    data:  datos,
				    url: app.servidor+'editar_datos_perfil',
                    type:  'POST',
                })
                .done(function(response){
                    console.log(response);
                    if(response){
                        window.localStorage.setItem('name',datos.name);
                        window.localStorage.setItem('username',datos.username);
                        window.localStorage.setItem('password',datos.password);
                        window.localStorage.setItem('country',datos.country);
                        window.localStorage.setItem('work',datos.work);
                        window.localStorage.setItem('current',datos.current);
                        window.localStorage.setItem('company',datos.company);                    
                        app.mostrarMensaje('success','Data updated successfully');      
                    } else {
                        alert(response);
                    }
                });                
			}
        }
    });
    
    
    app.profileService = {
        viewModel: new profileViewModel()
    };
})(window);