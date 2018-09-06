(function (global) {
    var personalCalendarViewModel,
        app = global.app = global.app || {}; 
 
    personalCalendarViewModel = kendo.data.ObservableObject.extend({ 
        mostrar: function(){
            var data = {};
            data.usuario = window.localStorage.getItem('idUsuario'),
            data.tipo= 1;
            $.ajax({
                method:'GET',
                url: app.servidor+'obtener_eventos_calendario',
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
                    console.log(eachElement);
                    dates.push(eachElement);
                }
                console.log(dates);
                $('#personal-calendar').calendar({ 
                    style:'background',
                    dataSource: dates,
                    defaultView: 'listWeek',
                    clickDay: function(e) {
                        console.log(e);
                        var dateObj = new Date(e.date)                    
                        var fecha = moment(dateObj).format('YYYY MM DD').split(" ");
                        //console.log(fecha);
                        app.application.navigate('view-personal-detail?day='+fecha[2]+'&month='+fecha[1]+'&year='+fecha[0]);
                        
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
                url: app.servidor+'obtener_eventos_calendario_mes',
                dataType: 'json',
                data: data
            })
            .done(function( eventos ) {
                console.log(eventos);
                 jQuery('#calendarDetail').fullCalendar({
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
                            var text = $('#calendarDetail .fc-toolbar h2').text();
                            app.application.navigate('view-personal-form?text='+text+'&day='+fecha[2]+'&month='+fecha[1]+'&year='+fecha[0]);
                        } else {
                            var date= date.format();
                            var fecha = date.split("-");
                            var id = $(this)[0].id;
                            var text = $('#calendarDetail .fc-toolbar h2').text();
                            app.application.navigate('view-personal-form-edit?text='+text+'&id='+id+'&day='+fecha[2]+'&month='+fecha[1]+'&year='+fecha[0]);
                        }
                    },
                    dayRender:function(date, cell){
                        $.each(eventos,function(ido,vdo){
                            if(date.format() >= vdo.fecha_inicio  && date.format() <= vdo.fecha_fin){
                                //console.log('Día: '+date.format()+' - Fecha: '+vdo.fecha);
                                if(vdo.estado == '1'){
                                    $(cell).addClass('fc-work');
                                }
                                if(vdo.estado == '2'){
                                    $(cell).addClass('fc-stand');
                                }
                                if(vdo.estado == '3'){
                                    $(cell).addClass('fc-home');
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
            jQuery('#calendarDetail').fullCalendar( 'destroy' );
        },
        monthPersonal: null,
        yearPersonal: null,
        dayPersonal: null,
        iniciarForm: function(e){
            $('#buttonFormPersonal').css('display','none');
            e.view.scroller.scrollTo(0, 0);  
            var day = e.view.params.day;
            var month = e.view.params.month;
            var year = e.view.params.year;
            var text = e.view.params.text;
            app.personalCalendarService.viewModel.dayPersonal = day;
            app.personalCalendarService.viewModel.monthPersonal = month;
            app.personalCalendarService.viewModel.yearPersonal = year;
            $('#view-personal-form .fecha_actual').text(text);
            $('#fechaInicialPersonal').val(year+'-'+month+'-'+day);
            $('#fechaFinPersonal').val(year+'-'+month+'-'+day);
            $('#descripcionPersonal').val('');
            setTimeout(function(){ 
                $('#buttonFormPersonal').css({'display':'block','margin':'0 auto'});
            }, 1000); 
        },
        validarPersonal: function(e){
            e.preventDefault();
            $('.campoPersonal').blur();
            var estado = $('#estadoPersonal').val();
            var fecha_inicial = $('#fechaInicialPersonal').val();
    	    var fecha_fin = $('#fechaFinPersonal').val();
            var descripcion = $('#descripcionPersonal').val();
            
    		 var fecha1 = moment(fecha_inicial);
    		 var fecha2 = moment(fecha_fin);
            if(fecha1.get('month') == fecha2.get('month')){
        		 var diferencia = fecha2.diff(fecha1, 'days');
                     
                if (fecha_inicial == ''){
                    $("#fechaInicialPersonal").css("box-shadow","0px 0px 5px red"); 
                   app.mostrarMensaje('error', 'Select start date');
                }
                else if (fecha_fin == '')
                { 
                    $("#fechaInicialPersonal").css("box-shadow","none"); 
                    $("#fechaFinPersonal").css("box-shadow","0px 0px 5px red"); 
                   app.mostrarMensaje('error', 'Select end date');
                }else if(diferencia<0){
                   app.mostrarMensaje('error', 'End date must be higher that start date');
                }
                else{
                    $("#estadoPersonal, #fechaInicialPersonal, #fechaFinPersonal, #descripcionPersonal").css("box-shadow","none"); 
                    var data = {};
                    data.estado = estado;
                    data.fecha_inicio = fecha_inicial;
                    data.fecha_fin = fecha_fin;
                    data.descripcion = descripcion;
                    data.tipo = 1;
                    data.id=window.localStorage.getItem('idUsuario');
                    
                    $.ajax({
                        method:'GET',
                        url: app.servidor+'almacenar_calendario',
                        dataType: 'json',
                        data: data
                    })
                    .done(function( response ) {
                        if(response.status == '1'){
                            var month = app.personalCalendarService.viewModel.monthPersonal;
                            var year = app.personalCalendarService.viewModel.yearPersonal;
                            var day = app.personalCalendarService.viewModel.dayPersonal;
                            app.application.navigate('view-personal-detail?day='+day+'&month='+month+'&year='+year);  
                           app.mostrarMensaje('success', 'Added event successfully');                   
                        } else {
                           app.mostrarMensaje('error', response.message);
                        }
                    })
                    
                }
            } else {
               app.mostrarMensaje('error','Dates must correspond to the same month' );
            }
        },
        idEditar: null,
        edicionForm: function(e){
            $('#buttonFormPersonalEdit').css('display','none');
            $('.btn_delete').css({'display':'none'});
            e.view.scroller.scrollTo(0, 0);
            var id = e.view.params.id;
            app.personalCalendarService.viewModel.idEditar = id;
            var month = e.view.params.month;
            var year = e.view.params.year;
            var day = e.view.params.day;
            var text = e.view.params.text;
            app.personalCalendarService.viewModel.yearPersonal = year;
            app.personalCalendarService.viewModel.monthPersonal = month;
            app.personalCalendarService.viewModel.dayPersonal = day;
            $('#view-personal-form-edit .fecha_actual_editar').text(text);
            $("#estadoPersonalEdit, #fechaInicialPersonalEdit, #fechaFinPersonalEdit, #descripcionPersonalEdit").css("box-shadow","none"); 
            setTimeout(function(){ 
                $('#buttonFormPersonalEdit').css({'display':'block','margin':'0 auto'});
                $('.btn_delete').css({'display':'block','margin':'0 auto'});
            }, 1000); 
            $.ajax({
                method:'GET',
                url: app.servidor+'obtener_detalle',
                dataType: 'json',
                data: {id:id,usuario:window.localStorage.getItem('idUsuario')}
            })
            .done(function( response ) {
                console.log(response);
                if(response){   
                    $("#estadoPersonalEdit").val(response.estado);
                    $('#fechaInicialPersonalEdit').val(response.fecha_inicio);
                    $('#fechaFinPersonalEdit').val(response.fecha_fin);              
                    $('#descripcionPersonalEdit').val(response.descripcion);              
                } else {
                    app.application.navigate('view-personal-detail?day='+day+'&month='+month+'&year='+year);  
                    app.mostrarMensaje('error', 'Error, try again');
                }
            })
        },        
        eliminarPersonal:function(){            
            var idDelete =app.personalCalendarService.viewModel.idEditar;
            var month = app.personalCalendarService.viewModel.monthPersonal;
            var year = app.personalCalendarService.viewModel.yearPersonal;
            var day = app.personalCalendarService.viewModel.dayPersonal;
            
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
                            url: app.servidor+'eliminar_calendario',
                            dataType: 'json',
                            data: {id:idDelete}
                        })
                        .done(function( response ) {
                            if(response.status == '1'){
                                app.application.navigate('view-personal-detail?day='+day+'&month='+month+'&year='+year);  
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
        guardarPersonal: function(e){
            e.preventDefault();
            $('.campoPersonal').blur();
            var estado = $('#estadoPersonalEdit').val();
            var fecha_inicial = $('#fechaInicialPersonalEdit').val();
    	    var fecha_fin = $('#fechaFinPersonalEdit').val();
            var descripcion = $('#descripcionPersonalEdit').val();
            
    		 var fecha1 = moment(fecha_inicial);
    		 var fecha2 = moment(fecha_fin);
            if(fecha1.get('month') == fecha2.get('month')){
        		 var diferencia = fecha2.diff(fecha1, 'days');
                     
                if (fecha_inicial == ''){
                    $("#fechaInicialPersonalEdit").css("box-shadow","0px 0px 5px red"); 
                   app.mostrarMensaje('error', 'Select start date');
                }
                else if (fecha_fin == '')
                { 
                    $("#fechaInicialPersonalEdit").css("box-shadow","none"); 
                    $("#fechaFinPersonalEdit").css("box-shadow","0px 0px 5px red"); 
                   app.mostrarMensaje('error', 'Select end date');
                }else if(diferencia<0){
                   app.mostrarMensaje('error', 'End date must be higher that start date');
                }
                else{
                    $("#estadoPersonalEdit, #fechaInicialPersonalEdit, #fechaFinPersonalEdit, #descripcionPersonalEdit").css("box-shadow","none"); 
                    var data = {};
                    data.estado = estado;
                    data.fecha_inicio = fecha_inicial;
                    data.fecha_fin = fecha_fin;
                    data.descripcion = descripcion;
                    data.tipo = 1;
                    data.idEdit=app.personalCalendarService.viewModel.idEditar;
                    data.id=window.localStorage.getItem('idUsuario');
                    
                    $.ajax({
                        method:'GET',
                        url: app.servidor+'almacenar_calendario_editar',
                        dataType: 'json',
                        data: data
                    })
                    .done(function( response ) {
                        if(response.status == '1'){
                            var month = app.personalCalendarService.viewModel.monthPersonal;
                            var year = app.personalCalendarService.viewModel.yearPersonal;
                            var day = app.personalCalendarService.viewModel.dayPersonal;
                            app.application.navigate('view-personal-detail?day='+day+'&month='+month+'&year='+year);  
                            app.mostrarMensaje('success', 'Edit event successfully');                   
                        } else {
                           app.mostrarMensaje('error', response.message);
                        }
                    })
                    
                }
                
            } else {
               app.mostrarMensaje('error','Dates must correspond to the same month' );
            }
        },
    });
    
    
    app.personalCalendarService = {
        viewModel: new personalCalendarViewModel()
    };
})(window);