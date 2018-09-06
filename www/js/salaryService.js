(function (global) {
    var salaryViewModel,
        app = global.app = global.app || {}; 
 
    salaryViewModel = kendo.data.ObservableObject.extend({ 
        mostrarForm: function(e){
            e.view.scroller.scrollTo(0, 0);
            $('input').val('');
            $('#currencyBasic').html('');
            $.ajax({
				url: app.servidor+'obtener_listado_currency',
				type: 'GET',
				dataType: 'json'
			})
			.done(function(paises) {
                console.log(paises);
                 $('#currencyBasic').append('<option value="0">Select currency</option>');
                 $.each(paises,function(ixp,vlp){
                     if(vlp.nombre_moneda != ''){
                        $('#currencyBasic').append('<option id="'+vlp.iso_moneda+'" value="'+vlp.id+'">'+vlp.nombre_moneda+'</option>');
                     }
                 });
            });
            
            $('#currencyBasic').change(function(){
                var value = $(this).val();
                if(value != 0){
				    var currency = $('#currencyBasic option:selected').attr('id');
                    $('#view-salary-calculator .moneda').text(currency);
                } else {
                    $('#view-salary-calculator .moneda').text('');
                }
            });
        },
        calcularSalary: function(e){
            e.preventDefault();
            $('.campoSalary').blur();
            
            var data = {};
            data.fecha = $('#dateBasic').val();
            data.currency = $('#currencyBasic').val();
            data.basic = $('#basicBasic').val();
            data.daily_rate = $('#dailyBasic').val();
            data.stand_by_rate = $('#standBasic').val();
            data.extras = $('#extraBasic').val();
            data.basic_taxes_1 = $('#taxe1Basic').val();
            data.basic_insurance_1 = $('#insurance1Basic').val();
            data.basic_taxes_2 = $('#taxe2Basic').val();
            data.basic_insurance_2 = $('#insurance2Basic').val();
            
            data.incomes_extra_1 = $('#extraTotal1').val();
            data.incomes_extra_2 = $('#extraTotal2').val();
            data.incomes_taxes_1 = $('#taxe1Total').val();
            data.incomes_taxes_2 = $('#taxe2Total').val();
            data.incomes_insurance_1 = $('#insurance1Total').val();
            data.incomes_insurance_2 = $('#insurance2Total').val();
            
             if (data.fecha == ''){
                $("#dateBasic").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Select date');
            }
            else if (data.currency == '0')
            { 
                $("#dateBasic").css("box-shadow","none"); 
                $("#currency").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Select currency');
            }
            else if (data.basic == '')
            { 
                $("#dateBasic").css("box-shadow","none"); 
                $("#currency").css("box-shadow","none"); 
                $("#basicBasic").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Enter basic');
            }
            else if (data.basic_taxes_1 > 100)
            { 
                $("#dateBasic").css("box-shadow","none"); 
                $("#currency").css("box-shadow","none"); 
                $("#basicBasic").css("box-shadow","none"); 
                $("#taxe1Basic").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Taxe value max equal 100');
            }
            else if (data.basic_taxes_2 > 100)
            { 
                $("#dateBasic").css("box-shadow","none"); 
                $("#currency").css("box-shadow","none"); 
                $("#basicBasic").css("box-shadow","none"); 
                $("#taxe1Basic").css("box-shadow","none"); 
                $("#taxe2Basic").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Taxe value max equal 100');
            }
            else{
                $(".campoSalary").css("box-shadow","none");
                var currency = $('#currencyBasic option:selected').attr('id');
                data.id=window.localStorage.getItem('idUsuario');
                
                $.ajax({
                    method:'GET',
                    url: app.servidor+'calcularTotalSalary',
                    dataType: 'json',
                    data: data
                })
                .done(function( response ) {
                    console.log(response);
                    if(response.status == '1'){
                        var n = new Noty({
                          text: 'Your salary from '+data.fecha+' is: '+currency+' '+response.total,
                          layout: 'centerTop',
                          buttons: [
                                Noty.button('OK', 'btn btn-success', function () {
                                    app.application.navigate('view-salary-report');
                                     n.close();
                                }, {id: 'button1', 'data-status': 'ok'}),

                              ]
                            }).show();
                                           
                    } else {
                       app.mostrarMensaje('error', response.message);
                        console.log('entre error');
                    }
                })
            }
        },
        hideSalaries:function(){
            
        },
        loadSalaries: function(e){  
            e.view.scroller.scrollTo(0, 0); 
            $('#cont_salaries').html('<ul id="salaries"></ul>');
            $.ajax({
                method:'GET',
                url: app.servidor+'obtener_salarios',
                dataType: 'json',
                data: {id:window.localStorage.getItem('idUsuario')}
            })
            .done(function( info ) {
                console.log(info);
                $('#salaries').kendoMobileListView({
                    dataSource: info,
                    template: $('#template-salaries').html(),
                    dataBound: function() { 
                        $('#salaries .moneda2 .mon').priceFormat({
                            prefix: (' ')+' ',
                            centsLimit: 0,
                            allowNegative: true,
                            thousandsSeparator: '.'
                        });
                    }
                }).kendoTouch({
                        filter: ">li",
                        enableSwipe: true,
                        touchstart: app.salaryService.viewModel.touchstart,
                        //tap: navigate,
                        swipe: app.salaryService.viewModel.swipe
                 });
            });
            
        },
        infoEdit: null,
        touchstart: function(e) {  
            console.log('itera');
            app.salaryService.viewModel.infoEdit = null;
           //$('#noty_layout__centerTop').html('');
            var target = $(e.touch.initialTouch),
                listview = $("#salaries").data("kendoMobileListView"),
                model,
                button = $(e.touch.target).find("[data-role=button]:visible");
            
            model = listview.dataSource.getByUid($(e.touch.target).attr("data-uid"));
            //$("#salary-"+model.id).animate({"padding-right": "5em"}, "slow");
            if (target.closest(".delete")[0] || target.closest(".edit")[0]) {
   
                if(target.closest("#salary-"+model.id+" .delete")[0]){ 
              
                    this.events.cancel();
                    e.event.stopPropagation(); 
                   var n = new Noty
                      ({
                         text: 'How you want to continue?',
                         layout: 'centerTop',
                         timeout: 3000,
                         buttons: 
                         [
                             Noty.button('Delete', 'Cancel', function () 
                             {
                                // DELETE
                                 $.ajax({
                                        method:'POST',
                                        url: app.servidor+'eliminar_salario',
                                        dataType: 'json',
                                        data:{
                                            usuario:window.localStorage.getItem('idUsuario'),
                                            id:model.id
                                        }
                                 })
                                 .done(function( respuesta ) {
                                        console.log(respuesta);
                                        if(respuesta){
                                            app.mostrarMensaje('error', 'Delete');
                                            listview.dataSource.remove(model);  
                                        }
                                }); 
                                 n.close();
                             }, 
                             {
                                 id: 'button1', 'data-status': 'ok'}),

                             Noty.button('Cancel', 'error', function () 
                             {
                                // CANCEL
                                n.close();
                             
                            })
                       ]
                   }).show();
                } else if(target.closest(".edit")[0]){
                    app.salaryService.viewModel.infoEdit = model;    
                    this.events.cancel();
                    e.event.stopPropagation();
                    app.application.navigate('view-salary-calculator-edit');
                }
            } else if (button[0]) {
                button.hide();
                this.events.cancel();
            } else {
                listview.items().find("[data-role=button]:visible").hide();
            }
        },

        swipe:function(e){
            var button = kendo.fx($(e.touch.currentTarget).find("[data-role=button]"));
            button.expand().duration(30).play();
        },
        
        iniciarForm: function(e){
            e.view.scroller.scrollTo(0, 0);
            
            var model = app.salaryService.viewModel.infoEdit;
            console.log(model);
            $('#view-salary-calculator-edit .moneda').text(model['iso_moneda']);            
            $('input').val('');            
            $('#currencyBasicEdit').html('');
            $.ajax({
				url: app.servidor+'obtener_listado_currency',
				type: 'GET',
				dataType: 'json'
			})
			.done(function(paises) {
                console.log(paises);
                 $('#currencyBasic').append('<option value="0">Select currency</option>');
                 $.each(paises,function(ixp,vlp){
                     if(vlp.nombre_moneda != '' && vlp.id == model['currency']){
                        $('#currencyBasicEdit').append('<option selected="selected" id="'+vlp.iso_moneda+'" value="'+vlp.id+'">'+vlp.nombre_moneda+'</option>');
                     } else if(vlp.nombre_moneda != '') {
                        $('#currencyBasicEdit').append('<option id="'+vlp.iso_moneda+'" value="'+vlp.id+'">'+vlp.nombre_moneda+'</option>');
                     }
                 });
            });
            
            $('#currencyBasicEdit').change(function(){
                var value = $(this).val();
                if(value != 0){
				    var currency = $('#currencyBasicEdit option:selected').attr('id');
                    $('#view-salary-calculator-edit .moneda').text(currency);
                } else {
                    $('#view-salary-calculator-edit .moneda').text('');
                }
            });
            
            
            $('#dateBasicEdit').val(model['fecha']);
            $('#basicBasicEdit').val(model['basic']);
            $('#dailyBasicEdit').val(model['daily_rate']);
            $('#standBasicEdit').val(model['stand_by_rate']);
            $('#extraBasicEdit').val(model['extras']);
            $('#taxe1BasicEdit').val(model['basic_taxes_1']);
            $('#insurance1BasicEdit').val(model['basic_insurance_1']);
            $('#taxe2BasicEdit').val(model['basic_taxes_2']);
            $('#insurance2BasicEdit').val(model['basic_insurance_2']);
            
            $('#extraTotal_e').val(model['incomes_extra_1']);
            $('#extraTotal2_e').val(model['incomes_extra_2']);
            $('#taxe1Total_e').val(model['incomes_taxes_1']);
            $('#insurance1Total_e').val(model['incomes_insurance_1']);
            $('#taxe2Total_e').val(model['incomes_taxes_2']);
            $('#insurance2Total_e').val(model['incomes_insurance_2']);
                    
        },
        calcularSalaryEdit: function(e){
            var model = app.salaryService.viewModel.infoEdit;
            e.preventDefault();
            $('.campoSalary').blur();
            
            var data = {};
            data.fecha = $('#dateBasicEdit').val();
            data.currency = $('#currencyBasicEdit').val();
            data.basic = $('#basicBasicEdit').val();
            data.daily_rate = $('#dailyBasicEdit').val();
            data.stand_by_rate = $('#standBasicEdit').val();
            data.extras = $('#extraBasicEdit').val();
            data.basic_taxes_1 = $('#taxe1BasicEdit').val();
            data.basic_insurance_1 = $('#insurance1BasicEdit').val();
            data.basic_taxes_2 = $('#taxe2BasicEdit').val();
            data.basic_insurance_2 = $('#insurance2BasicEdit').val();
            
            data.incomes_extra_1 = $('#extraTotal_e').val();
            data.incomes_extra_2 = $('#extraTotal2_e').val();
            data.incomes_taxes_1 = $('#taxe1Total_e').val();
            data.incomes_insurance_1 = $('#insurance1Total_e').val();
            data.incomes_taxes_2 = $('#taxe2Total_e').val();
            data.incomes_insurance_2 = $('#insurance2Total_e').val();
            
             if (data.fecha == ''){
                $("#dateBasicEdit").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Select date');
            }
            else if (data.currency == '0')
            { 
                $("#dateBasicEdit").css("box-shadow","none"); 
                $("#currencyBasicEdit").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Select currency');
            }
            else if (data.basic == '')
            { 
                $("#dateBasicEdit").css("box-shadow","none"); 
                $("#currencyBasicEdit").css("box-shadow","none"); 
                $("#basicBasicEdit").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Enter basic');
            }
            else if (data.basic_taxes_1 > 100)
            { 
                $("#dateBasicEdit").css("box-shadow","none"); 
                $("#currencyBasicEdit").css("box-shadow","none"); 
                $("#basicBasicEdit ").css("box-shadow","none"); 
                $("#taxe1BasicEdit").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Taxe value max equal 100');
            }
            else if (data.basic_taxes_2 > 100)
            { 
                $("#dateBasicEdit").css("box-shadow","none"); 
                $("#currencyBasicEdit").css("box-shadow","none"); 
                $("#basicBasicEdit").css("box-shadow","none"); 
                $("#taxe1BasicEdit").css("box-shadow","none"); 
                $("#taxe2BasicEdit").css("box-shadow","0px 0px 5px red"); 
               app.mostrarMensaje('error', 'Taxe value max equal 100');
            }
            else{
                $(".campoSalary").css("box-shadow","none");
                var currency = $('#currencyBasicEdit option:selected').attr('id');
                data.id=window.localStorage.getItem('idUsuario');
                data.idEdit = model['id'];
                
                $.ajax({
                    method:'GET',
                    url: app.servidor+'update_salary_r',
                    dataType: 'json',
                    data: data
                })
                .done(function( response ) {
                    if(response.status == '1'){
                        var n = new Noty({
                          text: 'Your salary from '+data.fecha+' is: '+currency+' '+response.total,
                          layout: 'centerTop',
                          buttons: [
                                Noty.button('OK', 'btn btn-success', function () {
                                    app.application.navigate('view-salary-report');
                                     n.close();
                                }, {id: 'button1', 'data-status': 'ok'}),

                              ]
                            }).show();
                                           
                    } else {
                       app.mostrarMensaje('error', response.message);
                    }
                })
            }
        },
        expandHandler:function(){
          console.log('expand');  
        },
        totalSalary: function(id){
            
            var content = '#salary-'+id;
            var data = {};
            data.incomes_extra_1 = $(content+' #extraTotal1').val();
            data.incomes_extra_2 = $(content+' #extraTotal2').val();
            data.incomes_taxes_1 = $(content+' #taxe1Total').val();
            data.incomes_taxes_2 = $(content+' #taxe2Total').val();
            data.incomes_insurance_1 = $(content+' #insurance1Total').val();
            data.incomes_insurance_2 = $(content+' #insurance2Total').val();
            data.id=window.localStorage.getItem('idUsuario');
            data.idEdit = id;
            console.log(data);
            
            $.ajax({
                    method:'GET',
                    url: app.servidor+'update_salary_total',
                    dataType: 'json',
                    data: data
                })
                .done(function( response ) {
                    if(response.status == '1'){
                        app.mostrarMensaje('success', 'Salary updated');
                        $(content+' .total_incomes').text(response.total);
                    } else {
                       app.mostrarMensaje('error', response.message);
                    }
                })
        }
    });
    
    
    app.salaryService = {
        viewModel: new salaryViewModel()
    };
})(window);