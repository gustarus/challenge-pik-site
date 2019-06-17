import matchAll from 'string.prototype.matchall';

export class Uri {

  /**
   * Parse url with path template to receive path variables.
   * @param uri string
   * @param pathTemplate string - for example: /path/to/unit/:id will return {id: value}
   */
  parse(uri, pathTemplate = '') {
    const params = {};

    // match uri template
    const match = uri.match(/^(\w+:\/\/)?([^/]+)?\/([^?]+)(\?.*?)?$/);

    // parse path variables based on template
    if (match[3]) {
      // getting path string without double slashes
      const path = `/${match[3]}`.replace(/^\/{2,}/, '/');

      // parse path variables
      if (path && pathTemplate) {
        const names = [];

        // search for all names
        const variablesMatches = matchAll(pathTemplate, /:(\w+)/);
        for (const variableMatch of variablesMatches) {
          names.push(variableMatch[1]);
        }

        // search for all values
        const valuesMatches = matchAll(path, pathTemplate.replace(/:(\w+)/, '([^/]+)'));
        for (const valueMatch of valuesMatches) {
          const name = names.shift();
          params[name] = valueMatch[1];
        }
      }
    }

    // parse query variables
    if (match[4]) {
      // getting query string without question mark
      const query = match[4].replace(/^\?/, '');

      // parse query data
      const queryData = query.split('&');
      for (const queryPart of queryData) {
        const pair = queryPart.split('=');
        const key = pair[0];
        params[key] = pair[1];
      }
    }

    return params;
  }

  compile(template, params = {}, query = {}) {
    let result = template;
    for (const name in params) {
      if (params.hasOwnProperty(name)) {
        result = result.replace(`:${name}`, params[name]);
      }
    }

    // TODO Query string compilation.

    return result;
  }
}
