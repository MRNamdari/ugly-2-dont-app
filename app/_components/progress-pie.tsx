export default function ProgressPie(props: { progress: number }) {
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
          strokeDashoffset={`${100 - props.progress}`}
        ></circle>

        <polyline
          className="stroke-secondary-100 transition-[stroke-dashoffset] delay-500"
          pathLength="1"
          strokeDasharray="1 1"
          strokeDashoffset={props.progress === 100 ? "0" : "1"}
          strokeWidth={2}
          strokeLinecap="round"
          points="6.1 10.9 9.1 13.9 15.7 7.3"
        ></polyline>
      </svg>
      <div className="text-3xl leading-8">{props.progress.toFixed(0)}</div>%
    </div>
  );
}
