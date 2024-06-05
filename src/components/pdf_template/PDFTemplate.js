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
        <PageTop>
          <div className="flex items-center justify-between max-h-[100px] mt-10">
            <div className="flex flex-col items-center gap-5">
              <h6 className="text-[10px]">Civil Service Form No. 6 Revised 2020 </h6>
              <img className="w-10 h-10 block" src="https://cvsu-rosario.edu.ph/wp-content/uploads/2019/11/logo.png" alt="logo" />
            </div>
            <div className="flex items-center justify-center flex-1 h-full">
              <h1 className="text-lg font-bold text-center">Application For Leave</h1>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="capitalize">
                Annex A
              </h3>
              <p className="text-[10px]">{formatDate(date)}</p>
            </div>
          </div>
        </PageTop>
      </Tailwind>
    </>
  );
};
