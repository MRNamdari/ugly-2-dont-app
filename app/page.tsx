"use client";
import Image from "next/image";

import Button from "@/app/_components/button";
import { useEffect, useRef, useState, Fragment } from "react";
import {
  useScroll,
  motion,
  useTransform,
  useAnimationControls,
  Variant,
  AnimatePresence,
  MotionProps,
} from "framer-motion";

import Link from "next/link";
import { debounce } from "./_store/util";
import IconButton from "./_components/icon-button";
import { GC, Tuturial } from "./_store/mock";
import { useRouter } from "next/navigation";

type TuturialName = keyof ReturnType<typeof Tuturial>;

export default function DesktopPage() {
  const iref = useRef<HTMLIFrameElement>(null);
  const pref = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const [tut, setTut] = useState<{ [P in TuturialName]: GC<void> }>();
  const debouced_setTut = debounce((tut: ReturnType<typeof Tuturial>) => {
    setTut({
      AddCategory: new GC(tut.AddCategory),
      AddProject: new GC(tut.AddProject),
      AddTask: new GC(tut.AddTask),
    });
  }, 500);
  const [mainHeight, setHeight] = useState<number>(0);
  const { scrollYProgress } = useScroll({
    axis: "y",
    container: mainRef,
    offset: ["start start", "end end"],
  });
  const shadow = useTransform(scrollYProgress, [0, 1], [-5, 10], {
    mixer(from, to) {
      return (v) =>
        `drop-shadow(10px ${v * (to - from) + from}px rgb(0 0 0 / 0.3))`;
    },
  });
  const screenlightPos = useTransform(scrollYProgress, [0, 1], [0, 100], {
    mixer() {
      return (v) => (1 - v) * 100 + "%";
    },
  });

  const bgLightPos = useTransform(scrollYProgress, [0, 1], [0, mainHeight], {
    mixer(from, to) {
      return (v) => -1 * (v * (to - from) + from) + "px";
    },
  });

  useEffect(() => {
    const iframe = iref.current;
    const doc = iframe?.contentDocument;
    const pointer = pref.current;
    if (doc && pointer && doc.children.length) {
      debouced_setTut(Tuturial(doc, pointer));
    }
  }, [iref.current, pref.current]);

  useEffect(() => {
    if (mainRef.current) setHeight(mainRef.current.scrollHeight);
  }, [mainRef.current]);

  const phone = (
    <motion.div
      style={{ filter: shadow }}
      className="relative rounded-[3rem] border-4 border-primary-700"
    >
      <motion.div
        style={{ ["--pos" as string]: screenlightPos }}
        className="moving-screen-light relative overflow-hidden rounded-[2.7rem] border-[.75rem] border-zinc-900 bg-zinc-800"
      >
        <div
          id="notch"
          className="absolute left-1/2 top-2 z-10 aspect-[10/2.5] w-1/4 -translate-x-1/2 rounded-full bg-zinc-900 p-1 drop-shadow-md"
        >
          <div className="ml-auto size-3 rounded-full bg-zinc-950"></div>
        </div>
        <iframe
          id="app"
          ref={iref}
          src="/pwa/"
          loading="lazy"
          className="aspect-[19.5/9] opacity-90"
          height={687.33333}
          width={300}
          allowFullScreen={false}
          onLoad={(e) => {
            const style = document.createElement("style");
            style.innerText = "::-webkit-scrollbar{width:0px;height:0px;}";
            const htmlDoc = e.target as HTMLIFrameElement;
            htmlDoc.contentDocument?.head.appendChild(style);
          }}
        ></iframe>
      </motion.div>
      <div className="absolute -left-2 top-[15%] flex h-full flex-col gap-4">
        <div className="h-[5%] w-1 rounded-l-sm bg-primary-600"></div>
        <div className="h-[10%] w-1 rounded-l-sm bg-primary-600"></div>
        <div className="h-[10%] w-1 rounded-l-sm bg-primary-600"></div>
      </div>
      <div className="absolute -right-2 top-1/4 h-[13.5%] w-1 rounded-r-sm bg-primary-600"></div>
    </motion.div>
  );
  const PhoneWithPointer = (
    <div className="fixed max-w-sm md:max-w-md">
      <div
        ref={pref}
        id="pointer"
        className="absolute inset-1/2 z-10 size-10 rounded-full border-4 border-white border-opacity-50 bg-zinc-900 bg-opacity-50"
      ></div>
      <div ref={phoneRef} className="h-full max-h-fit max-w-fit">
        {phone}
      </div>
    </div>
  );

  function PlaybackHandler(seq: TuturialName) {
    return () => {
      if (tut) {
        Object.keys(tut).forEach((value) => {
          const s = value as TuturialName;
          if (s === seq) {
            tut[s].play();
          } else {
            if (!tut[s].done) tut[s].restart();
          }
        });
      }
    };
  }

  return (
    <motion.main
      ref={mainRef}
      style={{
        backgroundPositionY: bgLightPos,
        backgroundSize: "auto " + mainHeight + "px",
      }}
      className="relative h-svh snap-y snap-mandatory overflow-y-scroll bg-primary-800 bg-[image:radial-gradient(circle_at_50%_50%_in_hsl,#16363c,#0b1d21)] text-white"
    >
      <div className="mx-auto grid max-w-screen-xl md:grid-cols-2">
        <div>
          <section className="h-svh snap-start place-content-center">
            <Title />
          </section>
          <section className="flex h-svh items-center px-8 md:px-16">
            <FirstSection />
          </section>
          <section className="flex h-svh flex-col px-8 md:items-center md:px-16">
            <CategoryTutorial
              controller={tut?.AddCategory}
              onPlay={PlaybackHandler("AddCategory")}
              onPause={() => {
                tut?.AddCategory.pause();
              }}
            />
            <CategoryPage />
          </section>
          <section className="flex h-svh flex-col px-8 md:items-center md:px-16">
            <ProjectTutorial
              controller={tut?.AddProject}
              onPlay={PlaybackHandler("AddProject")}
              onPause={() => {
                tut?.AddProject.pause();
              }}
            />
            <ProjectPage />
          </section>
          <section className="flex h-svh flex-col px-8 md:items-center md:px-16">
            <TaskTutorial
              controller={tut?.AddTask}
              onPlay={PlaybackHandler("AddTask")}
              onPause={() => {
                tut?.AddTask.pause();
              }}
            />
            <TaskPage />
          </section>
        </div>
        <div className="flex h-svh items-center justify-center max-sm:hidden">
          {PhoneWithPointer}
        </div>
      </div>
      <footer>
        <section className="relative z-10 h-svh w-full snap-start bg-secondary-600 bg-opacity-60 pb-6 pt-8 backdrop-blur-md">
          <h2 className="py-4 text-center text-xl font-medium md:text-2xl lg:text-4xl">
            What Ugly users say...
          </h2>
          <div className="mx-auto max-w-6xl">
            <div className="grid w-full snap-x snap-mandatory scroll-p-8 grid-flow-col items-center gap-8 overflow-auto overflow-y-auto overflow-x-scroll p-8">
              <Comment
                username="Im.Karen"
                role="Drama Producer"
                comment={
                  <>
                    <Link href={"/"} className="pr-1 text-sky-500">
                      @Ugly2Dont
                    </Link>
                    is... a todo app. THAT&apos;S IT. The support team answers
                    immediately when i send a ticket. HELLOOOO!!! Don&apos;t you
                    have any job to do? I have to talk to their manager.
                  </>
                }
                avatar="/b.jpg"
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
                    subordinates. No wonder it&apos;s the only to-do app that
                    can keep up with my procrastination skills. Under my
                    supervision no less of a miracle happens.
                  </>
                }
                avatar="/c.png"
              />
              <Comment
                username="The.Great.Elizabeth"
                role="Ex-Primitive Human"
                comment={
                  <>
                    <Link href={"/"} className="pr-1 text-sky-500">
                      @Ugly2Dont
                    </Link>
                    is the one and only thing i like about this century on top
                    of that its branding resonates with me, and unlike me
                    i&apos;s functional.
                  </>
                }
                avatar="/a.jpg"
              />
              <Comment
                username="RichKid"
                role="Gym Rat"
                comment={
                  <>
                    I&apos;ve tried many premium to-do apps, but
                    <Link href={"/"} className="px-1 text-sky-500">
                      @Ugly2Dont
                    </Link>
                    is my one and only one. I stuck with it because it&apos;s
                    simple and easy to use, and it actually helps me get things
                    done. Unfortunately, it&apos;s free!
                  </>
                }
                avatar="/d.webp"
              />
            </div>
          </div>
        </section>
        <section className="h-svh">
          <div className="h-full snap-start bg-primary-900 bg-opacity-50 py-8 text-gray-300">
            <div className="container mx-auto grid h-full place-content-evenly place-self-center px-4 md:grid-cols-2">
              <div className="h-full w-full place-self-center">
                <div className="mb-6 items-baseline gap-6 text-3xl leading-relaxed md:mb-0">
                  Haven&apos;t installed it yet?
                  <br />
                  it&apos;s
                  <h2 className="mb-8 inline-block font-semibold">
                    <button className="rounded-full bg-primary-700 px-4 text-5xl">
                      Ugly
                      <span className="inline-block translate-y-2 rotate-12 text-7xl font-medium leading-3 text-error-300">
                        2
                      </span>
                      Don’t
                    </button>
                  </h2>
                </div>
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="mb-6 md:mb-0">
                    <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
                    <ul>
                      <li>
                        <a href="#" className="hover:text-gray-100">
                          FAQ
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-gray-100">
                          Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-gray-100">
                          Terms of Service
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="mb-6 md:mb-0">
                    <h3 className="mb-4 text-lg font-semibold">Community</h3>
                    <ul>
                      <li>
                        <a
                          href="https://github.com/MRNamdari/ugly-2-dont-app"
                          target="_blank"
                          className="hover:text-gray-100"
                        >
                          GitHub
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-gray-100">
                          Forum
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-gray-100">
                          Blog
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 border-t border-primary-800 pt-4 text-center text-sm text-primary-400">
                  &copy; 2025 Ugly2Don&apos;t. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </section>
      </footer>
    </motion.main>
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
    <div
      className="h-full w-[20rem] min-w-fit max-w-sm snap-center rounded-3xl text-white"
      style={{
        backgroundImage:
          "linear-gradient(45deg,rgb(17 55 60 / 1),rgb(17 55 60 / .2) 75%)",
      }}
    >
      <figure className="relative">
        <div
          className="h-[40svh] overflow-hidden"
          style={{
            maskImage: "linear-gradient(black 60%,transparent)",
          }}
        >
          <Image
            height={640}
            width={420}
            src={avatar}
            alt="profile_image"
            className="box-content rounded-t-3xl grayscale"
          />
        </div>
        <figcaption className="absolute bottom-0 w-full whitespace-nowrap px-8 max-sm:text-sm">
          <h4 className="flex items-center gap-2 text-lg font-medium lg:text-2xl">
            {username}
          </h4>
          {role}
        </figcaption>
      </figure>
      <p className="px-6 py-4 text-justify text-sm lg:text-base">{comment}</p>
    </div>
  );
}

const exit = { opacity: 0, x: -40 } satisfies Variant;
const enter = {
  opacity: 1,
  x: 0,
  transition: {
    ease: "anticipate",
    duration: 0.5,
    // opacity: { duration: 0.7 },
  },
} satisfies Variant;
const variants = { exit, enter } as const;

function Title() {
  const router = useRouter();
  return (
    <div className="mx-auto flex w-fit items-center gap-8">
      <motion.div
        animate="enter"
        transition={{ staggerChildren: 0.25, delay: 1, delayChildren: 1 }}
        className="whitespace-pre"
      >
        <div className="md:lg text-base text-secondary-200 *:origin-bottom-left lg:text-2xl">
          <motion.span
            key="t1"
            className="inline-block"
            initial={exit}
            variants={variants}
          >
            with{" "}
          </motion.span>
          <motion.span
            key="t2"
            initial={exit}
            variants={variants}
            className="relative inline-block after:absolute after:left-0 after:block after:h-0.5 after:w-full after:bg-current"
          >
            Ugly2Don’t
          </motion.span>
        </div>
        <h2 className="text-lg text-white [line-height:1.325!important] *:origin-bottom-left md:text-xl lg:text-3xl">
          <motion.span
            key="t1"
            className="inline-block"
            initial={exit}
            variants={variants}
          >
            Get your{" "}
          </motion.span>
          <motion.span
            key="t2"
            initial={exit}
            variants={variants}
            className="relative inline-block text-2xl leading-[inherit!important] after:absolute after:left-0 after:block after:h-0.5 after:w-full after:bg-current md:text-3xl lg:text-5xl lg:after:h-1"
          >
            ugly tasks{" "}
          </motion.span>
          <motion.span
            key="t3"
            className="inline-block"
            initial={exit}
            variants={variants}
          >
            done
          </motion.span>
          <p className="text-error-200">
            <motion.span
              key="t1"
              className="inline-block"
              initial={exit}
              variants={variants}
            >
              Even if you do it{" "}
            </motion.span>
            <motion.span
              key="t2"
              initial={exit}
              variants={variants}
              className="relative inline-block text-2xl leading-[inherit!important] after:absolute after:left-0 after:block after:h-0.5 after:w-full after:bg-current md:text-3xl lg:text-5xl lg:after:h-1"
            >
              the ugly way!
            </motion.span>
          </p>
          <motion.div initial={exit} variants={variants}>
            <Button className="tap-primary-600 btn-md ml-auto mt-4 w-fit bg-primary-500 font-medium lg:btn-lg lg:w-fit lg:text-3xl"
            onClick={()=>{
              router.push("/pwa")
            }}
            >
              Try it now!
            </Button>
          </motion.div>
        </h2>
      </motion.div>
    </div>
  );
}

function FirstSection(props: { onView?: () => void }) {
  const control = useAnimationControls();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) control.start("enter");
  }, [inView]);

  return (
    <motion.div
      onViewportEnter={() => {
        setInView(true);
        if (props.onView) props.onView();
      }}
      className="grid snap-center grid-flow-row gap-16"
    >
      <div className="whitespace-nowrap text-xl font-medium md:text-2xl lg:text-4xl lg:leading-tight">
        <motion.h3
          key="t1"
          initial="exit"
          animate={control}
          variants={{
            enter: {
              x: 0,
              opacity: 1,
              transition: {
                duration: 0.75,
                delay: 1,
              },
            },
            exit: {
              x: -50,
              opacity: 0,
            },
          }}
          className="relative mx-auto w-fit after:absolute after:left-0 after:block after:h-1 after:w-full after:bg-secondary-300 max-sm:mx-auto"
        >
          Manage & categorize
        </motion.h3>
        <br />
        <motion.h3
          key="t2"
          initial="exit"
          animate={control}
          variants={{
            enter: {
              x: 0,
              opacity: 1,
              transition: {
                duration: 0.75,
                delay: 1,
              },
            },
            exit: {
              x: 50,
              opacity: 0,
            },
          }}
          className="relative mx-auto w-fit after:absolute after:left-0 after:block after:h-1 after:w-full after:bg-secondary-300 max-sm:mx-auto"
        >
          your projects & tasks
        </motion.h3>
      </div>
      <motion.p
        key="p"
        animate={control}
        transition={{
          delayChildren: 1.5,
          staggerChildren: 0.05,
        }}
        className="text-justify text-lg lg:text-xl"
      >
        <MotionWord initial={variants.exit} variants={variants}>
          Sugarcoat things you hate to be assured you get your postponed tasks
          done eventually. A simple, straightforward app that steps on your
          nerves so you get things done.
        </MotionWord>
      </motion.p>
    </motion.div>
  );
}

type Step = [JSX.Element, boolean];

type SummaryProps = {
  title: JSX.Element | JSX.Element[];
  description?: string;
  controller?: GC<void>;
  onPlay: () => void;
  onPause: () => void;
  onView?: () => void;
  steps: Step[];
};
function Summary(props: SummaryProps) {
  const control = useAnimationControls();
  const [inView, setInView] = useState(false);
  type PlayState = "Play" | "Pause" | "Finish";
  const [playState, setPlayState] = useState<PlayState>("Pause");
  const [steps, setSteps] = useState(props.steps);

  useEffect(() => {
    if (inView) {
      control.start("enter");
    } else {
      props.controller?.pause();
      if (playState !== "Pause") setPlayState("Pause");
    }
  }, [inView]);

  // Setting Event handler on Generator Controller
  if (props.controller) {
    props.controller.then = () => setPlayState("Finish");
    // When one generator executing others restart if not finished
    props.controller.when("restart", () =>
      setSteps((s) =>
        s.map((item) => {
          item[1] = false;
          return item;
        }),
      ),
    );
    // Each marked yield in generators fires an event with it mark as value
    for (let i = 0; i < steps.length; ++i)
      props.controller.when(i, () =>
        setSteps((s) => {
          s[i][1] = true;
          return Array.from(s);
        }),
      );
  }

  return (
    <div className="clr-primary-800 snap-start py-6 md:snap-center">
      <article className="mx-auto w-full max-w-screen-sm">
        <h2
          className="flex items-center gap-2 text-xl font-medium lg:gap-4 lg:text-3xl"
          onClick={() => {
            if (playState !== "Finish") {
              setPlayState(playState == "Pause" ? "Play" : "Pause");
              if (playState == "Pause") props.onPlay();
              else props.onPause();
            }
          }}
        >
          <motion.span
            onViewportEnter={() => setInView(true)}
            onViewportLeave={() => setInView(false)}
            animate={control}
            transition={{
              delayChildren: 0.5,
              staggerChildren: 0.05,
            }}
          >
            {props.title}
          </motion.span>
          <IconButton
            icon={
              playState == "Finish"
                ? "Check"
                : playState == "Pause"
                  ? "Play"
                  : "Pause"
            }
            className="tap-primary-200 ico-md hidden bg-white text-[--tw-color] md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={control}
            variants={{
              enter: {
                transition: {
                  delay: 1,
                },
                opacity: 1,
              },
            }}
          ></IconButton>
        </h2>
        <motion.h3
          animate={control}
          transition={{
            delayChildren: 1,
            staggerChildren: 0.05,
          }}
          className="py-4 text-justify text-base text-primary-100 lg:text-xl"
        >
          {props.description && (
            <MotionWord initial={variants.exit} variants={variants}>
              {props.description}
            </MotionWord>
          )}
        </motion.h3>
        <motion.div
          animate={playState.toLowerCase()}
          transition={{
            staggerChildren: 0.1,
          }}
          className="py-6 pe-8 text-justify text-sm leading-relaxed text-primary-200 lg:text-lg"
        >
          <ol className="numbered-list">
            <AnimatePresence>
              {steps.filter((s) => s[1]).map((s) => s[0])}
            </AnimatePresence>
          </ol>
        </motion.div>
      </article>
    </div>
  );
}

function CategoryTutorial(props: {
  onPause: () => void;
  onPlay: () => void;
  onView?: () => void;
  controller?: GC<void>;
}) {
  const initial = {
    opacity: 0,
    y: -20,
  } satisfies Variant;
  const animate = {
    opacity: 1,
    y: 0,
  } satisfies Variant;

  const steps: Step[] = [
    [
      <motion.li key={0} initial={initial} exit={initial} animate={animate}>
        Press <span className="font-medium text-white">“see all”</span> then{" "}
        <span className="font-medium text-white">“+”</span>
      </motion.li>,
      false,
    ],
    [
      <motion.li key={1} initial={initial} exit={initial} animate={animate}>
        Give it a name and press <span className="font-medium">“add”</span>
      </motion.li>,
      false,
    ],
    [
      <motion.li key={2} initial={initial} exit={initial} animate={animate}>
        Here you can add projects, tasks or even categories
      </motion.li>,
      false,
    ],
  ];
  return (
    <Summary
      title={
        <MotionWord initial={variants.exit} variants={variants}>
          Put everything where it truly belongs
        </MotionWord>
      }
      steps={steps}
      onPause={props.onPause}
      onPlay={props.onPlay}
      controller={props.controller}
      description="Simply categorize tasks, projects and even other categories! This way you know which way to go to avoid them."
    />
  );
}

function ProjectTutorial(props: {
  onPause: () => void;
  onPlay: () => void;
  onView?: () => void;
  controller?: GC<void>;
}) {
  const initial = {
    opacity: 0,
    y: -20,
  } satisfies Variant;
  const animate = {
    opacity: 1,
    y: 0,
  } satisfies Variant;

  const steps: Step[] = [
    [
      <motion.li key={0} initial={initial} exit={initial} animate={animate}>
        Press <span className="font-medium text-white">“see all”</span> then{" "}
        <span className="font-medium text-white">“+”</span> or just{" "}
        <span className="font-medium text-white">“+”</span>
      </motion.li>,
      false,
    ],
    [
      <motion.li key={1} initial={initial} exit={initial} animate={animate}>
        Give your project a name
      </motion.li>,
      false,
    ],
    [
      <motion.li key={2} initial={initial} exit={initial} animate={animate}>
        Add some descriptions
      </motion.li>,
      false,
    ],
    [
      <motion.li key={3} initial={initial} exit={initial} animate={animate}>
        Of course and due date
      </motion.li>,
      false,
    ],
    [
      <motion.li key={4} initial={initial} exit={initial} animate={animate}>
        and due time
      </motion.li>,
      false,
    ],
    [
      <motion.li key={5} initial={initial} exit={initial} animate={animate}>
        How important is it really?
      </motion.li>,
      false,
    ],
    [
      <motion.li key={6} initial={initial} exit={initial} animate={animate}>
        It&apos;s all set. Now you can add tasks/projects to it.
      </motion.li>,
      false,
    ],
  ];
  return (
    <Summary
      title={
        <MotionWord initial={variants.exit} variants={variants}>
          Talk the talk... Walk the walk
        </MotionWord>
      }
      steps={steps}
      onPause={props.onPause}
      onPlay={props.onPlay}
      controller={props.controller}
      description={
        'Keep your procrastination skills in check with "Projects" where stuck projects and unchecked tasks are monitored and reported.'
      }
    />
  );
}

function TaskTutorial(props: {
  onPause: () => void;
  onPlay: () => void;
  onView?: () => void;
  controller?: GC<void>;
}) {
  const initial = {
    opacity: 0,
    y: -20,
  } satisfies Variant;
  const animate = {
    opacity: 1,
    y: 0,
  } satisfies Variant;

  const steps: Step[] = [
    [
      <motion.li key={0} initial={initial} exit={initial} animate={animate}>
        Press <span className="font-medium text-white">“see all”</span> then{" "}
        <span className="font-medium text-white">“+”</span> or just{" "}
        <span className="font-medium text-white">“+”</span> in categories /
        projects
      </motion.li>,
      false,
    ],
    [
      <motion.li key={1} initial={initial} exit={initial} animate={animate}>
        What&apos;s your task?
      </motion.li>,
      false,
    ],
    [
      <motion.li key={2} initial={initial} exit={initial} animate={animate}>
        What&apos;s it about?
      </motion.li>,
      false,
    ],
    [
      <motion.li key={3} initial={initial} exit={initial} animate={animate}>
        deadline is a must
      </motion.li>,
      false,
    ],
    [
      <motion.li key={4} initial={initial} exit={initial} animate={animate}>
        and now time
      </motion.li>,
      false,
    ],
    [
      <motion.li key={5} initial={initial} exit={initial} animate={animate}>
        It&apos;s crucial huh?
      </motion.li>,
      false,
    ],
    [
      <motion.li key={6} initial={initial} exit={initial} animate={animate}>
        Oh... It has steps too! I see!
      </motion.li>,
      false,
    ],
    [
      <motion.li key={7} initial={initial} exit={initial} animate={animate}>
        That&apos;s what you want, right?
      </motion.li>,
      false,
    ],
    [
      <motion.li key={8} initial={initial} exit={initial} animate={animate}>
        Now you have your first Task.
      </motion.li>,
      false,
    ],
  ];
  return (
    <Summary
      title={
        <MotionWord initial={variants.exit} variants={variants}>
          Make Progress, step by step
        </MotionWord>
      }
      steps={steps}
      onPause={props.onPause}
      onPlay={props.onPlay}
      controller={props.controller}
      description="Everything comes down to corporate-size tasks, where through suffering, maybe a few things happen."
    />
  );
}

type MotionWordProps = { children: string; className?: string } & MotionProps;

function MotionWord(props: MotionWordProps) {
  const { children, ...motionprops } = props;
  const slices = children.split(/\s+/);
  const n = slices.length;
  const words: JSX.Element[] = new Array(n * 2);
  for (let i = 0; i < n; ++i) {
    words[i * 2] = (
      <motion.span
        key={"w" + i}
        className={"inline-block" + (props.className ?? "")}
        {...motionprops}
      >
        {slices[i]}
      </motion.span>
    );
    words[i * 2 + 1] = <Fragment key={"s" + i}> </Fragment>;
  }
  return words;
}

function CategoryPage() {
  const [played, setPlayState] = useState(false);
  const control = useAnimationControls();
  const categoryControl = useAnimationControls();
  const pageVariants = {
    enter: {
      opacity: 1,
      y: 0,
    },
    exit: { opacity: 0, y: 30 },
  };
  const categoryVariants = {
    enter: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: -10,
      opacity: 0,
    },
  };

  useEffect(() => {
    if (played) control.start("enter");
  }, [played]);

  return (
    <motion.div
      initial="exit"
      onViewportEnter={() => setPlayState(true)}
      animate={control}
      transition={{
        duration: 1,
        delay: 1,
      }}
      variants={pageVariants}
      className="max-h-[50svh] md:hidden"
      style={{ perspectiveOrigin: "center", perspective: "300px" }}
    >
      <div
        className="max-h-[50svh] rounded-2xl text-black transition-transform"
        style={{
          backgroundImage:
            "linear-gradient(-45deg, transparent -30%, rgba(255,255,255,.4) 10%, transparent 110%)",
        }}
      >
        <div className="rounded-2xl bg-opacity-30 text-primary-400">
          <header className="grid grid-cols-[3rem_1fr_3rem] items-center justify-center p-4">
            <div>
              <button className="ico-lg" name="back">
                <div className="flex aspect-square items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </div>
              </button>
            </div>
            <motion.h1
              initial="exit"
              animate={control}
              variants={{
                enter: { y: 0, opacity: 1 },
                exit: { y: -30, opacity: 0 },
              }}
              transition={{
                delay: 1.5,
              }}
              className="self-end overflow-hidden text-ellipsis whitespace-nowrap text-center text-3xl font-medium"
            >
              Categories
            </motion.h1>
            <div></div>
          </header>
          <section className="grid h-full grid-rows-[2rem_2rem_auto] gap-4">
            <div className="grid h-fit max-w-[100vw] grid-flow-col justify-between overflow-hidden px-4 text-primary-200">
              <div className="flex items-center gap-2">
                <div className="flex items-end">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    className="mr-1 place-self-center"
                  >
                    <motion.circle
                      cx="11"
                      cy="11"
                      r="5.5"
                      className="origin-center -rotate-90 transition-[stroke-dashoffset] duration-500"
                      pathLength="100.01"
                      strokeWidth="11"
                      strokeDasharray="100 100"
                      transition={{ delay: 1.5 }}
                      initial="exit"
                      animate={control}
                      variants={{
                        enter: { strokeDashoffset: 33 },
                        exit: { strokeDashoffset: 0 },
                      }}
                    ></motion.circle>
                  </svg>
                  <div className="h-8 overflow-hidden text-3xl leading-8">
                    <div className="text-right">
                      <p>67</p>
                    </div>
                  </div>
                  %
                </div>
                <div className="text-sm leading-3">
                  6/15<p>Tasks</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-end">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    className="mr-1 place-self-center"
                  >
                    <motion.circle
                      cx="11"
                      cy="11"
                      r="5.5"
                      className="origin-center -rotate-90 transition-[stroke-dashoffset] duration-500"
                      pathLength="100.01"
                      strokeWidth="11"
                      strokeDasharray="100 100"
                      transition={{ delay: 1.5 }}
                      initial="exit"
                      animate={control}
                      variants={{
                        enter: { strokeDashoffset: 83 },
                        exit: { strokeDashoffset: 0 },
                      }}
                    ></motion.circle>
                  </svg>
                  <div className="h-8 overflow-hidden text-3xl leading-8">
                    <div className="text-right">
                      <p>16</p>
                    </div>
                  </div>
                  %
                </div>
                <div className="text-sm leading-3">
                  1/6<p>Projects</p>
                </div>
              </div>
            </div>
            <div className="flex px-4 text-primary-800">
              <button className="btn-sm w-fit select-none bg-secondary-100">
                <div className="flex aspect-square items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </div>
                <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                  Home
                </p>
              </button>
            </div>
            <motion.div
              animate={control}
              transition={{ staggerChildren: 0.25, delayChildren: 2 }}
              className="h-full px-4 text-primary-800"
            >
              <motion.article
                initial={categoryVariants.exit}
                variants={categoryVariants}
                id="c1"
                className="relative mb-4"
              >
                <div
                  className="grid grid-cols-[3rem_auto_2rem] items-center rounded-3xl p-6 py-2"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #70969d, #9adfebcc)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 56 40"
                    height="28"
                  >
                    <rect
                      x="0"
                      y="5"
                      width="56"
                      height="35"
                      className="fill-warning-300"
                      rx="5"
                    ></rect>
                    <rect
                      x="0"
                      y="5"
                      width="56"
                      height="5"
                      className="fill-warning-500"
                    ></rect>
                    <polygon
                      points="0,0 20,0 25,10 0,10"
                      className="fill-warning-500"
                    ></polygon>
                    <polygon
                      points="56,0 36,0 31,10 56,10"
                      className="fill-warning-300"
                    ></polygon>
                  </svg>
                  <span className="h-fit">
                    <h4 className="self-center text-base font-medium">
                      Personal
                    </h4>
                    <h5 className="text-xs text-primary-600">
                      6 Tasks • 2 Projects
                    </h5>
                  </span>
                  <div className="tap-gray-200 ico-md flex aspect-square items-center justify-center text-primary-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              </motion.article>
              <motion.article
                initial={categoryVariants.exit}
                variants={categoryVariants}
                id="c2"
                className="relative mb-4"
              >
                <div className="absolute left-2 top-1/2 -z-10 flex h-5/6 w-1/2 -translate-y-1/2 items-center justify-start rounded-l-2xl bg-warning-500 p-4">
                  <div className="flex aspect-square size-6 items-center justify-center text-error-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </div>
                </div>
                <div className="absolute right-2 top-1/2 -z-10 flex h-5/6 w-1/2 -translate-y-1/2 items-center justify-end rounded-r-2xl bg-warning-400 p-4">
                  <div className="flex aspect-square size-6 items-center justify-center text-warning-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </div>
                </div>
                <motion.div
                  className="grid grid-cols-[3rem_auto_2rem] items-center rounded-3xl p-6 py-2 backdrop-blur-lg"
                  variants={{
                    swipe: {
                      translateX: "-3rem",
                      backgroundImage:
                        "linear-gradient(45deg, rgb(255,255,255,.5), rgb(255,255,255,0))",
                      transition: {
                        delay: 0.2,
                        duration: 0.75,
                        ease: "easeOut",
                      },
                    },
                    initial: {
                      backgroundImage:
                        "linear-gradient(45deg, #70969d, #9adfebcc)",
                    },
                  }}
                  initial="initial"
                  animate={categoryControl}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 56 40"
                    height="28"
                  >
                    <rect
                      x="0"
                      y="5"
                      width="56"
                      height="35"
                      className="fill-warning-300"
                      rx="5"
                    ></rect>
                    <rect
                      x="0"
                      y="5"
                      width="56"
                      height="5"
                      className="fill-warning-500"
                    ></rect>
                    <polygon
                      points="0,0 20,0 25,10 0,10"
                      className="fill-warning-500"
                    ></polygon>
                    <polygon
                      points="56,0 36,0 31,10 56,10"
                      className="fill-warning-300"
                    ></polygon>
                  </svg>
                  <span className="h-fit">
                    <h4 className="self-center text-base font-medium">Work</h4>
                    <h5 className="text-xs text-primary-600">
                      3 Tasks • 2 Projects
                    </h5>
                  </span>
                  <div className="tap-gray-200 ico-md flex aspect-square items-center justify-center text-primary-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </motion.div>
              </motion.article>
              <motion.article
                onAnimationComplete={() => categoryControl.start("swipe")}
                initial={categoryVariants.exit}
                variants={categoryVariants}
                id="c3"
                className="relative mb-4"
              >
                <div
                  className="grid grid-cols-[3rem_auto_2rem] items-center rounded-3xl bg-gray-100 p-6 py-2"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #70969d, #9adfebcc)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 56 40"
                    height="28"
                  >
                    <rect
                      x="0"
                      y="5"
                      width="56"
                      height="35"
                      className="fill-warning-300"
                      rx="5"
                    ></rect>
                    <rect
                      x="0"
                      y="5"
                      width="56"
                      height="5"
                      className="fill-warning-500"
                    ></rect>
                    <polygon
                      points="0,0 20,0 25,10 0,10"
                      className="fill-warning-500"
                    ></polygon>
                    <polygon
                      points="56,0 36,0 31,10 56,10"
                      className="fill-warning-300"
                    ></polygon>
                  </svg>
                  <span className="h-fit">
                    <h4 className="self-center text-base font-medium">
                      Creative
                    </h4>
                    <h5 className="text-xs text-primary-600">
                      5 Tasks • 2 Projects
                    </h5>
                  </span>
                  <div className="tap-gray-200 ico-md flex aspect-square items-center justify-center text-primary-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              </motion.article>
            </motion.div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectPage() {
  const [played, setPlayState] = useState(false);
  const control = useAnimationControls();
  const pageVariants = {
    enter: {
      opacity: 1,
      y: 0,
    },
    exit: { opacity: 0, y: 30 },
  };

  useEffect(() => {
    if (played) control.start("enter");
  }, [played]);
  return (
    <motion.div
      initial="exit"
      onViewportEnter={() => setPlayState(true)}
      animate={control}
      transition={{
        duration: 1,
        delay: 1,
      }}
      variants={pageVariants}
      className="max-h-[50svh] md:hidden"
      style={{ perspectiveOrigin: "center", perspective: "300px" }}
    >
      <div
        className="max-h-[50svh] rounded-2xl text-black transition-transform"
        style={{
          backgroundImage:
            "linear-gradient(-45deg, transparent -30%, rgba(255,255,255,.4) 10%, transparent 110%)",
        }}
      >
        <header className="grid grid-cols-[3rem_1fr_3rem] items-center justify-center p-4 text-primary-400">
          <div>
            <button className="ico-lg text-primary-400" name="back">
              <div className="flex aspect-square items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </div>
            </button>
          </div>
          <motion.h1
            initial="exit"
            animate={control}
            variants={{
              enter: { y: 0, opacity: 1 },
              exit: { y: -30, opacity: 0 },
            }}
            transition={{
              delay: 1.5,
            }}
            className="self-end overflow-hidden text-ellipsis whitespace-nowrap text-center text-3xl font-medium"
          >
            Projects
          </motion.h1>
          <div></div>
        </header>
        <section className="h-full pt-4">
          <div className="whitespace-nowrap">
            <motion.article
              animate={control}
              initial="exit"
              variants={{
                enter: {
                  scale: 1.1,
                  opacity: 1,
                  transition: {
                    scale: {
                      delay: 2.5,
                      duration: 0.3,
                      ease: "easeOut",
                    },
                    opacity: {
                      delay: 1.2,
                    },
                  },
                },
                exit: {
                  scale: 0.9,
                  opacity: 0,
                },
              }}
              id="p1"
              className="relative z-10 inline-flex h-full w-full flex-col whitespace-normal rounded-3xl bg-secondary-400 bg-opacity-40 p-6 pt-2 shadow-sm backdrop-blur"
              draggable="false"
            >
              <span className="grid grid-cols-[auto_2rem] text-primary-100">
                <h4 className="self-center text-lg font-medium">
                  Uglier2Don&apos;t App
                </h4>
                <span className="relative">
                  <button className="ico-md text-primary-200">
                    <div className="flex aspect-square items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </div>
                  </button>
                </span>
              </span>
              <span>
                <h5 className="inline text-base text-primary-200">
                  <a className="underline" href="/pwa/projects/details/5">
                    Personal
                  </a>
                </h5>
                <label className="float-end rounded-sm bg-secondary-200 px-1 text-xs text-secondary-800">
                  LOW
                </label>
              </span>
              <div className="flex items-center justify-between justify-self-end pt-2 text-primary-800">
                <div className="flex items-end">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    className="mr-1 place-self-center"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="5.5"
                      className="origin-center -rotate-90 transition-[stroke-dashoffset] duration-500"
                      pathLength="100.01"
                      strokeWidth="11"
                      strokeDasharray="100 100"
                      strokeDashoffset="50"
                    ></circle>
                  </svg>
                  <div className="h-8 overflow-hidden text-3xl leading-8">
                    <div className="text-right">
                      <p>50</p>
                    </div>
                  </div>
                  %
                </div>
                <div className="grid grid-cols-2">
                  <span className="row-span-2 place-self-end pr-1 text-[2rem] leading-8">
                    1
                  </span>
                  <div className="row-span-1 self-center text-xs leading-3">
                    Pending
                  </div>
                  <div className="row-span-1 text-xs leading-3">Tasks</div>
                </div>
                <div className="grid grid-cols-2">
                  <span className="row-span-2 place-self-end pr-1 text-[2rem] leading-8">
                    10
                  </span>
                  <div className="row-span-1 self-center whitespace-nowrap text-xs leading-3">
                    Months To
                  </div>
                  <div className="row-span-1 text-xs leading-3">Deadline</div>
                </div>
              </div>
            </motion.article>
          </div>
          <div>
            <motion.article
              animate={control}
              initial="exit"
              variants={{
                enter: {
                  y: -8,
                  opacity: 1,
                  transition: {
                    y: { delay: 2.5 },
                    opacity: { delay: 1.4 },
                  },
                },
                exit: {
                  y: 8,
                  opacity: 0,
                },
              }}
              id="p1"
              className="relative px-4"
            >
              <div
                className="rounded-3xl bg-gray-100 bg-opacity-50 p-6 pt-2 backdrop-blur-md"
                aria-selected="false"
                draggable="false"
              >
                <span className="grid grid-cols-[auto_2rem]">
                  <h4 className="self-center text-lg font-medium">UI / UX</h4>
                  <a href="/pwa/projects/details/1">
                    <button className="ico-md text-primary-700">
                      <div className="flex aspect-square items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </div>
                    </button>
                  </a>
                </span>
                <h5 className="text-base text-primary-600">
                  <a className="underline" href="/pwa/projects/details/5">
                    Personal
                  </a>{" "}
                  •{" "}
                  <a className="underline" href="/pwa/categories/details/1">
                    Uglier2Don&apos;t App
                  </a>
                </h5>
                <div className="flex items-center justify-between pt-2 text-primary-700">
                  <div className="flex items-end">
                    <div className="h-8 overflow-hidden text-3xl leading-8">
                      <div className="text-right">
                        <p>0</p>
                      </div>
                    </div>
                    %
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="row-span-2 place-self-end pr-1 text-[2rem] leading-8">
                      96
                    </span>
                    <div className="row-span-1 self-center text-xs leading-3">
                      Pending
                    </div>
                    <div className="row-span-1 text-xs leading-3">Tasks</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="row-span-2 place-self-end pr-1 text-[2rem] leading-8">
                      1
                    </span>
                    <div className="row-span-1 self-center whitespace-nowrap text-xs leading-3">
                      Week To
                    </div>
                    <div className="row-span-1 text-xs leading-3">Deadline</div>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function TaskPage() {
  const [played, setPlayState] = useState(false);
  const control = useAnimationControls();
  const transition = {
    duration: 1,
    delay: 1,
  };
  useEffect(() => {
    if (played) control.start("enter");
  }, [played]);
  return (
    <motion.div
      style={{ perspective: "40rem" }}
      className="flex flex-col gap-2 text-primary-100 text-opacity-70 md:hidden"
      initial="exit"
      onViewportEnter={() => setPlayState(true)}
      animate={control}
      transition={transition}
      variants={{
        enter: {
          perspectiveOrigin: "9rem -12rem",
        },
        exit: {
          perspectiveOrigin: "9rem 0rem",
        },
      }}
    >
      <motion.div
        className="h-36 w-full origin-bottom"
        transition={transition}
        variants={{
          enter: { transform: "translateZ(-9.5rem) rotateX(90deg)" },
        }}
      >
        <div
          className="grid gap-2 rounded-3xl p-6"
          style={{
            backgroundImage:
              "linear-gradient(-45deg, transparent -30%, rgba(255,255,255,.4) 10%, transparent 110%)",
          }}
        >
          <span className="grid grid-cols-[auto_2rem]">
            <h4 className="font-medium">Say Less Than Necessary</h4>
          </span>
          <h5 className="text-base text-primary-400">
            <a className="underline" href="/pwa/projects/details/1">
              Survival Skills
            </a>{" "}
            •
            <a className="underline" href="/pwa/categories/details/1">
              Life
            </a>
          </h5>
          <div className="flex w-full gap-1 pb-4 text-sm">
            <p className="flex-grow text-xs text-primary-400">Oct 13</p>
            <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-zinc-400 bg-opacity-30 text-zinc-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <p className="size-6 flex-grow-0 rounded-md bg-error-600 bg-opacity-40 text-center align-middle text-error-300">
              H
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="h-36 w-full"
        transition={transition}
        animate={control}
        variants={{
          enter: { transform: "translateZ(-9rem)" },
        }}
      >
        <div
          className="grid h-full gap-2 rounded-3xl px-6 pt-4"
          style={{
            backgroundImage:
              "linear-gradient(-45deg, transparent -30%, rgba(255,255,255,.2) 10%, transparent 110%)",
          }}
        >
          <span className="grid grid-cols-[auto_2rem]">
            <h4 className="font-medium">Conceal Your Intentions</h4>
          </span>
          <h5 className="text-base text-primary-400">
            <a className="underline" href="/pwa/projects/details/1">
              Survival Skills
            </a>{" "}
            •
            <a className="underline" href="/pwa/categories/details/1">
              Life
            </a>
          </h5>
          <div className="flex w-full gap-1 pb-4 text-sm">
            <p className="flex-grow text-xs text-primary-400">Aug 28</p>
            <p className="size-6 flex-grow-0 rounded-md bg-error-600 bg-opacity-40 text-center align-middle text-error-300">
              H
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="h-36 w-full origin-bottom"
        transition={transition}
        animate={control}
        variants={{
          enter: { transform: "translateY(-9rem) rotateX(90deg)" },
        }}
      >
        <div
          className="grid h-full gap-2 rounded-3xl px-6 pt-4"
          style={{
            backgroundImage:
              "linear-gradient(-45deg, transparent -30%, rgba(255,255,255,.4) 10%, transparent 110%)",
          }}
        >
          <span className="grid grid-cols-[auto_2rem]">
            <h4 className="font-medium">Never Put Too Much Trust</h4>
          </span>
          <h5 className="text-base text-primary-400">
            <a className="underline" href="/pwa/projects/details/1">
              Survival Skills
            </a>{" "}
            •
            <a className="underline" href="/pwa/categories/details/1">
              Life
            </a>
          </h5>
          <div className="flex w-full gap-1 pb-4 text-sm">
            <p className="flex-grow text-xs text-primary-400">Sep 29</p>
            <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-zinc-400 bg-opacity-30 text-zinc-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <p className="size-6 flex-grow-0 rounded-md bg-error-600 bg-opacity-40 text-center align-middle text-error-300">
              H
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="h-36 w-full"
        transition={transition}
        animate={control}
        variants={{
          enter: { transform: "translateY(-9rem)" },
        }}
      >
        <div
          className="grid gap-2 rounded-3xl px-6 pt-4"
          style={{
            backgroundImage:
              "linear-gradient(-45deg, transparent -30%, rgba(255,255,255,.2) 10%, transparent 110%)",
          }}
        >
          <span className="grid grid-cols-[auto_2rem]">
            <h4 className="font-medium">Never Outshine the Master</h4>
          </span>
          <h5 className="text-base text-primary-400">
            <a className="underline" href="/pwa/projects/details/1">
              Survival Skills
            </a>{" "}
            •
            <a className="underline" href="/pwa/categories/details/1">
              Life
            </a>
          </h5>
          <div className="flex w-full gap-1 pb-4 text-sm">
            <p className="flex-grow text-xs text-primary-400">Aug 30, 2025</p>
            <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-zinc-400 bg-opacity-30 text-zinc-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="18" r="3"></circle>
                <circle cx="6" cy="6" r="3"></circle>
                <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                <line x1="6" y1="9" x2="6" y2="21"></line>
              </svg>
            </div>
            <p className="size-6 flex-grow-0 rounded-md bg-error-600 bg-opacity-40 text-center align-middle text-error-300">
              H
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
