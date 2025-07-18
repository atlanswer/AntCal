import { createSignal } from "solid-js";

export const [filename, setFilename] = createSignal("download");

export const [errBadge, setErrBadge] = createSignal<{
  err: string;
  detail: string;
}>();
