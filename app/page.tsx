"use client";
import Image from "next/image";
// import Styles from "./landing.module.css";
import Button from "@/app/_components/button";
import { useEffect, useRef, useState } from "react";
import {
  useScroll,
  motion,
  useMotionValueEvent,
  MotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

import Link from "next/link";
import { debounce } from "./_store/util";

export default function DesktopPage() {
  const iref = useRef<HTMLIFrameElement>(null);
  const pref = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);

  // const { scrollYProgress } = useScroll({
  //   target: thirdSection,
  //   offset: ["start start", "end end"],
  // });

  useEffect(() => {
    const iframe = iref.current;
    const doc = iframe?.contentDocument;
    const pointer = pref.current;

    if (doc && pointer) Tuturial(doc, pointer);
  }, [iref.current, pref.current]);

  return (
    <>
      <div className="top-0 z-10 grid h-svh w-fit md:fixed md:right-16 lg:right-[max(2rem,calc((100%-1024px)/2))] xl:right-[max(4rem,calc((100%-1280px)/2))] 2xl:right-[max(6rem,calc((100%-1536px)/2))]">
        <div className="container relative h-fit max-w-md self-center md:max-w-[calc(768px/2)] lg:max-w-[calc(1024px/3)] xl:max-w-[calc(1280px/3)] 2xl:max-w-[calc(1536px/3)]">
          <div
            ref={pref}
            id="pointer"
            className="absolute inset-1/2 z-10 size-10 rounded-full border-4 border-white border-opacity-50 bg-zinc-900 bg-opacity-50"
          ></div>
          <div
            ref={phone}
            className="col-start-3 mx-auto aspect-[9/19.5] h-full max-h-fit max-w-fit"
          >
            <div className="moving-shadow relative h-full w-full rounded-[3rem] border-4 border-primary-700">
              <div className="moving-screen-light relative h-full w-full overflow-hidden rounded-[2.7rem] border-[.75rem] border-zinc-900 bg-zinc-800">
                <div className="absolute left-1/2 top-2 z-10 aspect-[10/2.5] w-1/4 -translate-x-1/2 rounded-full bg-zinc-900 p-1 drop-shadow-md">
                  <div className="ml-auto size-3 rounded-full bg-zinc-950"></div>
                </div>
                <iframe
                  ref={iref}
                  src="/pwa/"
                  loading="lazy"
                  className="h-full w-full opacity-90"
                  onLoad={(e) => {
                    const style = document.createElement("style");
                    style.innerText =
                      "::-webkit-scrollbar{width:0px;height:0px;}";
                    const htmlDoc = e.target as HTMLIFrameElement;
                    htmlDoc.contentDocument?.head.appendChild(style);
                  }}
                ></iframe>
              </div>
              <div className="absolute -left-2 top-[15%] flex h-full flex-col gap-4">
                <div className="h-[5%] w-1 rounded-l-sm bg-primary-600"></div>
                <div className="h-[10%] w-1 rounded-l-sm bg-primary-600"></div>
                <div className="h-[10%] w-1 rounded-l-sm bg-primary-600"></div>
              </div>
              <div className="absolute -right-2 top-1/4 h-[13.5%] w-1 rounded-r-sm bg-primary-600"></div>
            </div>
          </div>
        </div>
      </div>
      <section className="roundedCorner relative h-svh w-full bg-primary-800 bg-[image:linear-gradient(210deg,rgb(0_0_0/.3),20%,transparent)]">
        <div className="container grid h-full max-w-screen-2xl items-center md:grid-cols-2 lg:grid-cols-3">
          <div className="mx-auto flex w-fit items-center gap-8 md:col-span-1 lg:col-span-2">
            <div className="whitespace-nowrap">
              <div className="text-base text-secondary-200 lg:text-2xl xl:text-[2.5rem] xl:leading-[3.25rem]">
                with{" "}
                <span className="relative after:absolute after:left-0 after:block after:h-0.5 after:w-full after:bg-current xl:after:h-1">
                  Ugly2Don’t
                </span>
              </div>
              <h2 className="text-lg leading-relaxed text-white lg:text-3xl xl:text-[3.5rem] xl:leading-[4.5rem]">
                Get your{" "}
                <span className="relative text-2xl after:absolute after:left-0 after:block after:h-0.5 after:w-full after:bg-current lg:text-5xl lg:after:h-1 xl:text-[4.5rem] xl:leading-[5.5rem] xl:after:h-1.5">
                  ugly tasks{" "}
                </span>
                done
                <p className="text-error-200">
                  Even if you do it{" "}
                  <span className="relative text-2xl after:absolute after:left-0 after:block after:h-0.5 after:w-full after:bg-current lg:text-5xl lg:after:h-1 xl:text-[4.5rem] xl:leading-[5.5rem] xl:after:h-1.5">
                    the ugly way!
                  </span>
                </p>
                <Button className="tap-primary-600 btn-md ml-auto mt-4 w-fit bg-primary-500 font-medium lg:btn-lg lg:w-fit lg:text-3xl xl:h-fit xl:rounded-full xl:px-6 xl:text-[2.5rem] xl:leading-[4rem]">
                  Try it now!
                </Button>
              </h2>
            </div>
          </div>
        </div>
      </section>
      <section className="roundedCorner flex w-full flex-col items-center justify-around bg-zinc-200 py-16 after:shadow-sm">
        <div className="container grid h-full max-w-screen-2xl items-center md:grid-cols-2 lg:grid-cols-3">
          <div className="mx-auto grid max-w-screen-sm items-center gap-8 px-8 max-md:grid-rows-2 lg:col-span-2 lg:grid-cols-2 lg:px-0">
            <div className="whitespace-nowrap text-xl font-medium">
              <h3 className="relative w-fit after:absolute after:left-0 after:block after:h-1 after:w-full after:bg-secondary-300 max-sm:mx-auto">
                Manage & categorize
              </h3>
              <br />
              <h3 className="relative w-fit after:absolute after:left-0 after:block after:h-1 after:w-full after:bg-secondary-300 max-sm:mx-auto">
                your projects & tasks
              </h3>
            </div>
            <p className="text-justify text-lg">
              It doesn't sugarcoat things or make promises it can't keep. It's a
              simple, and straightforward app that helps you get things done.
            </p>
          </div>
        </div>
      </section>
      <section
        className="flex h-svh w-full flex-col items-center rounded-b-3xl bg-[#b5af9a] shadow-black drop-shadow-md"
        style={{ backgroundImage: 'url("square.svg")' }}
      ></section>
      <section
        className="relative -z-10 flex h-svh w-full -translate-y-16 flex-col items-center rounded-b-3xl bg-gray-200 before:absolute before:h-full before:w-full before:rounded-b-3xl before:bg-[image:linear-gradient(transparent_0_80%,rgb(81_69_32/.1))]"
        style={{ backgroundImage: 'url("strip.svg")' }}
      ></section>
      <section className="relative z-10 w-full rounded-3xl bg-secondary-600 bg-opacity-50 pb-6 pt-8 backdrop-blur-lg">
        <h2 className="py-4 text-center text-xl font-medium text-white md:text-2xl lg:text-4xl">
          What Ugly users say...
        </h2>
        <div className="overflow-auto">
          <div className="grid w-full grid-flow-col items-center gap-8 overflow-auto p-8">
            <Comment
              username="Im.Karen"
              role="Drama Producer"
              comment={
                <>
                  <Link href={"/"} className="pr-1 text-sky-500">
                    @Ugly2Dont
                  </Link>
                  is... a todo app. THAT'S IT. The support team answers
                  immediately when i send a ticket. HELLOOOO!!! Don't you have
                  any job to do? should i do your job for you? Ahh.
                </>
              }
              avatar="/an-actual-avatar.jpg"
            />
            <Comment
              username="EntitledChad"
              role="Self-Decorated Governor"
              comment={
                <>
                  <Link href={"/"} className="pr-1 text-sky-500">
                    @Ugly2Dont
                  </Link>
                  was made with my direct order and provision and done by my
                  subordinates. No wonder it's the only to-do app that can keep
                  up with my procrastination skills. Under my supervision no
                  less of a miracle happens.
                </>
              }
              avatar="/rules-avatar.jpg"
            />
            <Comment
              username="The.Great.Elizabeth"
              role="Ex-Primitive Human"
              comment={
                <>
                  <Link href={"/"} className="pr-1 text-sky-500">
                    @Ugly2Dont
                  </Link>
                  is the one and only thing i like about this century on top of
                  that its branding resonates with me, and unlike me it's
                  functional.
                </>
              }
              avatar="/granny-avatar.jpg"
            />
            <Comment
              username="Chucklehead"
              role="Certified NPC"
              comment={
                <>
                  I've tried a lot of to-do apps, but
                  <Link href={"/"} className="px-1 text-sky-500">
                    @Ugly2Dont
                  </Link>
                  is the only one that I've actually stuck with. It's simple,
                  easy to use, and it actually helps me get things done. Plus,
                  it's free!
                </>
              }
              avatar="/noob-avatar.jpg"
            />
          </div>
        </div>
      </section>
      <section>
        <div className="flex items-center gap-8">
          <div style={{ padding: "2rem" }}>
            <Image
              alt="faq image"
              src="/faq.png"
              width={1377 / 4}
              height={1685 / 4}
              priority
              className="inline-block"
            />
          </div>
          <div>
            <h2 style={{ textAlign: "center" }}>Looking for something?</h2>
            <div style={{ padding: "1rem 0" }}>
              <Button className="btn-md">don’t be shy... install it</Button>
            </div>
            <strong style={{ lineHeight: "3rem" }}>FAQ</strong>
            <ol style={{ padding: "0 1rem" }}>
              <li>
                Is this a real thing?
                <span className="text-zinc-700">indeed</span>
              </li>
              <li>
                indeed Does it work offline?
                <span className="text-zinc-700">100%</span>
              </li>
              <li>
                there’s a bug!
                <span className="text-zinc-700">
                  huh like there’s such thing.
                </span>
              </li>
              <li>
                Wanna buy you a coffee?
                <span className="text-zinc-700">aww sweet. here.</span>
              </li>
              <li>
                I have a fun idea!
                <span className="text-zinc-700">good for you!</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <svg xmlns="http://www.w3.org/2000/svg" className="h-0 w-0">
        <clipPath id="poke" clipPathUnits="objectBoundingBox">
          <path d="M1,0 A1,1,0,0,0,0,1 L0,0 Z" fill="black" />
        </clipPath>
        <clipPath id="bbl1" clipPathUnits="objectBoundingBox">
          <path
            d="M132.5 88.5003C152.5 85.0003 145.5 101.5 202.5 97.0003C218.493 95.7378 241.582 113.5 256 74.5C270.418 35.5001 274.838 7.82521 219.5 2.00012C200.5 0.000121474 193 9.00016 170.5 7.00016C148 5.00016 124 2.00012 109 2.00012C94 2.00012 78 9.00016 65.5001 7.00016C53.0001 5.00016 24 -11 7.50006 17.5C-8.9999 46 8.00011 46.0004 7.50011 59.5004C7.00011 73.0004 13 96.5003 31.5 97.0003C50 97.5003 66.5001 97.0003 88.0001 97.0003C109.5 97.0003 112.5 92.0003 132.5 88.5003Z"
            transform="scale(0.00375939849 0.01)"
          />
        </clipPath>
        <clipPath id="bbl2" clipPathUnits="objectBoundingBox">
          <path
            transform="scale(0.003875969 0.00714285714)"
            d="M115.365 0C152.363 0 166.862 10.3334 186.861 10.3334C231.491 10.3334 268.356 32.8239 255.357 100.295C242.357 167.766 211.083 120.61 173.862 133.727C139.364 145.884 113.93 116.472 79.8678 133.727C55.8694 145.884 20.0004 143.167 2.87269 100.295C-9.4126 69.5442 20.305 19.9354 42.8701 10.3334C62.8689 1.82355 78.3679 0 115.365 0Z"
          />
        </clipPath>
        <clipPath id="bbl3" clipPathUnits="objectBoundingBox">
          <path
            transform="scale(0.003875969 0.00714285714)"
            d="M115.365 0C152.363 0 166.862 10.3334 186.861 10.3334C231.491 10.3334 268.356 32.8239 255.357 100.295C242.357 167.766 211.083 120.61 173.862 133.727C139.364 145.884 113.93 116.472 79.8678 133.727C55.8694 145.884 20.0004 143.167 2.87269 100.295C-9.4126 69.5442 20.305 19.9354 42.8701 10.3334C62.8689 1.82355 78.3679 0 115.365 0Z"
          />
        </clipPath>
      </svg>
    </>
  );
}

type CommentProps = {
  avatar: string;
  username: string;
  role: string;
  comment: JSX.Element;
};
function Comment({ avatar, username, role, comment }: CommentProps) {
  return (
    <div className="h-full w-[20rem] min-w-fit max-w-sm rounded-3xl bg-secondary-800 p-8 text-white">
      <div className="flex flex-nowrap items-center gap-4">
        <Image
          height={90}
          width={90}
          src={avatar}
          alt="profile_image"
          className="box-content rounded-full border-[1px] border-transparent outline-none outline-2 outline-sky-400 max-sm:h-12 max-sm:w-12 md:h-16 md:w-16 md:border-2 md:outline-4 lg:min-h-20 lg:min-w-20"
        />
        <div className="whitespace-nowrap max-sm:text-sm">
          <h4 className="flex items-center gap-2 text-lg font-medium lg:text-2xl">
            {username}
          </h4>
          {role}
        </div>
      </div>
      <p className="pt-6 text-justify text-sm lg:text-base">{comment}</p>
    </div>
  );
}

const Tuturial = debounce(function Tuturial(
  doc: Document,
  pointer: HTMLDivElement,
) {
  function write(text: string) {
    return async function (elm: HTMLInputElement) {
      elm.dispatchEvent(
        new FocusEvent("focus", { bubbles: true, cancelable: false }),
      );
      const n = text.length;
      for (let i = 1; i <= n; ++i) {
        await wait(100);
        const char = text.slice(0, i);
        elm.value = char;
      }
      elm.dispatchEvent(
        new FocusEvent("focusout", { bubbles: true, cancelable: false }),
      );
      elm.blur();
    };
  }
  function press(elm: HTMLElement) {
    const pointerInit: PointerEventInit = {
      pointerType: "touch",
      pressure: 1,
      isPrimary: true,
      bubbles: true,
      cancelable: true,
      pointerId: 1,
    };
    const mouseInit: MouseEventInit = {
      bubbles: true,
      cancelable: true,
    };

    elm.dispatchEvent(new PointerEvent("pointerdown", pointerInit));

    setTimeout(
      () => elm.dispatchEvent(new PointerEvent("pointerup", pointerInit)),
      250,
    );

    setTimeout(
      () => elm.dispatchEvent(new MouseEvent("click", mouseInit)),
      255,
    );

    return wait(260);
  }
  function goto<E extends HTMLElement>(elm: E, modal: boolean = false) {
    const centerOf = function (rect: DOMRect) {
      return {
        left: rect.left + rect.width / 2,
        top: rect.top + rect.height / 2,
      };
    };
    const distance = function (s0: DOMRect, s1: DOMRect) {
      const cs0 = centerOf(s0),
        cs1 = centerOf(s1);
      return Math.sqrt((cs0.left - cs1.left) ** 2 + (cs0.top - cs1.top) ** 2);
    };
    return new Promise<E>(async (resolve) => {
      if (modal) await wait(750);
      const pp = pointer.getBoundingClientRect(); // Pointer's position
      const ep = elm.getBoundingClientRect(); // Element's position
      const v = 3; // Pointer's velocity px/ms
      const ec = centerOf(ep);
      const left = ec.left - 4,
        top = ec.top - 4;

      pointer.animate([{ left: left + "px", top: top + "px" }], {
        duration: distance(pp, ep) / v,
        fill: "forwards",
        easing: "ease-out",
      }).onfinish = () =>
        (pointer.animate(
          { transform: ["scale(1)", "scale(.8)", "scale(1)"] },
          { duration: 100 },
        ).onfinish = () => resolve(elm));

      if (pp.left === left && pp.top === top) return resolve(elm);
    });
  }
  function whenLoaded<T>(param: () => T | null) {
    // this is pathetic
    return new Promise<T>(async (resolve, reject) => {
      let itr = 0;
      let result = param();
      while ((result === null || result === undefined) && itr < 100) {
        await wait(200);
        result = param();
        ++itr;
      }
      if (result === null || result === undefined) return reject();
      else return resolve(result);
    });
  }
  async function wait(dur: number) {
    await new Promise<unknown>((res) => setTimeout(res, dur));
  }

  // AddCategory();
  // AddProject();
  async function AddCategory() {
    return await whenLoaded(() => doc.getElementById("add-category"))
      .then(goto)
      .then(press)
      .then(() => whenLoaded(() => doc.getElementById("add-btn")))
      .then(goto)
      .then(press)
      .then(() => whenLoaded(() => doc.getElementById("add-category-btn")))
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc
              .getElementById("add-edit-category")!
              .getElementsByTagName("input")[0],
        ),
      )
      .then((elm) => goto(elm, true))
      .then(write("Personal"))
      .then(() =>
        whenLoaded(
          () =>
            doc
              .getElementById("add-edit-category")!
              .getElementsByTagName("button")[1],
        ),
      )
      .then(goto)
      .then(press);
  }

  async function AddProject() {
    return await whenLoaded(() => doc.getElementById("add-project"))
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="project"] input[name="title"]',
            ) as HTMLInputElement,
        ),
      )
      .then(goto)
      .then(write("Uglier2Don't App"))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="project"] input[name="description"]',
            ) as HTMLInputElement,
        ),
      )
      .then(goto)
      .then(write("Ugly2don't app but uglier"))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="project"] button[aria-label="calendar"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              '#calendar button[aria-label="next week"]',
            ) as HTMLButtonElement,
        ),
      )
      .then((elm) => goto(elm, true))
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="project"] button[aria-label="clock"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector('#clock input[name="hour"]') as HTMLInputElement,
        ),
      )
      .then((elm) => goto(elm, true))
      .then(write("11"))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector('#clock input[name="min"]') as HTMLInputElement,
        ),
      )
      .then(goto)
      .then(write("30"))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              '#clock button[aria-label="confirm"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="project"] .menu[aria-label="priority"] .menu-button',
            ) as HTMLDivElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="project"] .menu[aria-label="priority"] .menu-item',
            ) as HTMLLIElement,
        ),
      )
      .then((elm) => goto(elm, true))
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'header button[name="add-project"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press);
  }
  AddTask();
  async function AddTask() {
    return await whenLoaded(() => doc.getElementById("add-task"))
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] input[name="title"]',
            ) as HTMLInputElement,
        ),
      )
      .then(goto)
      .then(write("Sneezing with open eyes"))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] input[name="description"]',
            ) as HTMLInputElement,
        ),
      )
      .then(goto)
      .then(write("Proving scientists are wrong!"))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] button[aria-label="calendar"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              '#calendar button[aria-label="tomorrow"]',
            ) as HTMLButtonElement,
        ),
      )
      .then((elm) => goto(elm, true))
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] button[aria-label="clock"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector('#clock input[name="hour"]') as HTMLInputElement,
        ),
      )
      .then((elm) => goto(elm, true))
      .then(write("4"))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector('#clock input[name="min"]') as HTMLInputElement,
        ),
      )
      .then(goto)
      .then(write("20"))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              '#clock button[aria-label="confirm"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] .menu[aria-label="priority"] .menu-button',
            ) as HTMLDivElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] .menu[aria-label="priority"] .menu-item:last-child',
            ) as HTMLLIElement,
        ),
      )
      .then((elm) => goto(elm, true))
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] input[name="subtask-title"]',
            ) as HTMLInputElement,
        ),
      )
      .then(goto)
      .then(write("Buyin green leaves 🌿"))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] button[name="add-subtask"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] input[name="subtask-title"]',
            ) as HTMLInputElement,
        ),
      )
      .then(goto)
      .then(write("Steaming the veggies. ♨️"))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] button[name="add-subtask"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] input[name="subtask-title"]',
            ) as HTMLInputElement,
        ),
      )
      .then(goto)
      .then(write("Inhaling and forcing a sneeze 😮‍💨"))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'form[name="task"] button[name="add-subtask"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'header button[name="verify-task"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press)
      .then(() => wait(2000))
      .then(() =>
        whenLoaded(
          () =>
            doc.querySelector(
              'header button[name="confirm"]',
            ) as HTMLButtonElement,
        ),
      )
      .then(goto)
      .then(press);
  }
}, 500);
