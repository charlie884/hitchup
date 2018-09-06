(function (global) {
    var partnerCalendarViewModel,
        app = global.app = global.app || {}; 
 
    partnerCalendarViewModel = kendo.data.ObservableObject.extend({ 
        mostrar: function(){
            $('.btn_add').slideDown();
            $('.slide-partner').hide();
            $('.slide-partner').slideUp();
            $('.nombre_personal').text('');
            $('.nombre_personal').text(window.localStorage.getItem('name').substring(0, 10)+'.');
            var data = {};
            data.usuario = window.localStorage.getItem('idUsuario'),
            data.tipo= 2;
            $.ajax({
                method:'GET',
                url: app.servidor+'obtener_eventos_calendario_partner',
                dataType: 'json',
                data: data
            })
            .done(function( eventos ) {
                //console.log(eventos);
                 var dates = [];
                for(var i = 0; i < eventos.length; i++){;
                    var eachElement = {};
                    
                     var s = eventos[i].fecha_inicio.split('-');
                     var e = eventos[i].fecha_fin.split('-');
                     var start = new Date(s[0], s[1]-1, s[2]);
                     var end = new Date(e[0], e[1]-1, e[2]);
                    eachElement.startDate = start;
                    eachElement.endDate = end;
                    
                    eachElement.color = eventos[i].color;
                    dates.push(eachElement);
                }
                console.log(dates);
                $('#partner-calendar').calendar({ 
                    style:'background',
                    dataSource: dates,
                    clickDay: function(e) {
                        console.log(e);
                        var dateObj = new Date(e.date)                    
                        var fecha = moment(dateObj).format('YYYY MM DD').split(" ");
                        //console.log(fecha);
                        app.application.navigate('view-partner-detail?day='+fecha[2]+'&month='+fecha[1]+'&year='+fecha[0]);
                        
                    },
                });
             });
        },
        iniciarDetalle: function(e){   
            e.view.scroller.scrollTo(0, 0);  
            var day = e.view.params.day;
            var month = e.view.params.month;
            var year = e.view.params.year;
            
            var actual = year+'-'+month+'-'+day;
            var data = {};
            data.usuario = window.localStorage.getItem('idUsuario'),
            data.tipo= 1;
            $.ajax({
                method:'GET',
                url: app.servidor+'obtener_eventos_calendario_partner_mes',
                dataType: 'json',
                data: data
            })
            .done(function( eventos ) {
                console.log(eventos);
                 jQuery('#calendarDetailPartner').fullCalendar({
                    timezone:'America/Bogota',
                    lang: 'es',
                    view:'month',
                    selectable:true,
                    height:'auto',
                    header: {
                        left: 'prev',
                        center: 'title',
                        right: 'next'
                    }, 
                    defaultDate: actual ,
			        //events: eventos,
                    dayClick: function(date, jsEvent, view) {
                        if(!$(this).hasClass('fc-nonbusiness')){ 
                            var date= date.format();
                            var fecha = date.split("-");
                            var text = $('.fc-toolbar h2').text();
                            app.application.navigate('view-partner-form?text='+text+'&day='+fecha[2]+'&month='+fecha[1]+'&year='+fecha[0]);
                        } else if($(this).hasClass('fc-personal') || $(this).hasClass('fc-partner')) {
                            var date= date.format();
                            var fecha = date.split("-");
                            var id = $(this)[0].id;
                            var text = $('.fc-toolbar h2').text();
                            app.application.navigate('view-partner-form-edit?text='+text+'&id='+id+'&day='+fecha[2]+'&month='+fecha[1]+'&year='+fecha[0]);
                        }
                    },
                    dayRender:function(date, cell){
                        $.each(eventos,function(ido,vdo){
                            if(date.format() >= vdo.fecha_inicio  && date.format() <= vdo.fecha_fin){
                                //console.log('Día: '+date.format()+' - Fecha: '+vdo.fecha);
                                if(vdo.tipo == '1'){
                                    $(cell).addClass('fc-personal');
                                }
                                if(vdo.tipo == '2'){
                                    $(cell).addClass('fc-partner');
                                }
                                $(cell).addClass('fc-nonbusiness');
                                $(cell).attr('id',vdo.id);
                            }
                        });
                    },               
                });
            });
        },
        ocultarCalendario:function(){
            jQuery('#calendarDetailPartner').fullCalendar( 'destroy' );
        },        
        monthPartner: null,
        yearPartner: null,
        dayPartner: null,
        iniciarForm: function(e){
            $('#buttonFormPartner').css('display','none');
            e.view.scroller.scrollTo(0, 0);  
            var day = e.view.params.day;
            var month = e.view.params.month;
            var year = e.view.params.year;
            var text = e.view.params.text;
            app.partnerCalendarService.viewModel.dayPartner = day;
            app.partnerCalendarService.viewModel.monthPartner = month;
            app.partnerCalendarService.viewModel.yearPartner = year;
            $('#view-partner-form .fecha_actual_partner').text(text);
            $('#fechaInicialPartner').val(year+'-'+month+'-'+day);
            $('#fechaFinPartner').val(year+'-'+month+'-'+day);
            $('#descripcionPartner').val('');
            setTimeout(function(){ 
                $('#buttonFormPartner').css({'display':'block','margin':'auto'});
            }, 1000);
        },
          
        eliminarPartner:function(){            
            var idDelete =app.partnerCalendarService.viewModel.idEditar;
            var month = app.partnerCalendarService.viewModel.monthPartner;
            var year = app.partnerCalendarService.viewModel.yearPartner;
            var day = app.partnerCalendarService.viewModel.dayPartner;
            
            var n = new Noty
              ({
                 text: 'Do you want to delete this event?',
                 layout: 'centerTop',
                 buttons: 
                 [
                     Noty.button('Delete', 'Cancel', function () 
                     {
                         $.ajax({
                            method:'GET',
                            url: app.servidor+'eliminar_calendario_partner',
                            dataType: 'json',
                            data: {id:idDelete}
                        })
                        .done(function( response ) {
                            if(response.status == '1'){
                                app.application.navigate('view-partner-detail?day='+day+'&month='+month+'&year='+year);  
                                app.mostrarMensaje('success', 'Event deleted successfully');                
                            } else {
                               app.mostrarMensaje('error', response.message);
                            }
                        })   
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
        validarPartner: function(e){
            e.preventDefault();
            $('.campoPartner').blur();
            var estado = $('#estadoPartner').val();
            var fecha_inicial = $('#fechaInicialPartner').val();
    	    var fecha_fin = $('#fechaFinPartner').val();
            var descripcion = $('#descripcionPartner').val();
            
    		 var fecha1 = moment(fecha_inicial);
    		 var fecha2 = moment(fecha_fin);
    		 var diferencia = fecha2.diff(fecha1, 'days');
                 
            if (fecha_inicial == ''){
                $("#fechaInicialPartner").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Select start date');
            }
            else if (fecha_fin == '')
            { 
                $("#fechaInicialPartner").css("box-shadow","none"); 
                $("#fechaFinPartner").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Select end date');
            }else if(diferencia<0){
               app.mostrarMensaje('error', 'End date must be higher that start date');
            }
            else{
                $("#estadoPartner, #fechaInicialPartner, #fechaFinPartner, #descripcionPartner").css("box-shadow","none"); 
                var data = {};
                data.estado = estado;
                data.fecha_inicio = fecha_inicial;
                data.fecha_fin = fecha_fin;
                data.descripcion = descripcion;
                data.tipo = $('#tipoPartner').val();
                data.id=window.localStorage.getItem('idUsuario');
                
                $.ajax({
                    method:'GET',
                    url: app.servidor+'almacenar_calendario_partner',
                    dataType: 'json',
                    data: data
                })
                .done(function( response ) {
                    if(response.status == '1'){
                        var month = app.partnerCalendarService.viewModel.monthPartner;
                        var year = app.partnerCalendarService.viewModel.yearPartner;
                        var day = app.partnerCalendarService.viewModel.dayPartner;
                        app.application.navigate('view-partner-detail?day='+day+'&month='+month+'&year='+year);  
                       app.mostrarMensaje('success', 'Added event successfully');                   
                    } else {
                       app.mostrarMensaje('error', response.message);
                    }
                })
                
            }
        },
        idEditar: null,
        edicionForm: function(e){
            $('#buttonFormPartnerEdit').css('display','none');
            $('.btn_delete').css({'display':'none'});
            e.view.scroller.scrollTo(0, 0);
            var id = e.view.params.id;
            app.partnerCalendarService.viewModel.idEditar = id;
            var month = e.view.params.month;
            var year = e.view.params.year;
            var day = e.view.params.day;
            var text = e.view.params.text;
            app.partnerCalendarService.viewModel.yearPartner = year;
            app.partnerCalendarService.viewModel.monthPartner = month;
            app.partnerCalendarService.viewModel.dayPartner = day;
            $('#view-partner-form-edit .fecha_actual_editar_partner').text(text);
            $("#estadoPartnerEdit, #fechaInicialPartnerEdit, #fechaFinPartnerEdit, #descripcionPartnerEdit").css("box-shadow","none"); 
            setTimeout(function(){ 
                $('#buttonFormPartnerEdit').css({'display':'block','margin':'auto'});
                $('.btn_delete').css({'display':'block','margin':'0 auto','width':'4em !important','height':'4em','margin':'15px !important'});
            }, 1000);
             
            $.ajax({
                method:'GET',
                url: app.servidor+'obtener_detalle_partner',
                dataType: 'json',
                data: {id:id,usuario:window.localStorage.getItem('idUsuario')}
            })
            .done(function( response ) {
                console.log(response);
                if(response){   
                    $("#estadoPartnerEdit").val(response.estado);
                    $('#tipoPartnerEditar').val(response.tipo);
                    $('#fechaInicialPartnerEdit').val(response.fecha_inicio);
                    $('#fechaFinPartnerEdit').val(response.fecha_fin);              
                    $('#descripcionPartnerEdit').val(response.descripcion);              
                    $('#descripcionPartnerEdit').val(response.descripcion);              
                } else {
                    app.application.navigate('view-partner-detail?day='+day+'&month='+month+'&year='+year);  
                    app.mostrarMensaje('error', 'Error, try again');
                }
            })
        },        
        guardarPartnerForm: function(e){
            e.preventDefault();
            $('.campoPartner').blur();
            var estado = $('#estadoPartnerEdit').val();
            var fecha_inicial = $('#fechaInicialPartnerEdit').val();
    	    var fecha_fin = $('#fechaFinPartnerEdit').val();
            var descripcion = $('#descripcionPartnerEdit').val();
            
    		 var fecha1 = moment(fecha_inicial);
    		 var fecha2 = moment(fecha_fin);
    		 var diferencia = fecha2.diff(fecha1, 'days');
                 
            if (fecha_inicial == ''){
                $("#fechaInicialPartnerEdit").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Select start date');
            }
            else if (fecha_fin == '')
            { 
                $("#fechaInicialPartnerEdit").css("box-shadow","none"); 
                $("#fechaFinPartnerEdit").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Select end date');
            }else if(diferencia<0){
               app.mostrarMensaje('error', 'End date must be higher that start date');
            }
            else{
                $("#estadoPartnerEdit, #fechaInicialPartnerEdit, #fechaFinPartnerEdit, #descripcionPartnerEdit").css("box-shadow","none"); 
                var data = {};
                data.estado = estado;
                data.fecha_inicio = fecha_inicial;
                data.fecha_fin = fecha_fin;
                data.descripcion = descripcion;
                data.tipo = $('#tipoPartnerEditar').val();
                data.idEdit=app.partnerCalendarService.viewModel.idEditar;
                data.id=window.localStorage.getItem('idUsuario');
                
                $.ajax({
                    method:'GET',
                    url: app.servidor+'almacenar_calendario_editar_partner',
                    dataType: 'json',
                    data: data
                })
                .done(function( response ) {
                    if(response.status == '1'){
                        var month = app.partnerCalendarService.viewModel.monthPartner;
                        var year = app.partnerCalendarService.viewModel.yearPartner;
                        var day = app.partnerCalendarService.viewModel.dayPartner;
                        app.application.navigate('view-partner-detail?day='+day+'&month='+month+'&year='+year);  
                        app.mostrarMensaje('success', 'Edit event successfully');                   
                    } else {
                       app.mostrarMensaje('error', response.message);
                    }
                })
                
            }
        },
        
        modificarPartner: function(){
            $('.btn_add').slideUp();
            $('.slide-partner').show();
            $('.slide-partner').slideDown();
        },
        guardarPartner: function(){
            $('.btn_add').slideDown();
            $('.slide-partner').hide();
            $('.slide-partner').slideUp();
            var data = {};
            data.nombre = $('#nombrePartner').val();
            data.id=window.localStorage.getItem('idUsuario');
            $.ajax({
                method:'GET',
                url: app.servidor+'guardar_partner',
                dataType: 'json',
                data: data
            })
            .done(function( response ) {
                if(response.status == '1'){ 
                    app.mostrarMensaje('success', 'Edit partner successfully');      
                    $('#nombrePartner').val(data.nombre);
                    $('.nombre_partner').text(data.nombre);
                } else {
                   app.mostrarMensaje('error', response.message);
                }
            })
        }
    });
    
    
    app.partnerCalendarService = {
        viewModel: new partnerCalendarViewModel()
    };
})(window);