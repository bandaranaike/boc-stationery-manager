"use client"
import { useState } from "react";
import StockManagement from "../pages/StockManagement";
import InvoiceManagement from "../pages/InvoiceManagement";
import BranchManagement from "../pages/BranchManagement";
import Settings from "../pages/Settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState("StockManagement");

  const renderComponent = () => {
    switch (activeTab) {
      case "StockManagement":
        return <StockManagement />;
      case "InvoiceManagement":
        return <InvoiceManagement />;
      case "BranchManagement":
        return <BranchManagement />;
      // case "Settings":
      //   return <Settings />;
      default:
        return null;
    }
  };

  return (
      <main className="flex flex-col justify-between">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li className="me-2">
              <button
                  onClick={() => setActiveTab("StockManagement")}
                  className={`inline-flex items-center justify-center p-4 border-b-2 ${
                      activeTab === "StockManagement"
                          ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  } rounded-t-lg`}
              >
                Stock Management
              </button>
            </li>
            <li className="me-2">
              <button
                  onClick={() => setActiveTab("InvoiceManagement")}
                  className={`inline-flex items-center justify-center p-4 border-b-2 ${
                      activeTab === "InvoiceManagement"
                          ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  } rounded-t-lg`}
              >
                Invoice Management
              </button>
            </li>
            <li className="me-2">
              <button
                  onClick={() => setActiveTab("BranchManagement")}
                  className={`inline-flex items-center justify-center p-4 border-b-2 ${
                      activeTab === "BranchManagement"
                          ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                          : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  } rounded-t-lg`}
              >
                Branch Management
              </button>
            </li>
            {/*<li className="me-2">*/}
            {/*  <button*/}
            {/*      onClick={() => setActiveTab("Settings")}*/}
            {/*      className={`inline-flex items-center justify-center p-4 border-b-2 ${*/}
            {/*          activeTab === "Settings"*/}
            {/*              ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"*/}
            {/*              : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"*/}
            {/*      } rounded-t-lg`}*/}
            {/*  >*/}
            {/*    Settings*/}
            {/*  </button>*/}
            {/*</li>*/}
          </ul>
        </div>
        <div className="p-6">{renderComponent()}</div>
      </main>
  );
}
