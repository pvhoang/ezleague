import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @param {string} key
   *
   * @returns {any}
   */
  transform(
    items: any[],
    searchText: string,
    key?: string,
    equals?: boolean,
    message?: string
  ): any[] {
    message = message || 'No results found';
    if (!items) return [];
    if (!searchText) return items;
    switch (typeof searchText) {
      case 'number':
        searchText = (searchText as any).toString();
        break;
      case 'string':
        searchText = searchText.toLowerCase();
        break;
      default:
        searchText = (searchText as any).toString().toLowerCase();
    }
    let res = items.filter((it) => {
      let value;
      if (key) {
        value = it[key];
      } else {
        // filter by all properties of the object
        if (equals) {
          // value is it object, foreach property, check if it is equal to the search text
          for (const prop in it) {
            value = it[prop];
            switch (typeof value) {
              case 'number':
                value = (value as any).toString();
                break;
              case 'string':
                value = value.toLowerCase();
                break;
              default:
                break;
            }
            if (value === searchText.toLowerCase()) {
              return true;
            }
          }
        } else {
          return JSON.stringify(it).toLowerCase().includes(searchText);
        }
      }

      switch (typeof value) {
        case 'number':
          value = (value as any).toString();
          break;
        case 'string':
          value = value.toLowerCase();
          break;
        default:
          break;
      }
      // if equals is true, then we need to check if the value is equal to the search text
      if (equals) {
        return value === searchText.toLowerCase();
      } else {
        return value.includes(searchText);
      }
    });
    // return message if no results found
    // if (res.length === 0) {
    //   res = [{ message: message }];
    // }
    return res;
  }
}
