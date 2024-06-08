/* @refresh granular */

import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";

export const ErrorPage = (
  err: { toString: () => string },
  reset: () => void,
) => (
  <main class="grid flex-auto place-content-center p-8">
    <Title>Error Encountered - AntCal</Title>
    <div class="grid w-fit min-w-48 grid-flow-row place-content-center place-items-center gap-4 rounded bg-red-100 p-4 text-red-500 outline outline-red-500">
      <h1 class="text-lg font-bold">This app has encountered an error:</h1>
      <code class="text-center">{err.toString()}</code>
      <div class="flex gap-4 *:rounded *:px-4 *:py-2 *:text-white">
        <button class="bg-red-500 hover:bg-red-400" onClick={reset}>
          Reload Application
        </button>
        <A class="bg-blue-500 hover:bg-blue-400" href="/" end>
          Back Home
        </A>
      </div>
    </div>
  </main>
);
