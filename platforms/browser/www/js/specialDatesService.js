(function (global) {
    var specialDatesViewModel,
        app = global.app = global.app || {}; 
 
    specialDatesViewModel = kendo.data.ObservableObject.extend({ 
        mostrar: function(e){ 
            e.view.scroller.scrollTo(0, 0);  
            var data = {};
            data.usuario = window.localStorage.getItem('idUsuario'),
            $.ajax({
                method:'GET',
                url: app.servidor+'obtener_fechas_especiales',
                dataType: 'json',
                data: data
            })
            .done(function( eventos ) {
                //console.log(eventos);
                 $('#special-dates').fullCalendar({
                    timezone:'America/Bogota',
                    lang: 'es',
                    view:'month',
                    selectable:true,
                    defaultView:'listYear',
                    contentHeight:'3000',
                    header: {
                        left: 'prev',
                        center: 'title',
                        right: 'next'
                    }, 
                    eventRender: function(event, element) {
                        console.log(event);
                    },
			        events: eventos, 
                    eventClick: function(event, jsEvent, view) {
                         var date= event.start.format();
                         event.fecha = date;
                        console.log(event);
                         var n = new Noty
                          ({
                                 text: 'How you want to continue?',
                                 layout: 'centerTop',
                                 timeout: 3000,
                                 buttons: 
                                 [
                                     Noty.button('Edit', 'Delete', function () 
                                     {
                                        // EDIT
                                         app.application.navigate('view-special-form-edit?fecha='+event.fecha+'&id='+event.id+'&titulo='+event.title+'&descripcion='+event.description);
                                         n.close();
                                     }, 
                                     {
                                         id: 'button1', 'data-status': 'ok'}),

                                     Noty.button('Delete', 'error', function () 
                                     {
                                        // DELETE
                                         $.ajax({
                                                method:'POST',
                                                url: app.servidor+'eliminar_fecha_especial',
                                                dataType: 'json',
                                                data:{
                                                    usuario:window.localStorage.getItem('idUsuario'),
                                                    id:event.id
                                                }
                                         })
                                         .done(function( respuesta ) {
                                                console.log(respuesta);
                                                if(respuesta){
                                                    app.mostrarMensaje('success','Event deleted');
                                                    app.specialDatesService.viewModel.mostrar;
                                                     $('#special-dates').fullCalendar( 'removeEvents',event.id );
                                                }
                                        }); 
                                         n.close();
                                     
                                    })
                               ]
                           }).show();
                    }
                });
            });
         },
        ocultarCalendario:function(){
            jQuery('#special-dates').fullCalendar( 'destroy' );
        },
        iniciarForm: function(e){
            e.view.scroller.scrollTo(0, 0);
            
            var d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            var fecha_actual = [year, month, day].join('-');
            
            $('#fechaSpecial').val(fecha_actual);
            $('#descripcionSpecial').val('');
            $('#tituloSpecial').val('');
        },
        validarSpecial: function(e){
            e.preventDefault();
            $('.campoSpecial').blur();
            var titulo = $('#tituloSpecial').val();
    	    var fecha = $('#fechaSpecial').val();
            var descripcion = $('#descripcionSpecial').val();
                             
            if (fecha == ''){
                $("#fechaSpecial").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Select date');
            }
            else if (titulo == '')
            { 
                $("#fechaSpecial").css("box-shadow","none"); 
                $("#tituloSpecial").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Enter title event');
            }
            else{
                $("#tituloSpecial, #fechaSpecial, #descripcionSpecial").css("box-shadow","none"); 
                var data = {};
                data.titulo = titulo;
                data.fecha = fecha;
                data.descripcion = descripcion;
                data.id=window.localStorage.getItem('idUsuario');
                
                $.ajax({
                    method:'GET',
                    url: app.servidor+'almacenar_fecha_especial',
                    dataType: 'json',
                    data: data
                })
                .done(function( response ) {
                    console.log(response.event);
                    if(response.status == '1'){
                        app.application.navigate('view-special-dates');  
                       app.mostrarMensaje('success', 'Added event successfully');                   
                    } else {
                       app.mostrarMensaje('error', response.message);
                    }
                })
                
            }
        },
        idEditar: null,
        edicionForm: function(e){
            e.view.scroller.scrollTo(0, 0);
            console.log(e.view.params);
            var id = e.view.params.id;
            app.specialDatesService.viewModel.idEditar = id;
            var fecha = e.view.params.fecha;
            var titulo = e.view.params.titulo;
            var descripcion = e.view.params.descripcion;
            $("#fechaSpecialEdit, #descripcionSpecialEdit, #tituloSpecialEdit").css("box-shadow","none"); 
             
            $('#fechaSpecialEdit').val(fecha);
            $('#descripcionSpecialEdit').val(descripcion);
            $('#tituloSpecialEdit').val(titulo);
            
        },        
        guardarSpecial: function(e){
           
            e.preventDefault();
            var titulo = $('#tituloSpecialEdit').val();
    	    var fecha = $('#fechaSpecialEdit').val();
            var descripcion = $('#descripcionSpecialEdit').val();
                             
            if (fecha == ''){
                $("#fechaSpecialEdit").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Select date');
            }
            else if (titulo == '')
            { 
                $("#fechaSpecialEdit").css("box-shadow","none"); 
                $("#tituloSpecialEdit").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Enter title event');
            }
            else{
                $("#tituloSpecialEdit, #fechaSpecialEdit, #descripcionSpecialEdit").css("box-shadow","none"); 
                var data = {};
                data.titulo = titulo;
                data.fecha = fecha;
                data.descripcion = descripcion;
                data.id=window.localStorage.getItem('idUsuario');
                data.idEdit=app.specialDatesService.viewModel.idEditar;
                
                $.ajax({
                    method:'GET',
                    url: app.servidor+'almacenar_fecha_editar',
                    dataType: 'json',
                    data: data
                })
                .done(function( response ) {
                    console.log(response.event);
                    if(response.status == '1'){
                        app.application.navigate('view-special-dates');  
                       app.mostrarMensaje('success', 'Edit event successfully');                   
                    } else {
                       app.mostrarMensaje('error', response.message);
                    }
                })
                
            }
        },
    });
    
    
    app.specialDatesService = {
        viewModel: new specialDatesViewModel()
    };
})(window);