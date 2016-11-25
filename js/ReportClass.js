//ReportClass

function ReportClass (calculator) {
        var c_obj = calculator;
	var mathvars;
	var _objects = new Array();	
	var short_description_mask = '';
	var rnd_id = 'report_'+Math.floor((Math.random() * 10) + 1);
	var priceList = new Array ();
	var STAR_objects = {}
	var COMPROMISE_objects = {}
	var RSave = {}

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
                       	error: function() { alert("Ошибка передачи данных=( - getMathVars"); }
               	});
	}

	function show () {
		getMathVars();

		//Prices
		$('#'+c_obj.getSubContainer()[4]).append($('<tr></tr>').attr('id', rnd_id+'_tr_hwprice').attr("class", rnd_id));
                $('#'+rnd_id+'_tr_hwprice').append($('<td></td>').attr('id', rnd_id+'_td_hwprice').attr('colspan', '2').attr('align', 'right')
		.attr('class','calculator_ui').text('Стоимость железа:'));
		for (var i = 0; i<mathvars.primeprice.length; i++) {
			$('#'+rnd_id+'_tr_hwprice').append($('<td></td>').attr('id', rnd_id+'_td_hwprice_'+mathvars.primeprice[i].CC)
			.attr('class','calculator_ui'));
		}
		for (var i = 0; i<mathvars.payback.length; i++) {
			$('#'+c_obj.getSubContainer()[4]).append($('<tr></tr>').attr('id', rnd_id+'tr_payback_'+i).attr("class", rnd_id));
			$('#'+rnd_id+'tr_payback_'+i).append($('<td></td>').attr('id', rnd_id+'td_payback_'+i).attr('colspan', '2').attr('align', 'right')
			.attr('class','calculator_ui').text('Цена '+(i+1)+':'));
			for (var j = 0; j<mathvars.primeprice.length; j++) {
				$('#'+rnd_id+'tr_payback_'+i).append($('<td></td>').attr('id', rnd_id+'td_payback_'+i+'_'+mathvars.primeprice[j].CC)
				.attr('class','calculator_ui'));
			}
		}
		
		//Description
		$('#'+c_obj.getSubContainer()[21]).append($('<div></div>').attr('class', rnd_id).attr('id', rnd_id+'_sdescr'));
		$('#'+c_obj.getSubContainer()[21]).append($('<div></div>').attr('class', rnd_id).attr('id', rnd_id+'_fdescr'));
		$('#'+c_obj.getSubContainer()[22]).append($('<input type=button value="Сохранить" id="'+rnd_id+'_R_save'+'" class="'+rnd_id+'" />'));
		$('#'+rnd_id+'_R_save').off('click');
		$('#'+rnd_id+'_R_save').on('click', function() {
			SaveReport();
		});

		$('#'+rnd_id+'_sdescr').append($('<div></div>').attr('class', rnd_id+'_sdescr_h').attr('id',rnd_id+'_sdescr_h').text("Краткое описание:"));
		$('#'+rnd_id+'_sdescr').append($('<div></div>').attr('class', rnd_id+'_sdescr_div').attr('id',rnd_id+'_sdescr_div').text(""));
		$('#'+rnd_id+'_sdescr').append($('<p></p>').attr('class', rnd_id));
		$('#'+rnd_id+'_fdescr').append($('<div></div>').attr('class', rnd_id+'_fdescr_h').attr('id',rnd_id+'_fdescr_h').text("Подробное описание:"));
		//Description
		
		LoadReport (0);
	}

	function SaveReport () {
		if (inspectObjectsCheck() === false) {
			alert ("Не все поля выбраны!");
			return -1;
		}

		$.ajax({
                       	type: 'GET',
                       	contentType: "application/json; charset=utf-8",
                       	dataType: "json",
              		url: 'pl/report.pl',
                       	data: "s=" + JSON.stringify(RSave).replace(/\+/g,'_!PLUS!_'),
                       	async: false,
                       	success: function(data) {
					LoadReport(data);
                       	},
                       	error: function() { alert("Ошибка передачи данных=( - SaveReport"); }
               	});
	}

	function LoadReport (d) {
		var h = new Array();
		var h_indx = 1;

		//Draw header
		$('.'+rnd_id+'_R').remove();
		$('#'+c_obj.getSubContainer()[3]).append($('<div></div>').attr('class', rnd_id+'_R').attr('id', rnd_id+'_R-header'));
		$('#'+rnd_id+'_R-header').append($('<div></div>').attr('class', rnd_id+'_R-title')
						 .attr('id', rnd_id+'_R-title').text("Сохраненные конфигурации:"));

		$('#'+rnd_id+'_R-header').append($('<table></table>').attr('class', 'report_ui').attr('id', rnd_id+'_R-table')
									     .attr('width','100%').attr('border', '1'));
		$('#'+rnd_id+'_R-table').append($('<tr></tr>').attr('id', rnd_id+'_R-mainrow'));
		$('#'+rnd_id+'_R-mainrow').append($('<td></td>').attr('id', rnd_id+'_R-description').attr('width','50%')
								.attr('class','report_ui'));
		h[0] = 'description';

		for (var i = 0; i<mathvars.primeprice.length; i++) {
                        for (var n = 0; n<mathvars.payback.length; n++) {
				$('#'+rnd_id+'_R-mainrow').append($('<td></td>').attr('id', rnd_id+'_R-'+mathvars.primeprice[i].CC+'_price'+(n+1))
										.attr('class','report_ui').text(mathvars.primeprice[i].CC+(n+1)));
				h[h_indx] = mathvars.primeprice[i].CC+'_price'+(n+1);
				h_indx++;
                        }
                }
		for (var i = 0; i<mathvars.primeprice.length; i++) {
			$('#'+rnd_id+'_R-mainrow').append($('<td></td>').attr('id', rnd_id+'_R-'+mathvars.primeprice[i].CC+'_hwprice')
									.attr('class','report_ui').text('Железо '+mathvars.primeprice[i].CC));
			h[h_indx] = mathvars.primeprice[i].CC+'_hwprice';
			h_indx++;
		}
		$('#'+rnd_id+'_R-mainrow').append($('<td></td>').attr('class','report_ui')
                                        .attr('id', rnd_id+'_R-action'));
		
		
		//Draw entrys
		if (d == 0) {
			$.ajax({
                       		type: 'GET',
                       		contentType: "application/json; charset=utf-8",
                       		dataType: "json",
              			url: 'pl/report.pl',
                       		data: "l=0",
                       		async: false,
                       		success: function(data) {
					LoadReport(data);
                       		},
                       		error: function() { alert("Ошибка передачи данных=( - LoadReport"); }
               		});
		} else {
			for (var j=0; j<d.result.length; j++) {
				$('#'+rnd_id+'_R-table').append($('<tr></tr>').attr('id', rnd_id+'_R-row-'+j));
				for (var x=0; x<h.length; x++) {
					$('#'+rnd_id+'_R-row-'+j).append($('<td></td>').
					attr('class','report_ui').attr('id', rnd_id+'_R-'+h[x]+'-'+j).text(d.result[j][ h[x] ]));
				}
				$('#'+rnd_id+'_R-row-'+j).append($('<td></td>')
				.attr('class','report_ui').attr('id', rnd_id+'_R-'+d.result[j]['id']));

				$('#'+rnd_id+'_R-'+d.result[j]['id'])
				.append($('<img id="Report_delete_img_\$'+d.result[j]['id']+'" class="report_ui" src="img/delete.png"'+'/>'));
				$('#'+'Report_delete_img_\\$'+d.result[j]['id']).off('click');
                                $('#'+'Report_delete_img_\\$'+d.result[j]['id']).on('click', function() {
                                        deleteElement(this.id);
                                });
			}
		}
	}

	function deleteElement (id) {
                if (confirm('Вы действительно хотите удалить?')) {
			$.ajax({
                       		type: 'GET',
                       		contentType: "application/json; charset=utf-8",
                       		dataType: "json",
              			url: 'pl/report.pl',
                       		data: "d=" + id.split('$')[1],
                       		async: false,
                       		success: function() {
					LoadReport(0);
                       		},
                       		error: function() { alert("Ошибка передачи данных=( - deleteEelment() in ReportClass"); }
               		});
                }
        }

	function getValueByField (obj,field) {
		var fields;
		var field_value;
		var result;		

		if (calc_objects[obj].fv !== undefined) {
			fields = calc_objects[obj].fv.split('|');

			for (var i=0; i<fields.length; i++) {
				field_value = fields[i].split('=');
				
				if (field_value[0] == field) {
					if (calc_objects[obj].qf == field) {
						field_value[1] = (parseInt(field_value[1]) * calc_objects[obj].q) + field_value[1].replace(/\d+/g, '');
					}
					result = field_value[1];
				}
			}
		} else { result = '' };

		return result;
	}

	function showArr (arr) {
		var s = '';
		for (var x=0; x<arr.length; x++) {
			s = s + arr[x] + ",";
		}
		s = s.substring(0, s.length - 1);
		alert ("Arr:"+s);
	}

	function processObjectDynamic (o,f) {
		var d_objects = new Array ();
		var indx = 0;
		var r_cnt = 0;
		var str = '';
		var d_obj;
		var title;
		var v;
		
		o = o.replace("%","");

		for (var i=0; i<calc_objects.length; i++) {
			if ( calc_objects[i].id.indexOf(o.replace(/[*^]/g,"")) != -1 ) { title = calc_objects[i].title; break; }
		}		

		for (var i=0; i<calc_objects.length; i++) {
			if ( calc_objects[i].id.indexOf(o.replace(/[*^]/g,"")+"_") != -1 && calc_objects[i].type == "SELECTOR" ) {
				d_objects[indx] = i;
				indx++;
			}
		}
		for (var i=0; i<d_objects.length; i++) {
			v = getValueByField(d_objects[i], f);
			if (v != "" && v != "Empty") {
				setObjectCheck(o.replace(/[a-zA-Z0-9]/g,"")+calc_objects[ d_objects[i] ].id,"checked");
                        } else { setObjectCheck(o.replace(/[a-zA-Z0-9]/g,"")+calc_objects[ d_objects[i] ].id,"unchecked"); }

			calc_objects[i].id = calc_objects[i].id.replace(/[*^]/g,"");
			d_objects[i] = v;
		}
		for (var i=0; i<d_objects.length; i++) {
			r_cnt = 0;
			d_obj = d_objects[i];
			if (d_obj != "") {
				for (var j=0; j<d_objects.length; j++) {
					if (d_obj == d_objects[j]) {
						r_cnt++;
						d_objects[j] = "";
					}
				}
			}
			if (r_cnt > 0) {
				str = str + r_cnt + "x" + d_obj + " " + title;
			}
		}
		return str;
	}

	function setObjectCheck (o, check) {
		if (o.indexOf("*") != -1) {
			o = o.replace("*", "");
			STAR_objects[o] = check;
		} else { if (o.indexOf("^") != -1) { o = o.replace("^",""); COMPROMISE_objects[o] = check; } }
	}

	function inspectObjectsCheck () {
		var truefalse = true;

		$.each(STAR_objects, function(index, value) {
			if (value == "unchecked") {
				truefalse = false;
			}
		});
		
		if (truefalse === true && Object.keys(COMPROMISE_objects).length > 0) {
			truefalse = false;
			$.each(COMPROMISE_objects, function(index, value) {
				if (value == "checked") {
					truefalse = true;
				}
			});
		}

		return truefalse;
	}

	function processObjectStatic (o,f) {
		var str = '';
		var v;

		for (var i=0; i<calc_objects.length; i++) {
			if ( calc_objects[i].id == o.replace(/[*^]/g,"") ) {
				v = getValueByField(i,f);
				if (v != "" && v != "Empty") {
					setObjectCheck(o,"checked");
				} else { setObjectCheck(o,"unchecked"); } 
				str = str + v;
			}
		}
		return str;
	}

	function showShortDescription () {
		var field_value;
		var fv;
		var str = '';

		if (short_description_mask != '') {
			field_value = short_description_mask.split('|');

			for (var i=0; i<field_value.length; i++) {
				fv = field_value[i].split('.');
				if (fv[1] !== undefined) {
					if ( fv[0].indexOf("%") == -1 ) {
						str = str + processObjectStatic (fv[0],fv[1]);
					} else { str = str + processObjectDynamic (fv[0],fv[1]); }
				} else {
					str = str + fv[0];
				} //end else
			} //end for
		} //end if

		if ( inspectObjectsCheck() === true) {
			$('#'+rnd_id+'_sdescr_div').text(str);
			RSave['description'] = str;
			return true;
		}
		return false;
	}

	function showFullDescription () {
		var d_objects = new Array ();	
		var indx = 0;
		var r_cnt = 0;
		var d_str = new Array ();
		var d_obj;
		var title;

		// Dynamic objects concatenation
		for (var i=0; i<calc_objects.length; i++) {
                        if ( calc_objects[i].vtype == "dynamic_child" && calc_objects[i].type == "SELECTOR" && 
			     calc_objects[i].value != "Empty" && calc_objects[i].value != "") {
                                d_objects[indx] = calc_objects[i].value;
                                indx++;
                        }
		}
		indx = 0;
		
		for (var i=0; i<d_objects.length; i++) {
			r_cnt = 0;
			d_obj = d_objects[i];
			if (d_obj != "") {
				for (var j=0; j<d_objects.length; j++) {
					if (d_obj == d_objects[j]) {
						r_cnt++;
						d_objects[j] = "";
					}
				}
			}
			if (r_cnt > 0) {
				d_str[indx] = r_cnt + "x " + d_obj;
				indx++;
			}
		} 
		// Dynamic objects concatenation end		

		for (var i=0; i<calc_objects.length; i++) {
			if ( (calc_objects[i].type == "SELECTOR" || calc_objects[i].type == "SELECTOR_Q")
				&& calc_objects[i].value != "Empty" && calc_objects[i].value != "" && calc_objects[i].vtype != "dynamic_child") {
				
				$('#'+rnd_id+'_fdescr').append($('<div></div>').attr('class',rnd_id+'_fdescr_div').text(calc_objects[i].q+"x "
				+calc_objects[i].value));
			}
			
		}

		for (var i=0; i<d_str.length; i++) {
			$('#'+rnd_id+'_fdescr').append($('<div></div>').attr('class',rnd_id+'_fdescr_div').text(d_str[i]));
		}
	}

	function showPrice () {
		var price;
		var hwprice = 0;		

		for (var i = 0; i<mathvars.primeprice.length; i++) {
			for (var j=0; j<calc_objects.length; j++) {
				if (calc_objects[j].type == "PRICE" && calc_objects[j].id.indexOf(mathvars.primeprice[i].CC) != -1) {
					hwprice = hwprice + (calc_objects[j].value * calc_objects[ c_obj.getCalcObjectIndexById(calc_objects[j].master) ].q);
				}
			}
			
			price = { "hwprice": hwprice }
			
			if (price.hwprice != 0) {
				for (var n = 0; n<mathvars.payback.length; n++) {
					price['price'+n] = ( (hwprice/mathvars.payback[n].months)+(mathvars.primeprice[i].price
					*parseInt(getValueByField (c_obj.getCalcObjectIndexById('chassis'),'units_count'))) ).toFixed(1);
				}
			}

			priceList [mathvars.primeprice[i].CC] = new Array();
			priceList [mathvars.primeprice[i].CC].push(price);
			hwprice = 0;
                }

		for (var i = 0; i<mathvars.primeprice.length; i++) {
			$('#'+rnd_id+'_td_hwprice_'+mathvars.primeprice[i].CC).text(priceList[mathvars.primeprice[i].CC][0].hwprice);
			RSave[mathvars.primeprice[i].CC+'_hwprice'] = priceList[mathvars.primeprice[i].CC][0].hwprice;

			for (var n = 0; n<mathvars.payback.length; n++) {
				if (priceList[mathvars.primeprice[i].CC][0]['price'+n] == undefined) {
					priceList[mathvars.primeprice[i].CC][0]['price'+n] = 0;
				}
				$('#'+rnd_id+'td_payback_'+n+'_'+mathvars.primeprice[i].CC).text(priceList[mathvars.primeprice[i].CC][0]['price'+n]);
				RSave[mathvars.primeprice[i].CC+'_price'+(n+1)] = priceList[mathvars.primeprice[i].CC][0]['price'+n];
			}
		}
	}

	function update () {
		//var _object = {
		//	"id": id,
		//	"type": type,
		//	"values": [{"value":value}]
		//}

                calc_objects = c_obj.getCalcObjects();
		if ( showShortDescription() === true) { showFullDescription (); }
		showPrice ();
	}

	this.setShortDescriptionMask = function (s) {
		short_description_mask = s;
	}

	this.generate = function () {
		show ();
		update ();
	}

	this.destroy = function () {
		$('.'+rnd_id).remove();
		$('.'+rnd_id+'_R').remove();
	}
}

