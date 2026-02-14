import React, { useState } from "react";

function PaginationBox() {
  const [pageNo, setPageNo] = useState(1);
  const [noOfItems, setNoOfItems] = useState(10)
  const maxPage = 8;

  function goToNextPage() {
    pageNo < maxPage && setPageNo((val) => val + 1);
  }

  function goToPrevPage() {
    pageNo > 1 && setPageNo((val) => val - 1);
  }

  return (
    <>
      <div className="flex-1 flex gap-1.5">
        <section className="flex-1/2 h-10  w-20 flex items-center justify-evenly gap-2 bg-amber-500 rounded">
          <img
            src="https://cdn-icons-png.flaticon.com/128/271/271220.png"
            alt="prev-button"
            className="h-4 w-4"
            style={{
              display: pageNo > 1 ? "" : "none",
              cursor: "pointer",
            }}
            onClick={goToPrevPage}
          />
          <p className="font-bold text-white text-xl">{pageNo}</p>
          <img
            src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
            alt="next-button"
            className="h-4 w-4"
            style={{
              display: pageNo < maxPage ? "" : "none",
              cursor: "pointer",
            }}
            onClick={goToNextPage}
          />
        </section>
        <section className="flex-1/2 h-10  w-15 flex items-center justify-evenly gap-2 bg-amber-500 rounded">
          <p className="font-bold text-white text-xl" >{noOfItems}</p>
          <div className="">
            <img
              src="https://cdn-icons-png.flaticon.com/128/271/271239.png"
              alt="up-button"
              className="h-4 w-4"
              style={{
                display: noOfItems < 50 ? "" : "none",
                cursor: "pointer",
              }}
              onClick={() => setNoOfItems(val => val+10)}
            />

            <img
              src="https://cdn-icons-png.flaticon.com/128/32/32195.png"
              alt="down-button"
              className="h-4 w-4"
              style={{
                display: noOfItems > 10 ? "" : "none",
                cursor: "pointer",
              }}
              onClick={() => setNoOfItems(val => val-10)}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default PaginationBox;
