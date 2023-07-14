import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [currencyList, setCurrencyList] = useState([]);
  // const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    fetchCurrencyList();
  }, []);

  const fetchCurrencyList = async () => {
    try {
      const response = await axios.get(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      const data = response.data;
      const currencies = Object.keys(data.rates);
      const currencyData = currencies.map((currency) => ({
        currency,
        rate: data.rates[currency],
      }));
      setCurrencyList(currencyData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleConvert = async () => {
    if (amount && fromCurrency && toCurrency) {
      try {
        const response = await axios.post(
          "/api/v1/currency_converter/convert",
          {
            amount,
            from: fromCurrency,
            to: toCurrency,
          }
        );
        const data = response.data;
        setConvertedAmount(data.converted_amount);
        console.log("API Call successful");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSaveData = async () => {
    try {
      await axios.post("/api/v1/currency_converter/save_data");
      console.log("Data saved successfully");

      // Fetch the data from the database after saving
      const response = await fetch("/api/v1/currency_converter/fetch_data");
      const data = await response.json();
      // setFetchedData(data);
      console.log("Fetched data:", data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDownload = () => {
    if (currencyList.length === 0) {
      console.error("Currency list not available");
      return;
    }

    const sheetData = currencyList.map((currency) => ({
      Currency: currency.currency,
      Rate: currency.rate,
    }));

    const sheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Currency List");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAsExcelFile(excelBuffer, "currency_list.xlsx");
  };

  const saveAsExcelFile = (buffer, fileName) => {
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };

  return (
<>
      <div className="container mt-8 convertor">
        <div className="container-fluid h-custom">
          <div className=" d-flex justify-content-center align-items-center h-300">
            <div className="col-md-9 col-lg-6 col-xl-6">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample image"
              />
            </div>
            <h2 className="text-center text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-bank"
                viewBox="0 0 16 16"
              >
                <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.501.501 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89L8 0ZM3.777 3h8.447L8 1 3.777 3ZM2 6v7h1V6H2Zm2 0v7h2.5V6H4Zm3.5 0v7h1V6h-1Zm2 0v7H12V6H9.5ZM13 6v7h1V6h-1Zm2-1V4H1v1h14Zm-.39 9H1.39l-.25 1h13.72l-.25-1Z" />
              </svg>{" "}
              <br />
              Currency Converter
            </h2>
              </div>
            <br />
            <section className="row justify-content-center align-items-center">
            <div className="form-group col-md-8 col-lg-6 col-xl-4">
              <label htmlFor="amount" className="text-info">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                placeholder="Enter amount"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            
            <div className="form-group col-md-2 col-lg-2 col-xl-2">
              <label htmlFor="fromCurrency" className="text-info">
                From Currency
              </label>
              <select
                id="fromCurrency"
                className="form-control"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                <option value="">Currency</option>
                {currencyList.map((currency) => (
                  <option value={currency.currency} key={currency.currency}>
                    {currency.currency}
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-arrow-right-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
              </svg>
            </div>
            
            <div className="form-group col-md-2 col-lg-2 col-xl-2">
              <label htmlFor="toCurrency" className="text-info">
                To Currency
              </label>
              <select
                id="toCurrency"
                className="form-control"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                <option value="">Currency</option>
                {currencyList.map((currency) => (
                  <option value={currency.currency} key={currency.currency}>
                    {currency.currency}
                  </option>
                ))}
              </select>
            </div>
            </section>
          </div>
        <br />

        <div className="row buttons justify-content-center text-center text-lg-start mt-4 pt-2">
          <br />
          <button
            className="btn btn-primary mr-2 btn-lg"
            onClick={handleConvert}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-currency-exchange"
              viewBox="0 0 16 16"
            >
              <path d="M0 5a5.002 5.002 0 0 0 4.027 4.905 6.46 6.46 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05c0-.046 0-.093.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.46 3.46 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252h1.917v.427h-1.98c-.003.046-.003.097-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5zm16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0zm-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787H8.25zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.37.8-1.02.86v-1.674l.077.018z" />
            </svg>{" "}
            Convert
          </button>
          <button
            className="btn btn-primary mr-2 btn-lg"
            onClick={handleSaveData}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-cloud-download-fill"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.5a.5.5 0 0 1 1 0V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.354 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V11h-1v3.293l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"
              />
            </svg>{" "}
            Save Data
          </button>
          <button className="btn btn-primary btn-lg" onClick={handleDownload}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              className="bi bi-file-earmark-arrow-down-fill"
              viewBox="0 0 16 16"
            >
              <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0z" />
            </svg>{" "}
            Download
          </button>
        </div>
        <br />
        {convertedAmount && (
          <div className="text-center mt-3 text-danger">
            Converted Amount: {convertedAmount}
          </div>
        )}
        <br />
        </div>
    </>
  );
};

export default CurrencyConverter;