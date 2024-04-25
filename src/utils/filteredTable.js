export const filteredTable = (products, userFilter, query, filter) => {
  let resultProducts = [...products];

  if (query !== '') {
    resultProducts = resultProducts.filter(elem => {
      return elem.name.toLowerCase().includes(query.toLowerCase().trim());
    });
  }

  if (filter.length > 0 && !filter.includes('All')) {
    resultProducts = resultProducts.filter(elem => {
      return filter.includes(elem.category.title);
    });
  }

  if (userFilter !== 'All') {
    resultProducts = resultProducts.filter(user => {
      return user.user.name === userFilter;
    });
  }

  return resultProducts;
};
