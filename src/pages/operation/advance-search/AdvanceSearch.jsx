import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import AppLayout from "../../../layouts/AppLayout";
import { useGetAdvanceSearchMutation } from "../../../store/api/endpoints/advanceSearchApi";

function AdvanceSearch() {
  const { t } = useTranslation();
  const translateText = (text, options = {}) =>
    t(`appText.${text}`, { defaultValue: text, ...options });

  const [searchParams] = useSearchParams();
  const userDetails = useSelector((state) => state.auth.userDetails);

  const initialPortfolioName = searchParams.get("portfolioName") || "";
  const initialByDisposition = searchParams.get("byDisposition") || "";
  const initialSearchData = searchParams.get("searchData") || "";

  const [searchPayload, setSearchPayload] = useState({
    userName: "RAK1",
    role: "admin",
    process: initialPortfolioName,
    byDisposition: initialByDisposition,
    byAgentName: "",
    byTypeOf: "",
    searchFlag: "",
    searchData: initialSearchData,
    start: 0,
    length: 10,
  });

  const [getAdvanceSearch, { data, isLoading, error }] = useGetAdvanceSearchMutation();

  // Run on initial load or pagination changes
  useEffect(() => {
    getAdvanceSearch(searchPayload);
  }, [searchPayload.start, searchPayload.length, searchParams, getAdvanceSearch]);

  const handlePageChange = (newStart) => {
    setSearchPayload((prev) => ({ ...prev, start: newStart }));
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchPayload((prev) => ({ ...prev, [name]: value, start: 0 }));
  };

  const totalCount = data?.totalCount || 0;
  const tableData = data?.data || [];
  const currentPage = Math.floor(searchPayload.start / searchPayload.length) + 1;
  const totalPages = Math.ceil(totalCount / searchPayload.length);

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.data?.message || error?.error || "";

  return (
    <AppLayout>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {translateText("Operation")}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          {translateText("Advance Search")}
        </h1>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4 items-end">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            {translateText("Search Data")}
            <input
              type="text"
              name="searchData"
              value={searchPayload.searchData}
              onChange={handleSearchChange}
              className="rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
              placeholder={translateText("Search...")}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            {translateText("Portfolio / Process")}
            <input
              type="text"
              name="process"
              value={searchPayload.process}
              onChange={handleSearchChange}
              className="rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
              placeholder={translateText("Process")}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            {translateText("By Disposition")}
            <input
              type="text"
              name="byDisposition"
              value={searchPayload.byDisposition}
              onChange={handleSearchChange}
              className="rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:outline-none"
              placeholder={translateText("Disposition")}
            />
          </label>
          <button
            onClick={() => getAdvanceSearch(searchPayload)}
            disabled={isLoading}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            <Search size={18} />
            {translateText("Search")}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-[#007f8b] text-xs uppercase text-white">
              <tr>
                <th className="px-6 py-4">{translateText("Account No")}</th>
                <th className="px-6 py-4">{translateText("CID/CIF")}</th>
                <th className="px-6 py-4">{translateText("Cust Name")}</th>
                <th className="px-6 py-4">{translateText("Product")}</th>
                <th className="px-6 py-4">{translateText("Outstanding")}</th>
                <th className="px-6 py-4">{translateText("Principle")}</th>
                <th className="px-6 py-4">{translateText("Credit Limit")}</th>
                <th className="px-6 py-4">{translateText("Allocation")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    {translateText("Loading data...")}
                  </td>
                </tr>
              ) : tableData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    {translateText("No results found")}
                  </td>
                </tr>
              ) : (
                tableData.map((row) => (
                  <tr key={row.mycode} className="hover:bg-slate-50">
                    <td
                      className="px-6 py-4 font-medium text-blue-600 hover:text-blue-800"
                      dangerouslySetInnerHTML={{ __html: row.accounT_NUMBER }}
                    />
                    <td className="px-6 py-4">{row.ciD_CIF}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{row.customeR_NAME}</td>
                    <td className="px-6 py-4">{row.product}</td>
                    <td className="px-6 py-4">{row.totaL_OUTSTANDING}</td>
                    <td className="px-6 py-4">{row.principle}</td>
                    <td className="px-6 py-4">{row.creditLimit}</td>
                    <td className="px-6 py-4">{row.allocatioN_NAME || ""}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalCount > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <span className="text-sm text-slate-500">
              {translateText("Showing")} {searchPayload.start + 1} {translateText("to")}{" "}
              {Math.min(searchPayload.start + searchPayload.length, totalCount)} {translateText("of")} {totalCount} {translateText("entries")}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(0, searchPayload.start - searchPayload.length))}
                disabled={searchPayload.start === 0 || isLoading}
                className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium text-slate-700">
                {translateText("Page")} {currentPage} {translateText("of")} {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(searchPayload.start + searchPayload.length)}
                disabled={searchPayload.start + searchPayload.length >= totalCount || isLoading}
                className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default AdvanceSearch;

