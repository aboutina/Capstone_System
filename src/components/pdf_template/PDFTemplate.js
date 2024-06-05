import * as React from "react";
import { CSS, Tailwind } from "@fileforge/react-print";
import { PageBottom, PageTop } from "@onedoc/react-print";

export const PDFTemplate = ({ name }) => {
  const date = new Date()

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  return (
    <>
      <Tailwind>
          <div className="flex items-center mt-5 justify-evenly">
            <div className="flex flex-col items-center gap-5">
              <h6 className="text-[10px]">Civil Service Form No. 6 Revised 2020 </h6>
              <img className="w-10 h-10 mt-5" src="https://cvsu-rosario.edu.ph/wp-content/uploads/2019/11/logo.png" alt="logo" />
            </div>
            <div className="flex flex-col items-center justify-center flex-1 h-full">
              <h6 className="text-[10px]">(Agency name)</h6>
              <h6 className="text-[10px]">(Agency address)</h6>
              <h1 className="mt-5 text-lg font-bold text-center">Application For Leave</h1>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="capitalize">
                Annex A
              </h3>
              <p className="text-[10px]">{formatDate(date)}</p>
            </div>
          </div>  
      </Tailwind>
    </>
  );
};
