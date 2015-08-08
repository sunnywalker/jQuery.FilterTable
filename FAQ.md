# jQuery.filterTable Frequently Asked Questions

## How do I keep the header and/or footer rows from disappearing on filter?

Ensure your header row(s) are in `<thead></thead>` tags, your data row(s) are in `<tbody></tbody>` tags, and your footer row(s) are in `<tfoot></tfoot>` tags. The plugin only filters `tbody` rows, but if you do not specify `thead`, `tbody`, `tfoot`, the brower puts all of your rows in a `tbody` block.

## Why isn't the filtering showing up on small tables?

The plugin will not show for tables with fewer than `8` rows by default. To have the filter feature always appear, set the `minRows` option accordingly. For example:

    $('table').filterTable({minRows: 0});

Or see the [minRows example page](http://sunnywalker.github.io/jQuery.FilterTable/examples/filtertable-min-rows.html).

