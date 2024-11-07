import { motion } from "framer-motion";

export default function ProgressPie(props: { progress: number }) {
  const n = isNaN(props.progress) ? 0 : Math.round(props.progress);
  return (
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
          pathLength={100.01}
          strokeWidth={11}
          strokeDasharray="100 100"
          strokeDashoffset={`${100 - n}`}
        ></circle>

        <polyline
          className="stroke-secondary-100 transition-[stroke-dashoffset] delay-500"
          pathLength="1"
          strokeDasharray="1 1"
          strokeDashoffset={n === 100 ? "0" : "1"}
          strokeWidth={2}
          strokeLinecap="round"
          points="6.1 10.9 9.1 13.9 15.7 7.3"
        ></polyline>
      </svg>
      <div className="h-8 overflow-hidden text-3xl leading-8">
        <motion.div
          className="text-right"
          animate={{ translateY: -n * 32 }}
          transition={{ type: "spring", damping: 18 }}
        >
          <Percentage />
        </motion.div>
      </div>
      %
    </div>
  );
}

function Percentage() {
  return new Array(101).fill(0).map((_, i) => <p key={i}>{i}</p>);
}
