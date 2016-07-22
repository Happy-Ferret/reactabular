function highlighter({ columns, matches, query } = {}) {
  if (!columns) {
    throw new Error('highlighter - Missing columns!');
  }
  if (!matches) {
    throw new Error('highlighter - Missing matches!');
  }
  if (!query) {
    throw new Error('highlighter - Missing query!');
  }

  return rows => rows.map(row => {
    const ret = {
      _highlights: {}
    };

    columns.forEach(column => {
      const property = column.cell.property;
      const value = row[property];
      // Pick resolved value by convention
      const resolvedValue = row[`_${property}`] || value;

      ret[property] = value;

      // Retain possibly resolved value
      if (resolvedValue !== value) {
        ret[`_${property}`] = resolvedValue;
      }

      // Stash highlighted value based on index
      // so it can be extracted later for highlighting
      ret._highlights[property] = matches({
        value: resolvedValue,
        query: query[property] || query.all
      });
    });

    return ret;
  });
}

export default highlighter;
