import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import React from 'react';

function Paginator({ totalPages, setCurrentPage, page }) {
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={
        <span className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md cursor-pointer">
          <BsChevronRight />
        </span>
      }
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      pageCount={totalPages}
      forcePage={page}
      previousLabel={
        <span className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md cursor-pointer">
          <BsChevronLeft />
        </span>
      }
      containerClassName="flex items-center justify-center rounded-md"
      pageClassName="mx-1 hover:bg-gray-300 w-10 h-10 flex items-center justify-center rounded-md "
      pageLinkClassName="block mx-1 hover:bg-gray-300 w-10 h-10 flex items-center justify-center rounded-md cursor-pointer"
      renderOnZeroPageCount={null}
      activeClassName="bg-blue-500 text-white"
    />
  );
}
Paginator.propTypes = {
  totalPages: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default Paginator;
