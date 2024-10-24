"use client";

import IconButton from "@/app/_components/icon-button";

export default function VerifyTaskPage(props: any) {
  console.log(props);
  return (
    <>
      <header className="grid grid-cols-[3rem_1fr_3rem] px-4  justify-center items-center bg-secondary-100">
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="ArrowLeft"
            onClick={() => {
              // router.back();
            }}
          ></IconButton>
        </div>
        <span></span>
        <div>
          <IconButton
            className="ico-lg tap-zinc-100 text-primary-900"
            icon="Check"
          ></IconButton>
        </div>
      </header>
      <div className="bg-secondary-100"></div>
    </>
  );
}
