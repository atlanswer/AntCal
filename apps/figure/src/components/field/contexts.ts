import { createSignal } from "solid-js";

export const [errBadge, setErrBadge] = createSignal<{
  err: string;
  detail: string;
}>();
