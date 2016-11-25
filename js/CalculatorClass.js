// CalculatorClass.js

function CalculatorClass (container) {
	var container = container;
	var calc_objects = new Array();
	var master_client = new Array();
	var country_codes = new Array();
	var helper = this;
	var subcontainer = new Array();
	var first_start = false;
	var rf_first_id = null;
	var rf_run_c = 0;
	var all_objects;

	var report = new ReportClass(this);
	
	Init();

	function Init() {
			$(container).append($('<div hidden></div>').attr('id', 'country_codes'));
			
			//Generate containers id
			var rnd_id = Math.floor((Math.random() * 10) + 1);
			subcontainer[0] = 'calculator_container_main_'+rnd_id;
			subcontainer[1] = 'calculator_subcontainer_left_'+rnd_id;
			subcontainer[3] = 'calculator_subcontainer_bottom_'+rnd_id;
			subcontainer[4] = 'calculator_subcontainer_user_'+rnd_id;
			subcontainer[21] = 'calculator_subcontainer_right_p1_'+rnd_id;
			subcontainer[22] = 'calculator_subcontainer_right_p2_'+rnd_id;

			$(container).append($('<table></table>').attr('id', subcontainer[0]));
			$('#'+subcontainer[0]).append($('<tr></tr>').attr('id', subcontainer[0]+'_tr_0'));
			$('#'+subcontainer[0]).append($('<tr></tr>').attr('id', subcontainer[0]+'_tr_1'));
			$('#'+subcontainer[0]).append($('<tr></tr>').attr('id', subcontainer[0]+'_tr_2'));
			$('#'+subcontainer[0]+'_tr_0').append($('<td></td>').attr('id', subcontainer[1]).attr('rowspan', '2'));
			$('#'+subcontainer[0]+'_tr_0').append($('<td></td>').attr('id', subcontainer[21]).attr('width','100%'));
			$('#'+subcontainer[0]+'_tr_1').append($('<td></td>').attr('id', subcontainer[22]).attr('width','100%'));
			$('#'+subcontainer[0]+'_tr_2').append($('<td></td>').attr('id', subcontainer[3]).attr('colspan', '2'));

			$('#'+subcontainer[1]).append($('<table></table>').attr('id', subcontainer[4]).attr('class','calculator_ui'));
			$('#'+subcontainer[4]).append($('<tr></tr>').attr('id', 'tr_header').attr('class','calculator_ui'));
			$('#tr_header').append($('<td></td>').attr('id', 'td_header').attr('colspan', '2'));
			getCountryCodes ();
	}

	function getCountryCodes() {
		$.ajax({
                        type: 'GET',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: 'pl/calculator.pl',
                        data: 'function=getCC',
                        async: false,
			success: function(data) {
				showCountryCodes(data);
			},
                        error: function() { alert("Ошибка передачи данных=( - getCountryCodes"); },
                });
	}

	function showCountryCodes(data) {
		for (var cc = 0; cc<data.country_codes.length; cc++) {
			$('#tr_header').append($('<td></td>').attr('id', 'td_'+data.country_codes[cc].country_code+'_price')
			.attr('class','calculator_ui').text(data.country_codes[cc].country_code));
			$('#country_codes').append($('<div></div>').attr('id', data.country_codes[cc].country_code));
		}
	}

	function parseObjectFields (fields_str, obj) {
		var fields = [];
		var fields_arr = fields_str.split('|');

		$.each(fields_arr, function (id, f) {
			var f_obj = {};
			f_obj[f] = obj[f.replace('!','')];
			fields.push(f_obj);		
		});

		return fields;
	}

	function getObjectData(data_req) {
		//*************************************************** PORTABLE FROM OLD PHP-CODDE *********************************************
		var data2 = {"getObjectData":[]};
		var pv = [];
		var r = data_req.split("&");

		for (var i=0; i<r.length; i++) {
			pv[ r[i].split("=")[0] ] = r[i].split("=")[1];
		}
		
		var obj_start = 0;
        	var obj_count = pv['objects'];
		
		if (pv['objects'] == 1) {
                	obj_count = 1;
        	} else { obj_start = 1; }

		for (var obj=obj_start;obj<obj_count;obj++) {
			//Заполнение общих параметров элемента
                        var element = {};
                        element['id'] = pv['obj_'+obj+'_id'];
                        element['type'] = pv['obj_'+obj+'_type'];
                        element['vtype'] = pv['obj_'+obj+'_vtype'];
                        element['master'] = pv['obj_'+obj+'_master'];
                        element['values'] = [];
			//Обработка объектов типа SELECTOR и SELECTOR_Q
			if (pv['obj_'+obj+'_type'] == 'SELECTOR' || pv['obj_'+obj+'_type'] == 'SELECTOR_Q') {
				//Обработка статичных объектов (кол-во которых не изменно на форме)
				$.each(all_objects[ pv['obj_'+obj+'_id'] ], function (obj_code, data) {
					//Заполнение списка значений/подобъектов элемента
					var element_q = '';
					var element_qty = 0;
					if ( all_objects[ pv['obj_0_id'] ][ pv['obj_0_value'] ] != undefined ) {
						if ( all_objects[ pv['obj_0_id'] ][ pv['obj_0_value'] ][ pv['obj_'+obj+'_id']+'_q' ] != undefined) {
                                               		element_q = all_objects[ pv['obj_0_id'] ][ pv['obj_0_value'] ][ pv['obj_'+obj+'_id']+'_q' ];
						}
						if ( all_objects[ pv['obj_0_id'] ][ pv['obj_0_value'] ][ pv['obj_'+obj+'_id']+'_qty' ] != undefined) {
                                               		element_qty = all_objects[ pv['obj_0_id'] ][ pv['obj_0_value'] ][ pv['obj_'+obj+'_id']+'_qty' ];
						}
					}
					//Если элемент имеет параметр, зависимый от его мастер-элемента
					if ( pv['obj_'+obj+'_condition-field'] != '' ) {
						if ( all_objects[ pv['obj_0_id'] ][ pv['obj_0_value'] ] != undefined ) {
							if (all_objects[ pv['obj_0_id'] ][ pv['obj_0_value'] ][ pv['obj_'+obj+'_condition-field'] ] 
							!= undefined 
							&& all_objects[ pv['obj_0_id'] ][ pv['obj_0_value'] ][ pv['obj_'+obj+'_condition-field'] ]
							== all_objects[pv['obj_'+obj+'_id']][obj_code][ pv['obj_'+obj+'_condition-field'] ]) 
							{
								element['values'].push ({"code":obj_code,
										"q":element_q,
										"qty":element_qty,
                                                                                "fields":parseObjectFields( pv['obj_'+obj+'_fields'],
                                                                                         all_objects[pv['obj_'+obj+'_id']][obj_code] )});
							}
						}
					} else {
						element['values'].push ({"code":obj_code, 
				              				 "q":element_q,
									 "qty":element_qty,
                                                                         "fields":parseObjectFields( pv['obj_'+obj+'_fields'], 
                                                                                                all_objects[pv['obj_'+obj+'_id']][obj_code] )});
					} //end else
				});
			} //end if
			else { 
				if (pv['obj_'+obj+'_type'] == 'PRICE' && all_objects[ pv['obj_0_id'].split('_')[0] ][ pv['obj_0_value'] ] != undefined) {
					if (pv['obj_'+obj+'_vtype'] == 'dynamic_child') { 
						element['values'].push(all_objects["price"][ pv['obj_0_value'] ][ pv['obj_'+obj+'_id'].split('_')[3] ]);
					} else {
						element['values'].push(all_objects["price"][ pv['obj_0_value'] ][ pv['obj_'+obj+'_id'].split('_')[2] ]);
					}
				}
			}
			data2['getObjectData'].push(element);
		} //end for
		
		//console.clear();
		//console.log("DATA-2: "+JSON.stringify(data2));
		showObjectData(data2);

		//*************************************************** PORTABLE FROM OLD PHP-CODDE *********************************************
		/*
			$.ajax({
                        	type: 'GET',
                        	contentType: "application/json; charset=utf-8",
                        	dataType: "json",
                       		url: 'pl/calculator.pl',
                        	data: data_req,
                        	async: false,
                        	success: function(data) {
					console.log("DATA-1: "+JSON.stringify(data));
                                        showObjectData(data);
                        	},
                        	error: function() { alert("Ошибка передачи данных=( - getObjectData"); }
                	});
		*/
	}

	function generateObjectFieldsString (obj, opt, data) {
		var s = '';

		for (var fid = 0; fid<data.getObjectData[obj].values[opt].fields.length; fid++) {
			$.each(data.getObjectData[obj].values[opt].fields[fid], function (index, value) {
				s = s + index + "=" + value + "|";
			});
		}

		s = s.substring(0, s.length - 1);
		s = s.replace("!","");
		return s;
	}	

	function generateObjectDescription (obj, opt, data) {
		var maj_description = '';
		var min_description = '';
		var result;		

		for (var fid = 0; fid<data.getObjectData[obj].values[opt].fields.length; fid++) {
			$.each(data.getObjectData[obj].values[opt].fields[fid], function (index, value) {
				if ( index.indexOf("!") != -1 ) {
					maj_description = maj_description + value + " ";
				} else { 
					min_description = min_description + value + ', ';
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

	/*
	---showObjectData
	Отобразить данные полученные с сервера в объекты DOM-модели
	*/
	function showObjectData(data) {
		var country_codes = $('#country_codes').find('div');
		var dynamic_qty = 0;
		var Q = '';

		report.destroy();		

		if (rf_run_c == 0) {
			rf_first_id = data;
		}
		rf_run_c++;

		for (var obj = 0; obj<data.getObjectData.length; obj++) {
			if (data.getObjectData[obj].type == "SELECTOR" || data.getObjectData[obj].type == "SELECTOR_Q") {
				if (data.getObjectData[obj].vtype == 'static') {
					$("#"+data.getObjectData[obj].id).empty();
					$("#"+data.getObjectData[obj].id).append($("<option></option>").attr("value","none").text(''));
					for (var opt = 0; opt<data.getObjectData[obj].values.length; opt++) {
						$("#"+data.getObjectData[obj].id).append($("<option></option>")
							.attr("value", data.getObjectData[obj].values[opt].code)
							.attr("name", generateObjectFieldsString (obj, opt, data))
							.text( generateObjectDescription (obj, opt, data) ));

						if (data.getObjectData[obj].type == "SELECTOR_Q" && opt == data.getObjectData[obj].values.length-1)  {
							$("#"+data.getObjectData[obj].id+"_q").empty();
							for (var j=0; j<data.getObjectData[obj].values[opt].q; j++) {
								$("#"+data.getObjectData[obj].id+"_q").append($("<option></option>")
								.attr("value", j+1).text(j+1));
							}
							$("#"+data.getObjectData[obj].id+"_q").off('change');
							$("#"+data.getObjectData[obj].id+"_q").on('change', function() {
                                                		calc_objects[helper.getCalcObjectIndexById( this.id.replace("_q", "") )].q = 
								$("#"+this.id).find("option:selected").text();
								
								if (calc_objects[helper.getCalcObjectIndexById( this.id.replace("_q", "") )].q > 1) {
                                                			Q = calc_objects[helper.getCalcObjectIndexById( this.id.replace("_q", "") )].q+"x";
                                        			} else { Q = ''; }

								for (var cc = 0; cc<country_codes.length; cc++) {
									$("#"+this.id.replace("_q", "_price_")+country_codes[cc].id)
									.text(Q+calc_objects[helper.getCalcObjectIndexById
                                                                                        (this.id.replace("_q", "_price_")+country_codes[cc].id)]
                                                                                        .value);
								}

								report.destroy();
								report.generate();
                                        		});
							$("#"+data.getObjectData[obj].id+"_q").change();
						}
					} //end for
					$("#"+data.getObjectData[obj].id).off('change');
					$("#"+data.getObjectData[obj].id).on('change', function() {
				 		onChange(this.id, this.getAttribute('class'), this.value, this.name);
					});
					$("#"+data.getObjectData[obj].id).change();
				} else if (data.getObjectData[obj].vtype == 'dynamic') { //for dynamic objects
					if (dynamic_qty == 0) {
						deleteDynamicObjectsChilds();
					}
					dynamic_qty++;

					if (data.getObjectData[obj].values.length > 0) {
						$("#tr_"+data.getObjectData[obj].id).hide();

						for (var a=0; a<data.getObjectData[obj].values[0].qty; a++) {
							helper.createObject (data.getObjectData[obj].id+'_'+a,
								(data.getObjectData[obj].id+(a+1)).toUpperCase(), data.getObjectData[obj].id,
								 data.getObjectData[obj].type, '', '', false, 'dynamic_child','');
							helper.showObjects(data.getObjectData[obj].id+'_'+a);
							for (var cc = 0; cc<country_codes.length; cc++) {
								helper.showObjects(data.getObjectData[obj].id+'_'+a+'_price_'+country_codes[cc].id);
							}
							
							$("#"+data.getObjectData[obj].id+'_'+a).append($("<option></option>").attr("value","none")
							.text(""));
							for (var opt = 0; opt<data.getObjectData[obj].values.length; opt++) {
								$("#"+data.getObjectData[obj].id+'_'+a).append($("<option></option>")
								.attr("value", data.getObjectData[obj].values[opt].code)
								.attr("name", generateObjectFieldsString (obj, opt, data))
								.text( generateObjectDescription (obj, opt, data) ));
								$("#"+data.getObjectData[obj].id+'_'+a).on('change', function() {
									onChange(this.id, this.getAttribute('class'), this.value, this.name);
								});
							} //end for
						} //end for
					} else { $("#tr_"+data.getObjectData[obj].id).show(); }
				} // else if end
				} // end if

			if (data.getObjectData[obj].type == "PRICE") {
				$("#"+data.getObjectData[obj].id).text("");
				
				if (data.getObjectData[obj].values.length == 0) {
					calc_objects[helper.getCalcObjectIndexById(data.getObjectData[obj].id)].value = 0;
				}
				if ( calc_objects[helper.getCalcObjectIndexById(data.getObjectData[obj].master)].type == "SELECTOR_Q" ) {
					if (calc_objects[helper.getCalcObjectIndexById(data.getObjectData[obj].master)].q > 1) {
						Q = calc_objects[helper.getCalcObjectIndexById(data.getObjectData[obj].master)].q+"x";
					} else { Q = ''; }
				}
				for (var opt = 0; opt<data.getObjectData[obj].values.length; opt++) {
					$("#"+data.getObjectData[obj].id).text(Q+data.getObjectData[obj].values[opt]);
					calc_objects[helper.getCalcObjectIndexById(data.getObjectData[obj].id)].value = data.getObjectData[obj].values[opt];
				} //end for
			} //end if PRICE
		} //end for
		if (data == rf_first_id) {
			rf_run_c = 0;
			if (!first_start) {
				report.generate();
			}
		}
		
	}

	/*
	--- prepareObjectDataRequest	

	Подготовка формата запроса данных для объектов, а также
	отправка данного запроса на выполнение
	*/
	function prepareObjectDataRequest(id,type,value,vtype,fields) {
		var data_req = '';
		var objects_count = 0;
		//INFO: obj_0 - master object
		data_req = 'function=getObjectData'
				+'&obj_0_id='+id+'&obj_0_type='+type+'&obj_0_value='+value
				+'&obj_0_condition-field='
				+'&obj_0_vtype='+vtype
				+'&obj_0_master='
				+'&obj_0_fields='+fields;
		for (var n = 0; n<master_client[id].length; n++) {
			if (master_client[id][n].active == true) {
				objects_count++;
				data_req = data_req
                                + '&obj_'+(n+1)+'_id='+master_client[id][n].id
                                + '&obj_'+(n+1)+'_type='+master_client[id][n].type
				+ '&obj_'+(n+1)+'_vtype='+master_client[id][n].vtype
				+ '&obj_'+(n+1)+'_master='+master_client[id][n].master
                                + '&obj_'+(n+1)+'_value='+master_client[id][n].value
				+ '&obj_'+(n+1)+'_condition-field='+master_client[id][n].condition_field
				+ '&obj_'+(n+1)+'_fields='+master_client[id][n].fields;
			}
		}
		data_req = data_req + '&objects='+(objects_count+1);
		getObjectData (data_req); 
	}

	function onChange(id, type, value, vtype) {
		for (var n = 0; n<master_client[id].length; n++) {
			master_client[id][n].active = true;
		}
		calc_objects[helper.getCalcObjectIndexById(id)].value = $("#"+id).find("option:selected").text();
		calc_objects[helper.getCalcObjectIndexById(id)].fv = $("#"+id).find("option:selected").attr("name");
		prepareObjectDataRequest (id,type,value,vtype);
	}

	/*
	--- showObject

	Отображение DOM-модели из основного массива объектов
	(выполняется при старте приложения)
	*/
	function showObject(obj) {
			if (calc_objects[obj].type == "SELECTOR" || calc_objects[obj].type == "SELECTOR_Q") {
				$('#'+subcontainer[4]).append($('<tr></tr>').attr('id', 'tr_'+calc_objects[obj].id)
				.attr("class", calc_objects[obj].type).attr("name", calc_objects[obj].vtype));
				$('#tr_'+calc_objects[obj].id).append($('<td></td>').attr('id', 'td_'+calc_objects[obj].id+'_text')
										    .attr('class','calculator_ui').text(calc_objects[obj].title));
				$('#tr_'+calc_objects[obj].id).append($('<td></td>').attr('class','calculator_ui')
										    .attr('id', 'td_'+calc_objects[obj].id+'_select'));
				$('#td_'+calc_objects[obj].id+'_select').append($('<select></select>').attr('id', calc_objects[obj].id)
							.attr("class", calc_objects[obj].type).attr("name", calc_objects[obj].vtype));
				if (calc_objects[obj].type == "SELECTOR_Q") {
					$('#td_'+calc_objects[obj].id+'_select').append($('<select></select>').attr('id', calc_objects[obj].id+'_q')
                                                        .attr("class", calc_objects[obj].type).attr("name", calc_objects[obj].vtype));
				}
				if (calc_objects[obj].active == true) {
					// Запрос данных для объектов активизирующихся при первом старте	
					prepareObjectDataRequest (calc_objects[obj].id,calc_objects[obj].type,calc_objects[obj].value,
									calc_objects[obj].vtype, calc_objects[obj].fields);
				}
			}
			if (calc_objects[obj].type == "PRICE") {
				$('#tr_'+calc_objects[obj].master).append($('<td></td>').attr('id', ''+calc_objects[obj].id)
				    .attr('class','calculator_ui').text(calc_objects[obj].title));
			}
	}

	function debug_printArr(arr, id) {
		var str = '';
		if (id == '') {
			for (var i = 0; i<arr.length; i++) {
				str = str+'\n'+arr[i].id;
			}
		} else	{
				for (var i = 0; i<arr[id].length; i++) {
					str = str+'\n'+arr[id][i].id;
				}
		}
		return str;	
	}

	function deleteDynamicObjectsChilds() {
		$("[name=dynamic_child]").remove();
		for (var i = 0; i<calc_objects.length; i++) {
			if ( master_client[ calc_objects[i].id ] ) 
			{
				for (var j = 0; j<master_client[ calc_objects[i].id ].length; j++) {
					if (master_client[ calc_objects[i].id ][j].vtype == 'dynamic_child') {
						master_client[ calc_objects[i].id ].splice(j, 1);
						j--;
					}
				}
			}
			if (calc_objects[i].vtype == 'dynamic_child') {
				delete master_client[ calc_objects[i].id ];
				calc_objects.splice(i, 1);
				i--;
			}
		}
	}

	this.getCalcObjectIndexById = function (id) {
		for (var i=0; i<calc_objects.length; i++) {
                        if (calc_objects[i].id == id) {
                                return i;
				break;
                        }
                }
	}

	this.showObjects = function (object_id) {
		if (object_id == 'ALL') {
			first_start = true;
			all_objects = new InitClass(helper).getObjects();
			for (var i = 0; i<calc_objects.length; i++) {
				showObject(i);
			}
			report.generate();
			first_start = false;
		} else { 
			for (var i=0; i<calc_objects.length; i++) {
                                if (calc_objects[i].id == object_id) {
					showObject(i);
					break;
                                }
                        }
		}
	}
	
	/*
	--- createObject
	Создание общего массива объектов, а также массива объектов - клиентов
	
	Краткое описание алгоритма Мастер->клиент:
	 						Объект мастер получает список значений для самого себя из базы.
							Объекты-клиенты имеют параметр с указанием "своего" мастера
							и получат данные из базы в зависимости от того какое значение
							мастер-объекта выбрано в данный момент.
	*/
	this.createObject = function (id, title, master, type, value, condition_field /*for clients only*/, active, vtype, fields, qf) {
		country_codes = $('#country_codes').find('div');
		if (type == "SELECTOR" || type == "SELECTOR_Q") {
			// Создание массива объектов-селекторов
			calc_objects.push( {'id':id,'title':title,'master':master,'type':type,'value':value,'condition_field':condition_field,
						'active':active, 'vtype':vtype, 'fields':fields, 'fv':undefined, 'q':1, 'qf':qf} );
			master_client[id] = new Array();

			/* Объекты указания цены являются клиентами объектов "селекторов" (отображают значения в зависимости
			   от выбранного значения объекта-селектора)
			*/
			for (var cc = 0; cc<country_codes.length; cc++) {
				calc_objects.push( {'id':id+'_price_'+country_codes[cc].id, 'title':'', 'master':id, 'type':'PRICE', 'value':0,
					'condition_field':country_codes[cc].id, 'active':false, 'vtype':vtype} );
				master_client[ id ].push( {'id':id+'_price_'+country_codes[cc].id, 'title':'', 
						'master':id, 'type':'PRICE', 'value':'',
						'condition_field':country_codes[cc].id, 'active':false, 'vtype':vtype} );
			} //end for

			if (master != '') {
				master_client[ master ]
					.push( {'id':id,'type':type,'value':value,'master':master,
						'condition_field':condition_field, 'active':active, 'vtype':vtype, 'fields':fields} );
			}
		} // end if	
	}

	this.getSubContainer = function () {
		return subcontainer;
	}

	this.getCalcObjects = function () {
		return calc_objects;
	}

	this.getCountryCodes = function () {
		return country_codes;
	}

	this.setReportShortDescription = function (s) {
		report.setShortDescriptionMask (s);
	}
}
