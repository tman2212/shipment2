import React, { useState } from "react";
import "./style.css";

const defaultRow = {
  loadref: "",
  vessel: "",
  line: "",
  number: "",
  pol: "",
  pod: "",
  commodity: "",
  temp: "",
  loaddate: "",
  loadingpoint: "",
  emailed: false,
};

const columns = [
  "loadref",
  "vessel",
  "line",
  "number",
  "pol",
  "pod",
  "commodity",
  "temp",
  "loaddate",
  "loadingpoint",
];

export default function App() {
  const [rows, setRows] = useState([
    {
      loadref: "LR001",
      vessel: "Evergreen",
      line: "Maersk",
      number: "123",
      pol: "Shanghai",
      pod: "Los Angeles",
      commodity: "Electronics",
      temp: "Ambient",
      loaddate: "2025-07-01",
      loadingpoint: "Terminal A",
      emailed: false,
    },
    {
      loadref: "LR002",
      vessel: "Hapag-Lloyd",
      line: "MSC",
      number: "124",
      pol: "Busan",
      pod: "Long Beach",
      commodity: "Furniture",
      temp: "Chilled",
      loaddate: "2025-07-02",
      loadingpoint: "Terminal B",
      emailed: false,
    },
  ]);

  const [filters, setFilters] = useState({});

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { ...defaultRow }]);
  };

  const handleFilterChange = (e, column) => {
    setFilters({ ...filters, [column]: e.target.value });
  };

  const filteredRows = rows.filter((row) =>
    columns.every(
      (col) =>
        !filters[col] ||
        row[col]?.toLowerCase().includes(filters[col].toLowerCase())
    )
  );

  const handleGenerateEmail = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].emailed = true;
    setRows(updatedRows);

    const row = updatedRows[index];
    const message = `Shipment Details:\n\n${columns
      .map((col) => `${col.toUpperCase()}: ${row[col]}`)
      .join("\n")}`;

    alert(`Generated email:\n\n${message}`);
  };

  return (
    <div className="app">
      <h2 className="title">Shipment Dashboard</h2>
      <button onClick={handleAddRow} className="add-button">
        Add New Line
      </button>

      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                <div className="header-inline">
                  <span>{col.toUpperCase()}</span>
                  <select
                    value={filters[col] || ""}
                    onChange={(e) => handleFilterChange(e, col)}
                  >
                    <option value="">All</option>
                    {[...new Set(rows.map((row) => row[col]))]
                      .filter((value) => value !== "")
                      .map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                  </select>
                </div>
              </th>
            ))}
            <th>EMAIL</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, index) => (
            <tr key={index} className={row.emailed ? "row-sent" : ""}>
              {columns.map((col) => (
                <td key={col}>
                  {["pol", "pod", "commodity", "temp", "loadingpoint"].includes(
                    col
                  ) ? (
                    <select
                      value={row[col]}
                      onChange={(e) => handleChange(index, col, e.target.value)}
                    >
                      <option value="">Select</option>
                      {[...new Set(rows.map((r) => r[col]))]
                        .filter((v) => v !== "")
                        .map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type={col === "loaddate" ? "date" : "text"}
                      value={row[col]}
                      onChange={(e) => handleChange(index, col, e.target.value)}
                    />
                  )}
                </td>
              ))}
              <td>
                <button onClick={() => handleGenerateEmail(index)}>
                  Generate Email
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
