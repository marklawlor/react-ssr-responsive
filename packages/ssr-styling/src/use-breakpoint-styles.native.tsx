import { useWindowDimensions } from "react-native";

import {
  ComponentStyle,
  findStylesForBreakpoint,
  normaliseBreakpointHookInput,
} from "./utilities";

export function useBreakpointStyles<T extends ComponentStyle>(
  parameters: Record<string | number, T> | Array<T>
) {
  const { width } = useWindowDimensions();
  const breakpointStyles = normaliseBreakpointHookInput(parameters);

  return findStylesForBreakpoint(width, breakpointStyles);
}
