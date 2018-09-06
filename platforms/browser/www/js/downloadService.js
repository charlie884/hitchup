(function (global) {
    var downloadViewModel,
        app = global.app = global.app || {}; 
 
    downloadViewModel = kendo.data.ObservableObject.extend({ 
        mostrar: function(){
            $("#reportYearD").data("kendoMobileSwitch").check(false);
            $('.contMonth').show();
            $("#personalCalendarD").data("kendoMobileSwitch").check(true);
            $("#partnerCalendarD").data("kendoMobileSwitch").check(false);
            $("#specialDatesD").data("kendoMobileSwitch").check(false);
                              
            var today = new Date(),
                yyyy = today.getFullYear()-2,
                inpYear = $('#yearD'),
                html = '';

            for (var i = 0; i < 10; i++, yyyy++) {
                if(i == 2){
                    html = html + '<option selected="selected">' + yyyy + '</option>';
                }else{
                    html = html + '<option>' + yyyy + '</option>';
                }          
            };    

            inpYear.html(html);
        },
        reportYear:false,
        onChangeYear:function(e){
            //console.log(e.checked);
            app.downloadService.viewModel.reportYear=e.checked;
            if(e.checked == true){
                $('.contMonth').hide();
            } else {
                $('.contMonth').show();
            }
        },
        personalCalendar:true,
        onChangePersonalCal:function(e){
            //console.log(e.checked);
            app.downloadService.viewModel.personalCalendar=e.checked;
        },
        partnerCalendar:false,
        onChangePartnerCal:function(e){
            //console.log(e.checked);
            app.downloadService.viewModel.partnerCalendar=e.checked;
        },
        specialDates:false,
        onChangeSpecialDates:function(e){
            //console.log(e.checked);
            app.downloadService.viewModel.specialDates=e.checked;
        },
        generarReporte:function(e){
            e.preventDefault();
            var btn = $('#buttonReport').css('display','none');
            $(".loading").show();
            var reportYear= app.downloadService.viewModel.reportYear;
            console.log('anual: '+reportYear);
            var month = $('#monthD').val();
            var year = $('#yearD').val();
            var personalCalendar = app.downloadService.viewModel.personalCalendar;
            console.log('personal: '+personalCalendar);
            var partnerCalendar = app.downloadService.viewModel.partnerCalendar;
            console.log('partner: '+partnerCalendar);
            var specialDates = app.downloadService.viewModel.specialDates;
            console.log('special: '+specialDates);
            $.ajax({
                data:  {
                    usuario:window.localStorage.getItem('idUsuario'),
                    month: month,
                    year: year,
                    personalCalendar:personalCalendar,
                    partnerCalendar:partnerCalendar,
                    specialDates:specialDates,
                    reportYear:reportYear
                },    
                type:  'POST',
    		    url: app.servidor+'generar_certificado',
            })
            .done(function(ruta){
                console.log(ruta);
                window.plugins.socialsharing.share(app.urlServidor+ruta, app.urlServidor+ruta, app.urlServidor+ruta);
                setTimeout(function(){ 
                    $('#buttonReport').css({'display':'block','margin':'0 auto'});
                    $(".loading").hide();
                }, 3000);
                
            })
        }
    });
    
    
    app.downloadService = {
        viewModel: new downloadViewModel()
    };
})(window);