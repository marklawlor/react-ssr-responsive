import { useContext, createContext, PropsWithChildren } from "react";

interface BreakpointContext {
  breakpoints: number[];
}

const BreakpointContext = createContext<BreakpointContext>({
  breakpoints: [800, 1200, 1800],
});

export function BreakpointProvider({
  children,
  ...props
}: PropsWithChildren<BreakpointContext>) {
  return (
    <BreakpointContext.Provider value={props}></BreakpointContext.Provider>
  );
}

export function useBreakpoints() {
  return useContext(BreakpointContext).breakpoints;
}
