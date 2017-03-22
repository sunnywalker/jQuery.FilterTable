/**
 * jquery.filterTable
 *
 * This plugin will add a search filter to tables. When typing in the filter,
 * any rows that do not contain the filter will be hidden.
 *
 * Utilizes bindWithDelay() if available. https://github.com/bgrins/bindWithDelay
 *
 * @version v1.5.7
 * @author Sunny Walker, swalker@hawaii.edu
 * @license MIT
 */
(function ($) {
    var jversion = $.fn.jquery.split('.'),
        jmajor = parseFloat(jversion[0]),
        jminor = parseFloat(jversion[1]);
    // build the pseudo selector for jQuery < 1.8
    if (jmajor < 2 && jminor < 8) {
        // build the case insensitive filtering functionality as a pseudo-selector expression
        $.expr[':'].filterTableFind = function (a, i, m) {
            return $(a).text().toUpperCase().indexOf(m[3].toUpperCase().replace(/"""/g, '"').replace(/"\\"/g, "\\")) >= 0;
        };
        // build the case insensitive all-words filtering functionality as a pseudo-selector expression
        $.expr[':'].filterTableFindAny = function (a, i, m) {
            // build an array of each non-falsey value passed
            var raw_args = m[3].split(/[\s,]/),
                args = [];
            $.each(raw_args, function (j, v) {
                var t = v.replace(/^\s+|\s$/g, '');
                if (t) {
                    args.push(t);
                }
            });
            // if there aren't any non-falsey values to search for, abort
            if (!args.length) {
                return false;
            }
            return function (a) {
                var found = false;
                $.each(args, function (j, v) {
                    if ($(a).text().toUpperCase().indexOf(v.toUpperCase().replace(/"""/g, '"').replace(/"\\"/g, "\\")) >= 0) {
                        found = true;
                        return false;
                    }
                });
                return found;
            };
        };
        // build the case insensitive all-words filtering functionality as a pseudo-selector expression
        $.expr[':'].filterTableFindAll = function (a, i, m) {
            // build an array of each non-falsey value passed
            var raw_args = m[3].split(/[\s,]/),
                args = [];
            $.each(raw_args, function (j, v) {
                var t = v.replace(/^\s+|\s$/g, '');
                if (t) {
                    args.push(t);
                }
            });
            // if there aren't any non-falsey values to search for, abort
            if (!args.length) {
                return false;
            }
            return function (a) {
                // how many terms were found?
                var found = 0;
                $.each(args, function (j, v) {
                    if ($(a).text().toUpperCase().indexOf(v.toUpperCase().replace(/"""/g, '"').replace(/"\\"/g, "\\")) >= 0) {
                        // found another term
                        found++;
                    }
                });
                return found === args.length; // did we find all of them in this cell?
            };
        };
    } else {
        // build the pseudo selector for jQuery >= 1.8
        $.expr[':'].filterTableFind = jQuery.expr.createPseudo(function (arg) {
            return function (el) {
                return $(el).text().toUpperCase().indexOf(arg.toUpperCase().replace(/"""/g, '"').replace(/"\\"/g, "\\")) >= 0;
            };
        });
        $.expr[':'].filterTableFindAny = jQuery.expr.createPseudo(function (arg) {
            // build an array of each non-falsey value passed
            var raw_args = arg.split(/[\s,]/),
                args = [];
            $.each(raw_args, function (i, v) {
                // trim the string
                var t = v.replace(/^\s+|\s$/g, '');
                if (t) {
                    args.push(t);
                }
            });
            // if there aren't any non-falsey values to search for, abort
            if (!args.length) {
                return false;
            }
            return function (el) {
                var found = false;
                $.each(args, function (i, v) {
                    if ($(el).text().toUpperCase().indexOf(v.toUpperCase().replace(/"""/g, '"').replace(/"\\"/g, "\\")) >= 0) {
                        found = true;
                        // short-circuit the searching since this cell has one of the terms
                        return false;
                    }
                });
                return found;
            };
        });
        $.expr[':'].filterTableFindAll = jQuery.expr.createPseudo(function (arg) {
            // build an array of each non-falsey value passed
            var raw_args = arg.split(/[\s,]/),
                args = [];
            $.each(raw_args, function (i, v) {
                // trim the string
                var t = v.replace(/^\s+|\s$/g, '');
                if (t) {
                    args.push(t);
                }
            });
            // if there aren't any non-falsey values to search for, abort
            if (!args.length) {
                return false;
            }
            return function (el) {
                // how many terms were found?
                var found = 0;
                $.each(args, function (i, v) {
                    if ($(el).text().toUpperCase().indexOf(v.toUpperCase().replace(/"""/g, '"').replace(/"\\"/g, "\\")) >= 0) {
                        // found another term
                        found++;
                    }
                });
                // did we find all of them in this cell?
                return found === args.length;
            };
        });
    }
    // define the filterTable plugin
    $.fn.filterTable = function (options) {
        // start off with some default settings
        var defaults = {
                // make the filter input field autofocused (not recommended for accessibility)
                autofocus: false,

                // callback function: function (term, table){}
                callback: null,

                // class to apply to the container
                containerClass: 'filter-table',

                // tag name of the container
                containerTag: 'p',

                // jQuery expression method to use for filtering
                filterExpression: 'filterTableFind',

                // if true, the table's tfoot(s) will be hidden when the table is filtered
                hideTFootOnFilter: false,

                // class applied to cells containing the filter term
                highlightClass: 'alt',

                // don't filter the contents of cells with this class
                ignoreClass: '',

                // don't filter the contents of these columns
                ignoreColumns: [],

                // use the element with this selector for the filter input field instead of creating one
                inputSelector: null,

                // name of filter input field
                inputName: '',

                // tag name of the filter input tag
                inputType: 'search',

                // text to precede the filter input tag
                label: 'Filter:',

                // filter only when at least this number of characters are in the filter input field
                minChars: 1,

                // don't show the filter on tables with at least this number of rows
                minRows: 8,

                // HTML5 placeholder text for the filter field
                placeholder: 'search this table',

                // prevent the return key in the filter input field from trigger form submits
                preventReturnKey: true,

                // list of phrases to quick fill the search
                quickList: [],

                // class of each quick list item
                quickListClass: 'quick',

                // quick list item label to clear the filter (e.g., '&times; Clear filter')
                quickListClear: '',

                // tag surrounding quick list items (e.g., ul)
                quickListGroupTag: '',

                // tag type of each quick list item (e.g., a or li)
                quickListTag: 'a',

                // class applied to visible rows
                visibleClass: 'visible'
            },
            // mimic PHP's htmlspecialchars() function
            hsc = function (text) {
                return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            },
            // merge the user's settings into the defaults
            settings = $.extend({}, defaults, options);

        // handle the actual table filtering
        var doFiltering = function (table, q) {
                // cache the tbody element
                var tbody = table.find('tbody');
                // if the filtering query is blank or the number of chars is less than the minChars option
                if (q === '' || q.length < settings.minChars) {
                    // show all rows
                    tbody.find('tr').show().addClass(settings.visibleClass);
                    // remove the row highlight from all cells
                    tbody.find('td').removeClass(settings.highlightClass);
                    // show footer if the setting was specified
                    if (settings.hideTFootOnFilter) {
                        table.find('tfoot').show();
                    }
                } else {
                    // if the filter query is not blank
                    var all_tds = tbody.find('td');
                    // hide all rows, assuming none were found
                    tbody.find('tr').hide().removeClass(settings.visibleClass);
                    // remove previous highlights
                    all_tds.removeClass(settings.highlightClass);
                    // hide footer if the setting was specified
                    if (settings.hideTFootOnFilter) {
                        table.find('tfoot').hide();
                    }
                    if (settings.ignoreColumns.length) {
                        var tds = [];
                        if (settings.ignoreClass) {
                            all_tds = all_tds.not('.' + settings.ignoreClass);
                        }
                        tds = all_tds.filter(':' + settings.filterExpression + '("' + q + '")');
                        tds.each(function () {
                            var t = $(this),
                                col = t.parent().children().index(t);
                            if ($.inArray(col, settings.ignoreColumns) === -1) {
                                t.addClass(settings.highlightClass).closest('tr').show().addClass(settings.visibleClass);
                            }
                        });
                    } else {
                        if (settings.ignoreClass) {
                            all_tds = all_tds.not('.' + settings.ignoreClass);
                        }
                        // highlight (class=alt) only the cells that match the query and show their rows
                        all_tds.filter(':' + settings.filterExpression + '("' + q + '")').addClass(settings.highlightClass).closest('tr').show().addClass(settings.visibleClass);
                    }
                }
                // call the callback function
                if (settings.callback) {
                    settings.callback(q, table);
                }
            }; // doFiltering()

        return this.each(function () {
            // cache the table
            var t = $(this),
                // cache the tbody
                tbody = t.find('tbody'),
                // placeholder for the filter field container DOM node
                container = null,
                // placeholder for the quick list items
                quicks = null,
                // placeholder for the field field DOM node
                filter = null,
                // was the filter created or chosen from an existing element?
                created_filter = true;

            // only if object is a table and there's a tbody and at least minRows trs and hasn't already had a filter added
            if (t[0].nodeName === 'TABLE' && tbody.length > 0 && (settings.minRows === 0 || (settings.minRows > 0 && tbody.find('tr').length >= settings.minRows)) && !t.prev().hasClass(settings.containerClass)) {
                // use a single existing field as the filter input field
                if (settings.inputSelector && $(settings.inputSelector).length === 1) {
                    filter = $(settings.inputSelector);
                    // container to hold the quick list options
                    container = filter.parent();
                    created_filter = false;
                } else {
                    // create the filter input field (and container)
                    // build the container tag for the filter field
                    container = $('<' + settings.containerTag + ' />');
                    // add any classes that need to be added
                    if (settings.containerClass !== '') {
                        container.addClass(settings.containerClass);
                    }
                    // add the label for the filter field
                    container.prepend(settings.label + ' ');
                    // build the filter field
                    filter = $('<input type="' + settings.inputType + '" placeholder="' + settings.placeholder + '" name="' + settings.inputName + '" />');
                    // prevent return in the filter field from submitting any forms
                    if (settings.preventReturnKey) {
                        filter.on('keydown', function (ev) {
                            if ((ev.keyCode || ev.which) === 13) {
                                ev.preventDefault();
                                return false;
                            }
                        });
                    }
                }

                // add the autofocus attribute if requested
                if (settings.autofocus) {
                    filter.attr('autofocus', true);
                }

                // does bindWithDelay() exist?
                if ($.fn.bindWithDelay) {
                    // bind doFiltering() to keyup (delayed)
                    filter.bindWithDelay('keyup', function () {
                        doFiltering(t, $(this).val());
                    }, 200);
                } else {
                    // just bind to onKeyUp
                    // bind doFiltering() to keyup
                    filter.bind('keyup', function () {
                        doFiltering(t, $(this).val());
                    });
                }

                // bind doFiltering() to additional events
                filter.bind('click search input paste blur', function () {
                    doFiltering(t, $(this).val());
                });

                // add the filter field to the container if it was created by the plugin
                if (created_filter) {
                    container.append(filter);
                }

                // are there any quick list items to add?
                if (settings.quickList.length > 0 || settings.quickListClear) {
                    quicks = settings.quickListGroupTag ? $('<' + settings.quickListGroupTag + ' />') : container;
                    // for each quick list item...
                    $.each(settings.quickList, function (index, value) {
                        // build the quick list item link
                        var q = $('<' + settings.quickListTag + ' class="' + settings.quickListClass + '" />');
                        // add the item's text
                        q.text(hsc(value));
                        if (q[0].nodeName === 'A') {
                            // add a (worthless) href to the item if it's an anchor tag so that it gets the browser's link treatment
                            q.attr('href', '#');
                        }
                        // bind the click event to it
                        q.bind('click', function (e) {
                            // stop the normal anchor tag behavior from happening
                            e.preventDefault();
                            // send the quick list value over to the filter field and trigger the event
                            filter.val(value).focus().trigger('click');
                        });
                        // add the quick list link to the quick list groups container
                        quicks.append(q);
                    });

                    // add the quick list clear item if a label has been specified
                    if (settings.quickListClear) {
                        // build the clear item
                        var q = $('<' + settings.quickListTag + ' class="' + settings.quickListClass + '" />');
                        // add the label text
                        q.html(settings.quickListClear);
                        if (q[0].nodeName === 'A') {
                            // add a (worthless) href to the item if it's an anchor tag so that it gets the browser's link treatment
                            q.attr('href', '#');
                        }
                        // bind the click event to it
                        q.bind('click', function (e) {
                            e.preventDefault();
                            // clear the quick list value and trigger the event
                            filter.val('').focus().trigger('click');
                        });
                        // add the clear item to the quick list groups container
                        quicks.append(q);
                    }

                    // add the quick list groups container to the DOM if it isn't already there
                    if (quicks !== container) {
                        container.append(quicks);
                    }
                }

                // add the filter field and quick list container to just before the table if it was created by the plugin
                if (created_filter) {
                    t.before(container);
                }
            }
        }); // return this.each
    }; // $.fn.filterTable
})(jQuery);
