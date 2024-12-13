"use client";
import dynamic from "next/dynamic";

export const runtime = "edge";

export default dynamic(() => import("../../page"), { ssr: false });
