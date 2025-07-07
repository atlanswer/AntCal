import { createSignal } from "solid-js";

export const [debugText, setDebugText] = createSignal("Debug info");
export const [errBadge, setErrBadge] = createSignal<{
  err: string;
  detail: string;
}>();
