//SettingsClass

function SettingsClass (container) {
	var rnd_id = Math.floor((Math.random() * 10) + 1);
	var mathvars;

	Init();
	
        function Init() {
			getMathVars();
			$(container).append($('<div></div>').attr('class', 'Settings_title'+rnd_id).attr('id', 'Settings_title_'+rnd_id)
					.text('Настройки:'));
			$(container).append($('<table></table>').attr('class', 'settings_ui').attr('id', 'Settings_'+rnd_id));
			
			for (var i = 0; i<mathvars.primeprice.length; i++) {
				$('#'+'Settings_'+rnd_id).append($('<tr></tr>').attr('id', 'Settings_primeprice_tr_'+mathvars.primeprice[i].CC+'_'+rnd_id)
									       .attr('class', 'settings_ui'));
				$('#'+'Settings_primeprice_tr_'+mathvars.primeprice[i].CC+'_'+rnd_id).append($('<td></td>').attr('class','settings_ui')
					.attr('id', 'Settings_primeprice_td_title_'+mathvars.primeprice[i].CC+'_'+rnd_id)
					.text('Себестоимость 1U ('+mathvars.primeprice[i].CC+')'));
				$('#'+'Settings_primeprice_tr_'+mathvars.primeprice[i].CC+'_'+rnd_id).append($('<td></td>').attr('class','settings_ui')
					.attr('id', 'Settings_primeprice_td_value_'+mathvars.primeprice[i].CC+'_'+rnd_id));
				$('#'+'Settings_primeprice_td_value_'+mathvars.primeprice[i].CC+'_'+rnd_id)
					.append($('<input type=text value="'+mathvars.primeprice[i]['price']
					+'" id="'+i+'_'+'price'+'" class="settings_ui" />'));
					$('#'+i+'_'+'price').off('change');
					$('#'+i+'_'+'price').on('change', function() {
						changeValue('primeprice', this.id.split('_')[0], this.id.split('_')[1], this.value);
					});
			}

			for (var i = 0; i<mathvars.payback.length; i++) {
				$('#'+'Settings_'+rnd_id).append($('<tr></tr>').attr('id', 'Settings_payback_tr_'+(i+1)+'_'+rnd_id)
									       .attr('class', 'settings_ui'));
				$('#'+'Settings_payback_tr_'+(i+1)+'_'+rnd_id).append($('<td></td>').attr('class','settings_ui')
					.attr('id', 'Settings_payback_td_title_'+(i+1)+'_'+rnd_id).text('Окупаемость '+(i+1)+'(месяцы)'));
				$('#'+'Settings_payback_tr_'+(i+1)+'_'+rnd_id).append($('<td></td>').attr('class','settings_ui')
					.attr('id', 'Settings_payback_td_value_'+(i+1)+'_'+rnd_id));
				$('#'+'Settings_payback_td_value_'+(i+1)+'_'+rnd_id)
					.append($('<input type=text value="'+mathvars.payback[i]['months']
					+'" id="'+i+'_'+'months'+'" class="settings_ui" />'));
				$('#'+i+'_'+'months').off('change');
                                $('#'+i+'_'+'months').on('change', function() {
					changeValue('payback', this.id.split('_')[0], this.id.split('_')[1], this.value);
                                });
			}

			$(container).append($('<input type=button value="Сохранить" id="'+rnd_id+'_Settings_save'+'" class="'+rnd_id+'" />'));
			$('#'+rnd_id+'_Settings_save').off('click');
			$('#'+rnd_id+'_Settings_save').on('click', function() {
				SaveSettings();
			});
        }

        function getMathVars() {
                $.ajax({
                        type: 'GET',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: 'pl/calculator.pl',
                        data: 'function=getMathVars',
                        async: false,
                        success: function(data) {
                                      mathvars = data;
                        },
                        error: function() { alert("Ошибка передачи данных=( - getMathVars in SettingsClass"); }
                });
        }

	function changeValue (table, element, field, value) {
		mathvars[table][element][field] = value;
	}

	function SaveSettings () {
		$.ajax({
                       	type: 'GET',
                       	contentType: "application/json; charset=utf-8",
                       	dataType: "json",
              		url: 'pl/settings.pl',
                       	data: "s=" + JSON.stringify(mathvars),
                       	async: false,
                       	success: function(data) {
                       	},
                       	error: function() { alert("Ошибка передачи данных=( - SaveSettings"); }
               	});
	}

}












