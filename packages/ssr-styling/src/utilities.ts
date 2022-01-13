import { useEffect, useContext, createContext } from "react";
import { ViewStyle, TextStyle, ImageStyle } from "react-native";
import { useBreakpoints } from "./breakpoint-context";

export type ComponentStyle = ViewStyle | TextStyle | ImageStyle;

const hydratedContext = createContext({
  hydrated: false,
});

export function useHasReactHydrated() {
  const context = useContext(hydratedContext);

  // we don't want to re-render
  useEffect(() => {
    context.hydrated = true;
  }, []);

  return context.hydrated;
}

export function normaliseBreakpointHookInput<T extends ComponentStyle>(
  styleInput: Record<string | number, T> | Array<T>
): Record<string | number, T> {
  const breakpoints = useBreakpoints();

  const breakpointsWithZero = [0, ...breakpoints];

  return Array.isArray(styleInput)
    ? Object.fromEntries(
        styleInput.map(
          (style, index) => [breakpointsWithZero[index], style] as [number, T]
        )
      )
    : styleInput;
}

export function findStylesForBreakpoint<T extends ComponentStyle>(
  width: number,
  breakpointStyles: Record<string | number, T>
): T {
  const noStyles = {} as T;

  const sortedKeys = Object.keys(breakpointStyles).sort(
    (a, b) => Number.parseInt(a) - Number.parseInt(b)
  );

  if (sortedKeys.length === 0) {
    return noStyles;
  }

  const indexOfNextBreakpoint = sortedKeys.findIndex(
    (key) => Number.parseInt(key) > width
  );

  // No breakpoints match this width
  if (indexOfNextBreakpoint === 0) {
    return noStyles;
  }

  // All breakpoints are smaller than the width, so use the last one
  if (indexOfNextBreakpoint === -1) {
    const lastIndex = sortedKeys[sortedKeys.length - 1];
    return breakpointStyles[lastIndex];
  }

  const index = sortedKeys[indexOfNextBreakpoint - 1];
  return breakpointStyles[index];
}
