/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

import { filteredTable } from './utils/filteredTable';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    myCategory => myCategory.id === product.categoryId,
  );
  const user = usersFromServer.find(myUser => myUser.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

const tableHeader = ['ID', 'Product', 'Category', 'User'];

export const App = () => {
  const [userFilter, setUserFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState([]);
  const result = filteredTable(products, userFilter, query, filter);

  const onFiltersReset = () => {
    setUserFilter('All');
    setQuery('');
    setFilter([]);
  };

  const onFilter = categ => {
    if (filter.includes(categ)) {
      setFilter(filter.filter(category => category !== categ));
    } else {
      setFilter([...filter, categ]);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                className={userFilter === 'All' ? 'is-active' : null}
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setUserFilter('All')}
              >
                All
              </a>
              {usersFromServer.map(user => {
                return (
                  <a
                    onClick={() => setUserFilter(user.name)}
                    data-cy="FilterUser"
                    href="#/"
                    className={userFilter === user.name ? 'is-active' : null}
                    key={user.id}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  onChange={e => setQuery(e.target.value)}
                  value={query}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setQuery('')}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={
                  filter.length === 0
                    ? 'button is-success mr-6'
                    : 'button is-success mr-6 is-outlined'
                }
                onClick={() => setFilter([])}
              >
                All
              </a>
              {categoriesFromServer.map(category => {
                return (
                  <a
                    onClick={() => onFilter(category.title)}
                    key={category.id}
                    data-cy="Category"
                    className={
                      filter.includes(category.title)
                        ? 'button mr-2 my-1 is-info'
                        : 'button mr-2 my-1'
                    }
                    href="#/"
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                onClick={() => onFiltersReset()}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {result.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {tableHeader.map(thead => {
                    return (
                      <th key={thead}>
                        <span className="is-flex is-flex-wrap-nowrap">
                          {thead}
                          <a href="#/">
                            <span className="icon">
                              <i data-cy="SortIcon" className="fas fa-sort" />
                            </span>
                          </a>
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {result.map(product => {
                  return (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title} `}</td>

                      <td
                        data-cy="ProductUser"
                        className={
                          product.user.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger'
                        }
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
