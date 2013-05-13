/**
 * jquery.filterTable
 *
 * This plugin will add a search filter to tables. When typing in the filter,
 * any rows that do not contain the filter will be hidden.
 *
 * Utilizes bindWithDelay() if available. https://github.com/bgrins/bindWithDelay
 *
 * @version v1.4
 * @author Sunny Walker, swalker@hawaii.edu
 */
(function($) {
	$.expr[':'].filterTableFind = function(a, i, m) { // build the case insensitive filtering functionality as a pseudo-selector expression
		return $(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
	};
	$.fn.filterTable = function(options) { // define the filterTable plugin
		var defaults = { // start off with some default settings
				hideTFootOnFilter: false,               // if true, the table's tfoot(s) will be hidden when the table is filtered
				containerClass:    'filter-table',      // class to apply to the container
				containerTag:      'p',                 // tag name of the container
				highlightClass:    'alt',               // class applied to cells containing the filter term
				inputType:         'search',            // tag name of the filter input tag
				label:             'Filter:',           // text to precede the filter input tag
				minRows:           8,                   // don't show the filter on tables with less than this number of rows
				placeholder:       'search this table', // HTML5 placeholder text for the filter field
				quickList:         [],                  // list of phrases to quick fill the search
				quickListClass:    'quick',             // class of each quick list item
				callback:          null                 // callback function: function(term, table){}
			},
			hsc = function(text) { // mimic PHP's htmlspecialchars() function
				return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			},
			settings = $.extend({}, defaults, options); // merge the user's settings into the defaults

		var doFiltering = function(table, q) { // handle the actual table filtering
				var tbody=table.find('tbody'); // cache the tbody element
				if (q==='') { // if the filtering query is blank
					tbody.find('tr').show().addClass('visible'); // show all rows
					tbody.find('td').removeClass(settings.highlightClass); // remove the row highlight from all cells
					if (settings.hideTFootOnFilter) { // show footer if the setting was specified
						table.find('tfoot').show();
					}
				} else { // if the filter query is not blank
					tbody.find('tr').hide().removeClass('visible'); // hide all rows, assuming none were found
					if (settings.hideTFootOnFilter) { // hide footer if the setting was specified
						table.find('tfoot').hide();
					}
					tbody.find('td').removeClass(settings.highlightClass).filter(':filterTableFind("'+q.replace(/(['"])/g,'\\$1')+'")').addClass(settings.highlightClass).closest('tr').show().addClass('visible'); // highlight (class=alt) only the cells that match the query and show their rows
					if (settings.callback) { // call the callback function
						settings.callback(q, table);
					}
				}
			}; // doFiltering()

		return this.each(function() {
			var t = $(this), // cache the table
				tbody = t.find('tbody'), // cache the tbody
				container = null, // placeholder for the filter field container DOM node
				filter = null; // placeholder for the field field DOM node
			if (t[0].nodeName==='TABLE' && tbody.length>0 && (settings.minRows===0 || (settings.minRows>0 && tbody.find('tr').length>settings.minRows)) && !t.prev().hasClass(settings.containerClass)) { // only if object is a table and there's a tbody and at least minRows trs and hasn't already had a filter added
				container = $('<'+settings.containerTag+' />'); // build the container tag for the filter field
				if (settings.containerClass!=='') { // add any classes that need to be added
					container.addClass(settings.containerClass);
				}
				container.prepend(settings.label+' '); // add the label for the filter field
				filter = $('<input type="'+settings.inputType+'" placeholder="'+settings.placeholder+'" />'); // build the filter field
				if ($.fn.bindWithDelay) { // does bindWithDelay() exist?
					filter.bindWithDelay('keyup', function() { // bind doFiltering() to keyup (delayed)
						doFiltering(t, $(this).val());
					}, 200);
				} else { // just bind to onKeyUp
					filter.bind('keyup', function() { // bind doFiltering() to keyup
						doFiltering(t, $(this).val());
					});
				} // keyup binding block
				filter.bind('click search', function() { // bind doFiltering() to click and search events
					doFiltering(t, $(this).val());
				});
				container.append(filter); // add the filter field to the container
				if (settings.quickList.length>0) { // are there any quick list items to add?
					$.each(settings.quickList, function(i, v) { // for each quick list item...
						var q = $('<a href="#" class="'+settings.quickListClass+'">'+hsc(v)+'</a>'); // build the quick list item link
						q.bind('click',function(e) { // bind the click event to it
							e.preventDefault(); // stop the normal anchor tag behavior from happening
							filter.val(v).focus().trigger('click'); // send the quick list value over to the filter field and trigger the event
						});
						container.append(q); // add the quick list link to the container
					}); // each quick list item
				} // if quick list items
				t.before(container); // add the filter field and quick list container to just before the table
			} // if the functionality should be added
		}); // return this.each
	}; // $.fn.filterTable
})(jQuery);
