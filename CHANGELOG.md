# jQuery.filterTable Change Log

## 1.5.7
- Support for `quickListClear` option that appends a quick list link which clears the filter.

## 1.5.6
- Fixed filtering to work for special characters `'`, `"`, and `\`.
- Minor documentation updates.

## 1.5.5

- The filtering should now trigger automatically on input on iOS. For some reason, Safari iOS triggers a `blur` event on field change but not `keyup` or other related events.
- A new feature for extending the plugin (option `filterExpression`) has been added. The default is unchanged—the literal filter string.
    - To search for _any_ of multiple terms, set `filterExpression` to `filterTableFindAny` to perform an OR search which delimits on space or comma characters in the filter field. Thank you to [Lukas](https://github.com/superlukas) for the implementation. An example page is included.
    - To search for _all_ of multiple terms, set `filterExpression` to `filterTableFindAll` to perform an AND search which delimits on space or comma characters in the filter field. Note that the matching is per-cell not per row, so each cell must have all terms to match. An example page is included.
- A new feature for ignoring columns is available via the `ignoreColumns` option. Provide an array of column numbers (0-indexed) to ignore those columns during filtering. The default is no columns are ignored. An example page is included.
- A new feature for ignoring cells with a specific class is available via the `ignoreClass` option. Provide a class name to ignore those cells during filtering. The default is no classes are ignored. An exampled page is included. Thanks to [geda0](https://github.com/geda0) for the idea.
- Added a `minChars` option, thanks to [Darius Kazemi](https://github.com/dariusk), which specifies the minimum number of characters a user must enter into the filter field before filtering occurs. Default is 1, meaning the moment the user begins to type, filtering will occur.
- Merged [Pierre Rudloff](https://github.com/Rudloff)’s Bower support.
- Merged [Jason](https://github.com/deadbeef404)’s `minRows` bug fix.
- Added an FAQ file.

## 1.5.4

- Added a return key trap to the input filter field so that pressing return in the field should not submit any forms the table may be within.
- The `preventReturnKey` option (`true` by default) has been added to allow you to switch back to the previous behavior of allowing the return key to submit forms.

## 1.5.3

- **There is a potentially significant change in functionality in this version.** While the documentation offered the `inputSelector` option, within the code it was implemented as `filterSelector`. This has been corrected to match the documentation. Note that if you were previously using the `filterSelector` option to overcome this issue, you will need to change it to `inputSelector` to use the feature with this version.

## 1.5.2

- Added an `inputSelector` option, thanks to [Pratik Thakkar](https://github.com/pratikt), which specifies a selector for an existing element to use instead of creating a new filter input field. There are some caveats of which to be aware:
    - If the element doesn't exist, a filter input field will be created as normal.
    - Because of quick lists and other options, this setting will be ignored and the filter input field will be created as normal if the resolution of the `inputSelector` returns more than one element.

## 1.5.1

- Added an `autofocus` option, thanks to [Robert McLeod](https://github.com/penguinpowernz), which is disabled by default. Note that autofocus is generally a bad idea for accessibility reasons, but if you do not need to be compliant or don't want to support accessibility users, it's a nice user experience option.

## 1.5

- **There is a potentially significant change in functionality in this version.** The callback is now called every time the search query changes. Previously it was only called when the change was a non-empty query. That is, the callback is now called when the query is cleared too.
- Additional features have been taken from [Tomas Celizna](https://github.com/tomasc)'s CoffeeScript-based fork:
    - The quick list items can now be something other than anchor tags. See the `quickListTag` and `quickListGroupTag` options.
    - The filter query field can now have a name attribute assigned to it. See the `inputName` option.
    - The class applied to visible rows is now user changeable. See the `visibleClass` option.
    - The options in the documentation have been ordered alphabetically for easier scanning.
- The internal pseudo selector is now created appropriately according to the jQuery version. (Pseudo selector generation changed in jQuery 1.8)

## 1.4

- Fixed a bug with filtering rarely showing rows that did not have a match with the search query.
- Added example pages.
- Improved inline documentation of the source code.

## 1.3.1 (in spirit)

- Added minified version of the plugin (thanks [Luke Stevenson](https://github.com/lucanos)).

## 1.3

- The functionality is not reapplied to tables that have already been processed. This allows you to call `$(selector).filterTable()` again for dynamically created data without it affecting previously filtered tables.

## 1.2

- Changed the default container class to `filter-table` from `table-filter` to be consistent with the plugin name.
- Made the cell highlighting class an option rather than hard-coded.

## 1.1

- Initial public release.
