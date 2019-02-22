/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pagination from 'filterable-react-pagination-status';
import Titles from './Components/Titles';
import Header from './Components/Header';
import Body from './Components/Body';

import type { TablePaginationProps, TablePaginationDefaultProps, TablePaginationState } from './types';

export default class TablePagination extends Component
<TablePaginationDefaultProps, TablePaginationProps, *> {

  state: TablePaginationState;

  defaultProps: TablePaginationDefaultProps;

  handleChangePage: (status: number) => void

  static propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.string.isRequired,
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    arrayOption: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.string),
    ),
    nextPageText: PropTypes.string,
    prePageText: PropTypes.string,
    paginationClassName: PropTypes.string,
    className: PropTypes.string,
    perPageItemCount: PropTypes.number.isRequired,
    partialPageCount: PropTypes.number,
    totalCount: PropTypes.number.isRequired,
  };

  static defaultProps = {
    title: '',
    subTitle: '',
    arrayOption: [''],
    perPageItemCount: 0,
    partialPageCount: 5,
    totalCount: 0,
    className: 'react-pagination-table',
    nextPageText: 'Next',
    prePageText: 'Prev',
    paginationClassName: 'pagination-status',
  };

  constructor(props: TablePaginationProps) {
    super(props);
    this.state = {
      activePage: 0,
      pageCount: Math.ceil(props.totalCount / props.perPageItemCount),
    };
    this.handleChangePage = this.handleChangePage.bind(this);
  }

  componentWillReceiveProps(props: TablePaginationProps) {
    this.setState({
      activePage: 0,
      pageCount: Math.ceil(props.totalCount / props.perPageItemCount),
    }) 
  }

  handleChangePage(status: number): void {
    this.setState({
      activePage: status,
    });
  }

  renderPartialTable(defaultTable: Array<React$Element<*>>) {
    const { perPageItemCount } = this.props;
    const { activePage, pageCount } = this.state;
    let start;
    if (pageCount > activePage) {
      start = perPageItemCount * activePage;
    } else {
      start = perPageItemCount * 0;
    }
    return defaultTable.slice(start, start + perPageItemCount);
  }

  renderTable(isPaginationTable: boolean): Array<React$Element<*>> {
    const { arrayOption = [], columns, data } = this.props;
    const defaultTable = Body({ arrayOption, columns, data });
    return isPaginationTable
      ? this.renderPartialTable(defaultTable)
      : defaultTable;
  }

  render() {
    const { headers,
            perPageItemCount,
            partialPageCount,
            totalCount,
            className,
            paginationClassName,
            title,
            subTitle,
            nextPageText,
            prePageText } = this.props;
    const { pageCount } = this.state;
    const isPaginationTable: boolean = pageCount > 1;
    const Table: Array<React$Element<*>> = this.renderTable(isPaginationTable);

    return (
      <div className={ className }>
        { Titles({ title, subTitle, className }) }
        <table className={ `${className}__table` }>
          <Header className={ className } headers={ headers } />
          <tbody>
            { Table }
          </tbody>
        </table>
        <div className="clearfix">
          {
            isPaginationTable &&
              <Pagination
                handleChangePage={ this.handleChangePage }
                activePage={ this.state.activePage }
                totalCount={ totalCount }
                partialPageCount={ partialPageCount }
                perPageItemCount={ perPageItemCount }
                className={ paginationClassName }
                nextPageText={ nextPageText }
                prePageText={ prePageText }
              />
           }
        </div>
      </div>
    );
  }
}
