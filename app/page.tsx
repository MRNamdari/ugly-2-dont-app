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

export default function DesktopPage() {
  const [miniScreen, setScreen] = useState(false);
  const iref = useRef<HTMLIFrameElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const thirdSection = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: thirdSection,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const iframe = iref.current;
    setScreen(document.body.clientWidth < 1000);
    window.onresize = () => {
      setScreen(document.body.clientWidth < 1000);
    };
    // if (!iframe) return;
    // iframe.onload = () => {
    //   console.log("iframe loaded");
    //   window.onscroll = () => {
    //     const vth = iframe.contentDocument!.body.offsetHeight;
    //     let progress =
    //       scrollYProgress.get() <= 0.5
    //         ? 0
    //         : ((scrollYProgress.get() - 0.5) * 10) / 5;
    //     iframe.contentDocument!.scrollingElement?.scrollTo({
    //       top: vth * progress,
    //       left: 0,
    //       behavior: "instant",
    //     });
    //   };
    // };
  });

  return (
    <>
      <div className="top-0 z-10 grid h-svh w-fit md:fixed md:right-16 lg:right-[max(2rem,calc((100%-1024px)/2))] xl:right-[max(4rem,calc((100%-1280px)/2))] 2xl:right-[max(6rem,calc((100%-1536px)/2))]">
        <div className="container h-fit max-w-md self-center md:max-w-[calc(768px/2)] lg:max-w-[calc(1024px/3)] xl:max-w-[calc(1280px/3)] 2xl:max-w-[calc(1536px/3)]">
          <div
            ref={phone}
            className="col-start-3 mx-auto aspect-[9/19.5] h-full max-h-fit max-w-fit"
          >
            <div className="relative h-full w-full rounded-[3rem] border-4 border-primary-700 shadow-md">
              <div className="h-full w-full overflow-hidden rounded-[2.7rem] border-[.75rem] border-zinc-900">
                <div className="absolute left-1/2 top-6 aspect-[10/2.5] w-1/4 -translate-x-1/2 rounded-full bg-current"></div>
                <iframe
                  ref={iref}
                  src="/pwa/"
                  loading="lazy"
                  className="h-full w-full bg-secondary-100 pt-10"
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
      <section
        className="roundedCorner relative h-svh w-full bg-primary-800 before:absolute before:h-full before:w-full before:bg-[image:linear-gradient(210deg,rgb(0_0_0/.3),20%,transparent)]"
        style={{
          cursor: 'url("scroll.svg"), pointer',
        }}
      >
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
      <section className="roundedCorner flex w-full flex-col items-center justify-around bg-zinc-100 py-16 after:shadow-sm">
        <div className="container grid h-full max-w-screen-2xl items-center md:grid-cols-2 lg:grid-cols-3">
          <div className="mx-auto grid max-w-screen-sm items-center gap-8 px-8 max-md:grid-rows-2 lg:col-span-2 lg:grid-cols-2 lg:px-0">
            <div className="whitespace-nowrap text-xl font-medium">
              <h3 className="relative w-fit after:absolute after:left-0 after:block after:h-1 after:w-full after:bg-secondary-300 max-sm:mx-auto">
                Manage your tasks,
              </h3>
              <br />
              <h3 className="relative w-fit after:absolute after:left-0 after:block after:h-1 after:w-full after:bg-secondary-300 max-sm:mx-auto">
                projects & categories
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
        className="flex h-svh w-full flex-col items-center rounded-b-3xl bg-slate-50 shadow-black drop-shadow-md"
        style={{ backgroundImage: 'url("square.svg")' }}
      ></section>
      <section
        className="relative -z-10 flex h-svh w-full -translate-y-16 flex-col items-center rounded-b-3xl bg-warning-100 before:absolute before:h-full before:w-full before:rounded-b-3xl before:bg-[image:linear-gradient(transparent_0_80%,rgb(81_69_32/.1))]"
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

const style = { filter: "drop-shadow(2px 4px 6px rgb(0 0 0 / 20%))" };
const springOption = { stiffness: 400, damping: 20 };

function CategoryMsg({
  image,
  scroll,
}: {
  image: boolean;
  scroll: MotionValue<number>;
}) {
  const tf = useTransform(scroll, [0, 0.1], [0, 1]);
  const mv = useSpring(tf, springOption);
  if (image) {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="88"
          height="80"
          viewBox="0 0 90 80"
          fill="none"
          style={{ position: "absolute", right: 0, top: "70%" }}
        >
          <motion.path
            d="M90 77C90 77 61 74 34 53C7 32 2 2 2 2"
            stroke="black"
            strokeWidth="4"
            pathLength="100"
            mask="url(#p1)"
            style={{ pathLength: tf }}
          />
          <mask id="p1">
            <rect width="326" height="290" fill="black"></rect>
            <path
              d="M90 77C90 77 61 74 34 53C7 32 2 2 2 2"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="4 4"
              pathLength="100"
            />
          </mask>
        </svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="326"
          height="290"
          viewBox="0 0 326 290"
          preserveAspectRatio="true"
          fill="none"
          style={{ ...style, scale: mv, opacity: mv }}
        >
          <style>{`text{font-size:1.1rem;font-weight:500;}`}</style>

          <image href="/caveman-with-slabs.png" width="184" height="221" />
          <g transform="translate(60 110)">
            <path
              d="M132.5 88.5003C152.5 85.0003 145.5 101.5 202.5 97.0003C218.493 95.7378 241.582 113.5 256 74.5C270.418 35.5001 274.838 7.82521 219.5 2.00012C200.5 0.000121474 193 9.00016 170.5 7.00016C148 5.00016 124 2.00012 109 2.00012C94 2.00012 78 9.00016 65.5001 7.00016C53.0001 5.00016 24 -11 7.50006 17.5C-8.9999 46 8.00011 46.0004 7.50011 59.5004C7.00011 73.0004 13 96.5003 31.5 97.0003C50 97.5003 66.5001 97.0003 88.0001 97.0003C109.5 97.0003 112.5 92.0003 132.5 88.5003Z"
              fill="#FFFDFA"
            />
            <text fill="black" x="35" y="40">
              leave tasks, projects and
            </text>
            <text fill="black" x="39" y="70">
              categories unorganized
            </text>
          </g>
        </motion.svg>
      </>
    );
  } else {
    return (
      <motion.div
        style={{
          width: "266px",
          height: "100px",
          clipPath: "url('#bbl1')",
          scale: mv,
          opacity: mv,
        }}
      >
        leave tasks, projects and
        <br />
        categories unorganized
      </motion.div>
    );
  }
}

function ProjectMsg({
  image,
  scroll,
}: {
  image: boolean;
  scroll: MotionValue<number>;
}) {
  const tf1 = useTransform(scroll, [0.1, 0.2], [0, 1]);
  const tf2 = useTransform(scroll, [0.15, 0.3], [0, 1]);
  const mv1 = useSpring(tf1, springOption);
  const mv2 = useSpring(tf2, springOption);
  if (image) {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="220"
          viewBox="0 0 230 140"
          preserveAspectRatio="true"
          fill="none"
          style={{ position: "absolute", top: "50%" }}
        >
          <motion.path
            d="M1.49978 47.4993C118 159.999 102 -55.6289 191.5 18.4999C281 92.6288 135.5 109.5 213 130.999"
            stroke="black"
            strokeWidth="4"
            mask="url(#p2)"
            style={{ pathLength: tf1 }}
          />
          <mask id="p2">
            <rect width="326" height="290" fill="black"></rect>
            <path
              d="M1.49978 47.4993C118 159.999 102 -55.6289 191.5 18.4999C281 92.6288 135.5 109.5 213 130.999"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="4 4"
            />
          </mask>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="296"
          height="427"
          viewBox="0 0 296 427"
          preserveAspectRatio="true"
          fill="none"
          style={style}
        >
          <style>{`text{font-size:1.1rem;font-weight:500;}`}</style>
          <motion.image
            href="/caveman-with-plan.png"
            width="256"
            height="256"
            style={{ scale: mv1, opacity: mv1 }}
          />
          <motion.g
            transform="translate(38 287)"
            style={{ translate: "38px 287px", scale: mv2, opacity: mv2 }}
          >
            <path
              d="M115.365 0C152.363 0 166.862 10.3334 186.861 10.3334C231.491 10.3334 268.356 32.8239 255.357 100.295C242.357 167.766 211.083 120.61 173.862 133.727C139.364 145.884 113.93 116.472 79.8678 133.727C55.8694 145.884 20.0004 143.167 2.87269 100.295C-9.4126 69.5442 20.305 19.9354 42.8701 10.3334C62.8689 1.82355 78.3679 0 115.365 0Z"
              fill="white"
            />
            <text fill="black" x="60" y="47">
              Don’t look at your
            </text>
            <text fill="black" x="35" y="77">
              progress in projects and
            </text>
            <text fill="black" x="60" y="107">
              stay unmotivated
            </text>
          </motion.g>
        </svg>
      </>
    );
  } else {
    return (
      <motion.div
        style={{
          width: "258",
          height: "140px",
          clipPath: "url('#bbl2')",
          scale: mv1,
          opacity: mv1,
        }}
      >
        Don’t look at your
        <br />
        progress in projects and
        <br />
        stay unmotivated
      </motion.div>
    );
  }
}

function TaskMsg({
  image,
  scroll,
}: {
  image: boolean;
  scroll: MotionValue<number>;
}) {
  const tf = useTransform(scroll, [0.5, 0.75], [0, 1]);
  const tf1 = useTransform(scroll, [0.5, 0.6], [0, 1]);
  const tf2 = useTransform(scroll, [0.6, 0.75], [0, 1]);
  const mv1 = useSpring(tf1, springOption);
  const mv2 = useSpring(tf2, springOption);
  if (image) {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="390"
          viewBox="0 0 300 390"
          preserveAspectRatio="true"
          fill="none"
          style={{ position: "absolute", top: "20%" }}
        >
          <motion.path
            d="M378.715 8.35923C220.922 -28.111 328.743 108.465 164.5 59.5C0.256781 10.5353 -80.9999 273.5 125 244"
            stroke="black"
            strokeWidth="4"
            stroke-linejoin="round"
            mask="url(#p3)"
            style={{ pathLength: tf }}
          />
          <mask id="p3">
            <rect width="326" height="290" fill="black"></rect>
            <path
              d="M378.715 8.35923C220.922 -28.111 328.743 108.465 164.5 59.5C0.256781 10.5353 -80.9999 273.5 125 244"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="4 4"
            />
          </mask>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="357"
          height="390"
          viewBox="0 0 357 390"
          preserveAspectRatio="true"
          fill="none"
          style={style}
        >
          <style>{`text{font-size:1.1rem;font-weight:500;}`}</style>
          <motion.image
            href="/caveman-with-clipboard.png"
            width="224"
            height="242"
            style={{ scale: mv1, opacity: mv1 }}
          />
          <motion.g
            transform="translate(93 246)"
            style={{ translate: "93px 246px", scale: mv2, opacity: mv2 }}
          >
            <path
              d="M115.365 0C152.363 0 166.862 10.3334 186.861 10.3334C231.491 10.3334 268.356 32.8239 255.357 100.295C242.357 167.766 211.083 120.61 173.862 133.727C139.364 145.884 113.93 116.472 79.8678 133.727C55.8694 145.884 20.0004 143.167 2.87269 100.295C-9.4126 69.5442 20.305 19.9354 42.8701 10.3334C62.8689 1.82355 78.3679 0 115.365 0Z"
              fill="white"
            />
            <text fill="black" x="35" y="65">
              Make a pile of tasks and
            </text>
            <text fill="black" x="45" y="95">
              watch them stack up
            </text>
          </motion.g>
        </svg>
      </>
    );
  } else {
    return (
      <motion.div
        style={{
          width: "258",
          height: "140px",
          clipPath: "url('#bbl3')",
          scale: mv1,
          opacity: mv1,
        }}
      >
        Make a pile of tasks and
        <br />
        watch them stack up
      </motion.div>
    );
  }
}

function PathWay({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "90%" }}
      viewBox="0 0 252 413"
      preserveAspectRatio="true"
      fill="none"
    >
      <motion.path
        id="path"
        d="M115.5 1.00012C136 41.5001 187.199 39.4495 218 67.5001C246 93.0001 265.125 120 237 185C192 289 129.5 216.5 43 269.5C-43.5 322.5 22.5 416.5 79 412"
        stroke="rgb(114 70 146)"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeDasharray="4 4"
        style={{ pathLength: progress }}
        mask="url(#maskPath)"
      />
      <mask id="maskPath">
        <motion.path
          d="M115.5 1.00012C136 41.5001 187.199 39.4495 218 67.5001C246 93.0001 265.125 120 237 185C192 289 129.5 216.5 43 269.5C-43.5 322.5 22.5 416.5 79 412"
          stroke="white"
          strokeWidth="4"
          strokeLinejoin="round"
          pathLength={100}
          strokeDasharray="1px 1px"
        />
      </mask>
    </svg>
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
