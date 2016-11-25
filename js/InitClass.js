//InitClass

function InitClass (c_obj) {
	var editset = {};

 	this.getObjects = function () {
		editset['price'] = [];

		for (var i=0; i<c_obj.getCalcObjects().length; i++) {
			if (c_obj.getCalcObjects()[i].type == "SELECTOR" || c_obj.getCalcObjects()[i].type == "SELECTOR_Q") {
				editset[c_obj.getCalcObjects()[i].id] = [];
			}
		}

                $.ajax({
                        type: 'GET',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        url: 'pl/editor.pl',
                        data: "get=" + JSON.stringify(editset),
                        async: false,
                        success: function(data) {
                                      editset = data;
				      convertJSON ();
				      convertJSON_price ();
                        },
                        error: function() { alert("Ошибка передачи данных=( - getObjects in EditorClass"); }
                });

		return editset;
        }
	
	function convertJSON () {
		var temp = {}

		$.each(editset, function(obj, data) {
			if (obj != 'price') {
				$.each(data, function(element, element_data) {
					if ( temp[ element_data['code'] ] == undefined) {
						temp[ element_data['code'] ] = {};
					}
					temp[ element_data['code'] ] = element_data;
				});
				editset[obj] = temp;
				temp = {};
			} //endif
		});
	}
	
	function convertJSON_price () {
		var price = {}

		for (var p=0; p<editset['price'].length; p++) {
			if ( price[ editset['price'][p]['code'] ] == undefined ) {
				price[ editset['price'][p]['code'] ] = {};
			}
			price[ editset['price'][p]['code'] ][ editset['price'][p]['country_code'] ] = editset['price'][p]['price'];
		}
		editset['price'] = price;
	}
}












