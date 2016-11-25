function MainContainerClass (container) {
	var rnd_id = Math.floor((Math.random() * 10) + 1);

	Init();

	function Init() {
		$(container).append($('<ul></ul>').attr('class', 'tab').attr('id', 'MainContainer_'+rnd_id));
	}

	function openTab(tabId, needReloadPage) {
		if (needReloadPage === true) {
			location.reload();
		}

    		var i, tabcontent, tablinks;

    		// Get all elements with class="tabcontent" and hide them
    		tabcontent = document.getElementsByClassName("tabcontent");
    		for (i = 0; i < tabcontent.length; i++) {
        		tabcontent[i].style.display = "none";
    		}

    		// Get all elements with class="tablinks" and remove the class "active"
    		tablinks = document.getElementsByClassName("tablinks");
    		for (i = 0; i < tablinks.length; i++) {
        		tablinks[i].className = tablinks[i].className.replace(" active", "");
    		}

    		// Show the current tab, and add an "active" class to the link that opened the tab
    		document.getElementById(tabId).style.display = "block";
		/*if (evt != undefined) {
    			evt.currentTarget.className += " active";
		} else {*/
			$('#'+'tabLinkA_'+tabId).attr('class', 'tablinks active');
			document.title = $('#'+'tabLinkA_'+tabId).text();
		//}
	}

	this.addTab = function (tabId, tabTitle, is_default) {
		$('#'+'MainContainer_'+rnd_id).append($('<li></li>').attr('id', 'tabLink_'+tabId+'_'+rnd_id));
		$('#'+'tabLink_'+tabId+'_'+rnd_id).append($('<a></a>').attr('id', 'tabLinkA_'+tabId+'_'+rnd_id).attr('class', 'tablinks')
							    .attr('href', 'javascript:void(0)').text(tabTitle));
		$('#'+'tabLinkA_'+tabId+'_'+rnd_id).on('click', function() {
			openTab(tabId+'_'+rnd_id, false);
		});
		$(container).append($('<div></div>').attr('class', 'tabcontent').attr('id', tabId+'_'+rnd_id));

		if (is_default == true) {
			$('#'+'tabLinkA_'+tabId+'_'+rnd_id).click();
			$('#'+'tabLinkA_'+tabId+'_'+rnd_id).off('click');
			$('#'+'tabLinkA_'+tabId+'_'+rnd_id).on('click', function() {
                        	openTab(tabId+'_'+rnd_id, true);
                	});
		}
	}

	this.getTab = function (tab) {
		return '#'+tab+'_'+rnd_id;
	}
}
