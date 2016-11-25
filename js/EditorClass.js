//EditorClass

function EditorClass (container, c_obj, order_string) {
	var SELF = this;
	var rnd_id = Math.floor((Math.random() * 10) + 1);

	var init = new InitClass (c_obj);

	var editset = {};
	var create_delete_set = {};
	var hardware_set;
	var obj_order = order_string.split('|');

	Init();
	
        function Init() {
			editset = init.getObjects();
			showObjects();			
        }

	function chElementPrice (id, value) {
		//format id = table_code_field
		editset[id.split('_')[3]][id.split('_')[4]][id.split('_')[5]] = value;
		//alert ( JSON.stringify(editset[id.split('_')[0]][id.split('_')[1]]) );
	}

	function chNewElement (id, value) {
		//format id = table_code_field
		if (create_delete_set[id.split('$')[1]] == undefined) {
			create_delete_set[id.split('$')[1]] = {};
		}
		if (create_delete_set[id.split('$')[1]][id.split('$')[2]] == undefined) {
			create_delete_set[id.split('$')[1]][id.split('$')[2]] = {};
		}
		create_delete_set[id.split('$')[1]][id.split('$')[2]][id.split('$')[3]] = value;
	}

	function deleteElement (id) {
		if (confirm('Вы действительно хотите удалить?')) {
			if (create_delete_set[id.split('$')[1]] == undefined) {
                        	create_delete_set[id.split('$')[1]] = {};
			}
			create_delete_set[id.split('$')[1]][id.split('$')[2]] = {};
			SaveEditor('del', create_delete_set);
		}
	}

	function add_prepare (id) {
		var id = id.split('$')[1];
		var hwset = {};
		hwset[id] = hardware_set[id];

		$('div[id*=tab_add_]').remove();
		$('li[id*=tab_add_]').remove();
		tab_container.addTab('tab_add_'+id, '<- добавить '+c_obj.getCalcObjects()[ c_obj.getCalcObjectIndexById(id) ]
				.title+'...', true, true);

		$.ajax({
                       	type: 'GET',
                       	contentType: "application/json; charset=utf-8",
                       	dataType: "json",
              		url: 'pl/editor.pl',
                       	data: 'add_prepare='+JSON.stringify(hwset),
                       	async: false,
                       	success: function(data) {
				showElementEditor (data, 0);
                       	},
                       	error: function() { alert("Ошибка передачи данных=( - add_prepare()"); }
               	});
	}

	function change_prepare (id) {
		var hwset = {};
		hwset[id.split('$')[1]] = hardware_set[id.split('$')[1]];

		$('div[id*=tab_add_]').remove();
		$('li[id*=tab_add_]').remove();
		tab_container.addTab('tab_add_'+id.split('$')[1], '<- изменить '+c_obj.getCalcObjects()[ c_obj.getCalcObjectIndexById(id.split('$')[1]) ]
				.title+'...', true, true);

		$.ajax({
                       	type: 'GET',
                       	contentType: "application/json; charset=utf-8",
                       	dataType: "json",
              		url: 'pl/editor.pl',
                       	data: 'add_prepare='+JSON.stringify(hwset),
                       	async: false,
                       	success: function(data) {
				showElementEditor (data, id);
                       	},
                       	error: function() { alert("Ошибка передачи данных=( - change_prepare()"); }
               	});
	}

	function showElementEditor (data, m_id) {
		var id = Object.keys(data);
		var c = Math.floor(Math.random() * (999999999 - 111111 + 1)) + 111111;
		
		$(tab_container.getTab ('tab_add_'+id)).append($('<div></div>').attr('class', 'Editor').attr('id', 'Editor_'+rnd_id+'_add_'+id));
		
		//Отобразить название объекта
                        $('#'+'Editor_'+rnd_id+'_add_'+id).append($('<div></div>').attr('class', 'Editor_title_'+id+'_'+rnd_id)
                                .attr('id', 'Editor_title_add_'+id+'_'+rnd_id).text('Добавить/Изменить '+
					c_obj.getCalcObjects()[ c_obj.getCalcObjectIndexById(id) ].title+':'));

		$('#'+'Editor_'+rnd_id+'_add_'+id).append($('<table></table>').attr('class', 'editor_ui').attr('id', 'Editor_table_add'+id+'_'+rnd_id));

		$.each(hardware_set[id], function (title, field) {
			$('#'+'Editor_table_add'+id+'_'+rnd_id).append($('<tr></tr>').attr('id', 'Editor_description_tr_add_'+id+'_'+field+'_'+rnd_id)
                                                                               .attr('class', 'editor_ui'));
			$('#'+'Editor_description_tr_add_'+id+'_'+field+'_'+rnd_id).append($('<td></td>').attr('class','editor_ui')
                                        .attr('id', 'Editor_description_td_add_'+id+'_'+field+'_'+rnd_id)
                                        .text(title+':'));
			$('#'+'Editor_description_tr_add_'+id+'_'+field+'_'+rnd_id).append($('<td></td>')
						.attr('id', 'Editor_field_td_'+id+'_'+field+'_'+rnd_id)
						.attr('class','editor_ui'));
			if (data[id][field] == "") {
				//Отобразить input=text поля
				if (m_id == 0) {
					//Добавление
					$('#'+'Editor_field_td_'+id+'_'+field+'_'+rnd_id).append($('<input type=text value="" id="Editor_field_input_\$'
					+id+'\$'+c+'\$'+field+'" class="editor_ui" />'));
				} else {
					//Редактирование
					$('#'+'Editor_field_td_'+id+'_'+field+'_'+rnd_id).append($('<input type=text '+
					' value="' + editset[m_id.split('$')[1]][m_id.split('$')[2]][field] + '" id="Editor_field_input_\$'
					+id+'\$'+m_id.split('$')[2]+'\$'+field+ '" class="editor_ui" />'));
					c = m_id.split('$')[2];
				}
				$('#Editor_field_input_\\$'+id+'\\$'+c+'\\$'+field).off('change');
				$('#Editor_field_input_\\$'+id+'\\$'+c+'\\$'+field).on('change', function () {
							chNewElement(this.id,this.value);
				});
						
			} else {
				//Отобразить select-поля
				if (m_id == 0) {
					//Добавление
					$('#'+'Editor_field_td_'+id+'_'+field+'_'+rnd_id).append($('<select></select>')
							.attr('id', 'Editor_field_input_\$'+id+'\$'+c+'\$'+field)
							.attr("class", "editor_ui"));
					$("#Editor_field_input_\\$"+id+'\\$'+c+'\\$'+field).append($("<option></option>").attr("value","").text(""));
					$.each(data[id][field].split(','), function (indx, value) {
						$("#Editor_field_input_\\$"+id+'\\$'+c+'\\$'+field)
						.append($("<option></option>").attr("value",value).text(value));
					});
				} else {
					//Редактирование
					$('#'+'Editor_field_td_'+id+'_'+field+'_'+rnd_id).append($('<select></select>')
							.attr('id', 'Editor_field_input_\$'+id+'\$'+m_id.split('$')[2]+'\$'+field)
							.attr("class", "editor_ui"));
					$("#Editor_field_input_\\$"+id+'\\$'+m_id.split('$')[2]+'\\$'+field).append($("<option></option>")
							.attr("value","").text(""));
					$.each(data[id][field].split(','), function (indx, value) {
						$("#Editor_field_input_\\$"+id+'\\$'+m_id.split('$')[2]+'\\$'+field)
						.append($("<option></option>").attr("value",value).text(value));
					});
					$('#Editor_field_input_\\$'+id+'\\$'+m_id.split('$')[2]+'\\$'+field)
						.find("option:contains('"+ editset[m_id.split('$')[1]][m_id.split('$')[2]][field] +"')")
						.attr("selected", "selected");
					c = m_id.split('$')[2];
				}

				$('#Editor_field_input_\\$'+id+'\\$'+c+'\\$'+field).off('change');
				$('#Editor_field_input_\\$'+id+'\\$'+c+'\\$'+field).on('change', function () {
					chNewElement(this.id,this.value);
				});
			}
		});

		//Отобразить кнопку сохранения
                $('#'+'Editor_'+rnd_id+'_add_'+id).append($('<input type=button value="Сохранить" id="'+rnd_id+'_Editor_save_add'+'" class="editor_ui" />'));
                        $('#'+rnd_id+'_Editor_save_add').off('click');
                        $('#'+rnd_id+'_Editor_save_add').on('click', function() {
				if (m_id == 0) {
                                	SaveEditor('add', create_delete_set);
				} else {
					SaveEditor('change', create_delete_set);
				}
				$('div[id*=tab_add_]').remove();
                		$('li[id*=tab_add_]').remove();
				$('#tabLinkA_'+container.replace('#','')).click();
				create_delete_set = {};
                        });
		//Отобразить кнопку отмены
		$('#'+'Editor_'+rnd_id+'_add_'+id).append($('<input type=button value="Отмена" id="'
			+rnd_id+'_Editor_cancel_add'+'" class="editor_ui" />'));
                        $('#'+rnd_id+'_Editor_cancel_add').off('click');
                        $('#'+rnd_id+'_Editor_cancel_add').on('click', function() {
                                $('div[id*=tab_add_]').remove();
                                $('li[id*=tab_add_]').remove();
                                $('#tabLinkA_'+container.replace('#','')).click();
				create_delete_set = {};
                        });
	}

	function showObjects() {
		$(container).append($('<div></div>').attr('class', 'Editor').attr('id', 'Editor_'+rnd_id));

		$.each(obj_order, function(index, value) {
			//Отобразить название объекта
			$('#'+'Editor_'+rnd_id).append($('<div></div>').attr('class', 'Editor_title_'+value+'_'+rnd_id)
                                .attr('id', 'Editor_title_'+value+'_'+rnd_id).text(c_obj.getCalcObjects()[ c_obj.getCalcObjectIndexById(value) ].title+':'));

			//Отобразить "шапку"
			$('#'+'Editor_'+rnd_id).append($('<table></table>').attr('class', 'editor_ui').attr('id', 'Editor_'+value+'_'+rnd_id));
			$('#'+'Editor_'+value+'_'+rnd_id).append($('<tr></tr>').attr('id', 'Editor_header_tr_'+value+'_'+rnd_id)
							 .attr('class','editor_ui'));
			$('#'+'Editor_header_tr_'+value+'_'+rnd_id).append($('<td></td>').attr('id', 'Editor_header_td_'+value+'_'+rnd_id)
							 .attr('class','editor_ui'));
			//Отобразить коды стран
			for (var cc = 0; cc<c_obj.getCountryCodes().length; cc++) {
				$('#'+'Editor_header_tr_'+value+'_'+rnd_id).append($('<td></td>')
				.attr('id', 'Editor_header_price_td_'+c_obj.getCountryCodes()[cc].id+'_'+rnd_id)
				.attr('class','editor_ui').text(c_obj.getCountryCodes()[cc].id));
			}

			//Отобразить столбец действий
                                $('#'+'Editor_header_tr_'+value+'_'+rnd_id).append($('<td></td>').attr('class','editor_ui')
                                        .attr('id', 'Editor_action_td_'+value+'_'+rnd_id).attr('colspan','2').text('Действие'));

			//Отобразить краткое описание позиций объекта
			$.each(editset[value], function (obj_code, data) {
				$('#'+'Editor_'+value+'_'+rnd_id).append($('<tr></tr>').attr('id', 'Editor_description_tr_'+value+'_'+obj_code+'_'+rnd_id)
                                                                               .attr('class', 'editor_ui'));
				$('#'+'Editor_description_tr_'+value+'_'+obj_code+'_'+rnd_id).append($('<td></td>').attr('class','editor_ui')
                                        .attr('id', 'Editor_description_td_'+value+'_'+obj_code+'_'+rnd_id)
					.text( generateObjectDescription(editset[value][obj_code], c_obj.getCalcObjectIndexById(value)) )); 

				//Отобразить цену позиций объекта
				for (var cc = 0; cc<c_obj.getCountryCodes().length; cc++) {
					$('#'+'Editor_description_tr_'+value+'_'+obj_code+'_'+rnd_id).append($('<td></td>')
						.attr('id', 'Editor_price_td_'+c_obj.getCountryCodes()[cc].id+'_'+value+'_'+obj_code+'_'+rnd_id)
						.attr('class','editor_ui'));
					$('#'+'Editor_price_td_'+c_obj.getCountryCodes()[cc].id+'_'+value+'_'+obj_code+'_'+rnd_id)
						.append($('<input type=text value="'+editset['price'][obj_code][c_obj.getCountryCodes()[cc].id]
						+'" id="Editor_field_input_price_'+obj_code+'_'+c_obj.getCountryCodes()[cc].id+'" class="editor_ui" />'));
					$('#Editor_field_input_'+'price_'+obj_code+'_'+c_obj.getCountryCodes()[cc].id).off('change');
					$('#Editor_field_input_'+'price_'+obj_code+'_'+c_obj.getCountryCodes()[cc].id).on('change', function() {
						chElementPrice(this.id, this.value);
					});
				}
				
				//Отобразить столбец редактирования
				$('#'+'Editor_description_tr_'+value+'_'+obj_code+'_'+rnd_id).append($('<td></td>').attr('class','editor_ui')
                                        .attr('id', 'Editor_edit_td_'+value+'_'+obj_code+'_'+rnd_id));
				$('#'+'Editor_edit_td_'+value+'_'+obj_code+'_'+rnd_id)
					.append($('<img id="Editor_edit_img_\$'+value+'\$'+obj_code+'\$'+rnd_id+'" class="editor_ui" src="img/edit.png"'
					+'/>'));
				$('#'+'Editor_edit_img_\\$'+value+'\\$'+obj_code+'\\$'+rnd_id).off('click');
                                $('#'+'Editor_edit_img_\\$'+value+'\\$'+obj_code+'\\$'+rnd_id).on('click', function() {
                                        change_prepare(this.id);
                                });

				//Отобразить столбец удаления
				$('#'+'Editor_description_tr_'+value+'_'+obj_code+'_'+rnd_id).append($('<td></td>').attr('class','editor_ui')
                                        .attr('id', 'Editor_delete_td_'+value+'_'+obj_code+'_'+rnd_id));
				$('#'+'Editor_delete_td_'+value+'_'+obj_code+'_'+rnd_id)
                                        .append($('<img id="Editor_delete_img_\$'+value+'\$'+obj_code+'\$'+rnd_id+'" class="editor_ui" src="img/delete.png"'
                                        +'/>'));
				$('#'+'Editor_delete_img_\\$'+value+'\\$'+obj_code+'\\$'+rnd_id).off('click');
				$('#'+'Editor_delete_img_\\$'+value+'\\$'+obj_code+'\\$'+rnd_id).on('click', function() {
                                	deleteElement(this.id);
					create_delete_set = {};
                        	});

			});
			$('#'+'Editor_'+value+'_'+rnd_id).append($('<tr></tr>').attr('id', 'Editor_add_tr_'+value+'_'+rnd_id)
                                                                               .attr('class', 'editor_ui'));
			$('#'+'Editor_add_tr_'+value+'_'+rnd_id).append($('<td></td>').attr('class','editor_ui')
                                        .attr('id', 'Editor_add_td_'+value+'_'+rnd_id).attr('colspan',c_obj.getCountryCodes().length+3));
			$('#'+'Editor_add_td_'+value+'_'+rnd_id).append($('<input type=button value="Добавить" id="'+'Editor_add_\$'+value+'\$'+rnd_id
								+'" class="editor_ui" />'));
			$('#'+'Editor_add_\\$'+value+'\\$'+rnd_id).off('click');
			$('#'+'Editor_add_\\$'+value+'\\$'+rnd_id).on('click', function() {
				add_prepare(this.id);
			});
		});
		
		//Отобразить кнопку сохранения
		$('#'+'Editor_'+rnd_id).append($('<input type=button value="Сохранить" id="'+rnd_id+'_Editor_save'+'" class="editor_ui" />'));
			$('#'+rnd_id+'_Editor_save').off('click');
			$('#'+rnd_id+'_Editor_save').on('click', function() {
				SaveEditor('update', editset);
			});
	}

	function generateObjectDescription (obj, cid) {
		var fields = c_obj.getCalcObjects()[cid].fields.split('|');
		var maj_description = '';
		var min_description = '';
		var result;		

		for (var fid = 0; fid<fields.length; fid++) {
			$.each(obj, function (index, value) {
				if (index == fields[fid].replace('!','')) {
					if ( fields[fid].indexOf("!") != -1 ) {
						maj_description = maj_description + value + " ";
					} else { 
						min_description = min_description + value + ', ';
					}
				}
			});
		}

		if (min_description == '') {
			result = maj_description;
		} else {
			result = maj_description + ' (' + min_description + ')';
			result = result.replace(', )', ')');
		}
		return result;
	}
	
	function SaveEditor (action, set) {
		$.ajax({
                       	type: 'GET',
                       	contentType: "application/json; charset=utf-8",
                       	dataType: "json",
              		url: 'pl/editor.pl',
                       	data: action+'='+JSON.stringify(set),
                       	async: false,
                       	success: function(data) {
					SELF.destroy();
                			Init();
                       	},
                       	error: function() { alert("Ошибка передачи данных=( - SaveEditor"); }
               	});
	}

	this.destroy = function () {
		editset = {};
		$('.'+'Editor').remove();
	}

	this.setHardwareSet = function (set) {
		hardware_set = set;
	}
}












