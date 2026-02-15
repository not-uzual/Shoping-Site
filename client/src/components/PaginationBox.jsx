import React from "react";

function PaginationBox({page, setPage, limit, setLimit, allowedPage}) {

  function goToNextPage() {
    page < allowedPage && setPage((val) => val + 1);
  }

  function goToPrevPage() {
    page > 1 && setPage((val) => val - 1);
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
              display: page > 1 ? "" : "none",
              cursor: "pointer",
            }}
            onClick={goToPrevPage}
          />
          <p className="font-bold text-white text-xl">{page}</p>
          <img
            src="https://cdn-icons-png.flaticon.com/128/271/271228.png"
            alt="next-button"
            className="h-4 w-4"
            style={{
              display: page < allowedPage ? "" : "none",
              cursor: "pointer",
            }}
            onClick={goToNextPage}
          />
        </section>
        <section className="flex-1/2 h-10  w-15 flex items-center justify-evenly gap-2 bg-amber-500 rounded">
          <p className="font-bold text-white text-xl" >{limit}</p>
          <div className="">
            <img
              src="https://cdn-icons-png.flaticon.com/128/271/271239.png"
              alt="up-button"
              className="h-4 w-4"
              style={{
                display: limit < 30 ? "" : "none",
                cursor: "pointer",
              }}
              onClick={() => setLimit(val => val+5)}
            />

            <img
              src="https://cdn-icons-png.flaticon.com/128/32/32195.png"
              alt="down-button"
              className="h-4 w-4"
              style={{
                display: limit > 10 ? "" : "none",
                cursor: "pointer",
              }}
              onClick={() => setLimit(val => val-5)}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default PaginationBox;
