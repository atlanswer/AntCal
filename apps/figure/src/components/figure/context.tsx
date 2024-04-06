// @refresh granular

import { proxy, wrap, type Remote } from "comlink";
import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
  type ParentComponent,
} from "solid-js";
import { z } from "zod";
import type { PyodideWorker } from "~/workers/pyodide";
import { zViewPlaneConfig } from "~/workers/pyodide";
import PyodideWebWorker from "~/workers/pyodide?worker";

export const zFigureConfig = zViewPlaneConfig
  .omit({ cutPlane: true })
  .extend({ title: z.string() });
export type FigureConfig = z.infer<typeof zFigureConfig>;
export const zFigureConfigs = z.array(zFigureConfig);
export type FigureConfigs = z.infer<typeof zFigureConfigs>;

/** Global Pyodide worker */
const PyodideWorkerContext =
  createContext<[Promise<Remote<PyodideWorker>>, Accessor<string>]>();

export const usePyodideWorker = () => {
  const context = useContext(PyodideWorkerContext);
  if (!context) {
    throw new Error("usePyodide: `PyodideWorkerContext` not found");
  }
  return context;
};

export const PyodideWorkerProvider: ParentComponent = (props) => {
  const pyodideWebWorker = new PyodideWebWorker();
  const RemotePyodideWorker = wrap<typeof PyodideWorker>(pyodideWebWorker);

  const [progress, setProgress] = createSignal("0%");

  const pyodideWebWorkerReady = new Promise(
    (resolve: (value: Worker) => void, reject) => {
      pyodideWebWorker.addEventListener("error", reject);
      pyodideWebWorker.addEventListener(
        "message",
        (msg: MessageEvent<string>) => {
          pyodideWebWorker.removeEventListener("error", reject);
          msg.data === "ready" ? resolve(pyodideWebWorker) : reject();
        },
        { once: true },
      );
    },
  );

  const remotePyodideWorkerReady = new Promise(
    (
      resolve: (value: InstanceType<typeof RemotePyodideWorker>) => void,
      reject,
    ) => {
      pyodideWebWorkerReady.then(
        () =>
          resolve(
            new RemotePyodideWorker(
              proxy((progress: string) => setProgress(progress)),
            ),
          ),
        () => reject(),
      );
    },
  );

  const pyodideWorkerReady = new Promise(
    (resolve: (value: Remote<PyodideWorker>) => void, reject) => {
      remotePyodideWorkerReady.then(
        (value) => resolve(value),
        () => reject(),
      );
    },
  );

  return (
    <PyodideWorkerContext.Provider value={[pyodideWorkerReady, progress]}>
      {props.children}
    </PyodideWorkerContext.Provider>
  );
};
