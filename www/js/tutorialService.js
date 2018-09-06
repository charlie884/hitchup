(function (global) {
    var tutorialViewModel,
        app = global.app = global.app || {}; 
 
    tutorialViewModel = kendo.data.ObservableObject.extend({ 
        mostrar: function(){
            $('#tutoriales').html('');
            $.ajax({
                method:'GET',
                url: app.servidor+'obtener_tutoriales',
                dataType: 'json'
            })
            .done(function( info ) {
                console.log(info);
                $('#tutoriales').kendoMobileListView({
                    dataSource: info,
                    template: $('#template-tutoriales').html(),
                });
            })
        },
        mostrarDetalle:function(e){
            var imagen = e.view.params.imagen;
            $('#imgTutorial').attr('src',imagen);
        },
        ocultarDetalle: function(){
            $('#imgTutorial').removeAttr('src');
        }
    });
    
    
    app.tutorialService = {
        viewModel: new tutorialViewModel()
    };
})(window);