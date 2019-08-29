const ready = require('../../js/utils/documentReady.js')

ready(function () {
	
	// Tables
	let tables = document.querySelectorAll('table');
	// if (tables.length) {
	// 	console.log('all of '+ tables.length + ' the tables wrapped within the content');
	// }

	tables.forEach(function (table) {
		
		if (table.closest('.table')) {
			return
		}
		var wrap = document.createElement('div');
		wrap.classList.add('table');

		wrap.innerHTML = table.outerHTML;
		table.parentNode.replaceChild(wrap,table);

	});


});