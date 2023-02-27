import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { Table } from "react-bootstrap";
import { GlobalStateContext } from "../../contexts";

const CommonTableUI = ({
  getTableProps,
  headerGroups,
  rows,
  prepareRow,
  className,
}) => {
  const { isDarkTheme } = useContext(GlobalStateContext);
  return (
    <Table
      variant={isDarkTheme ? "dark" : ""}
      responsive
      hover
      className={className}
      {...getTableProps()}
    >
      <thead>
        {
          // Loop over the header rows
          headerGroups.map((headerGroup, key) => (
            // Apply the header row props
            <tr {...headerGroup.getHeaderGroupProps()} key={key}>
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column, key) => (
                  // Apply the header cell props
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={key}
                  >
                    <div className="d-flex align-items-center">
                      {
                        // Render the header
                        column.render("Header")
                      }
                      {!column.disableSortBy && (
                        <FontAwesomeIcon
                          className="sort-icon icon-sm ms-2"
                          icon={
                            column.isSorted
                              ? column.isSortedDesc
                                ? faSortDown
                                : faSortUp
                              : faSort
                          }
                        />
                      )}
                    </div>
                    {/* <span className="ms-2">{column.isSorted ? (column.isSortedDesc ? "↓" : "↑") : "⇅"}</span> */}
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>
      <tbody className="border-top-0 mt-2">
        {
          // Loop over the table rows
          rows.map((row, key) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()} key={key}>
                {
                  // Loop over the rows cells
                  row.cells.map((cell, key) => {
                    // Apply the cell props
                    return (
                      <td
                        key={key}
                        {...cell.getCellProps()}
                        className="align-middle"
                      >
                        {
                          // Render the cell contents
                          cell.render("Cell")
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </Table>
  );
};

export default CommonTableUI;
