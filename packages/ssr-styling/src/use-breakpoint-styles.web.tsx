import { useState } from "react";
import { useWindowDimensions } from "react-native";

import styleResolver from "react-native-web/dist/exports/StyleSheet/styleResolver";
import createCompileableStyle from "react-native-web/dist/exports/StyleSheet/createCompileableStyle";
import i18nStyle from "react-native-web/dist/exports/StyleSheet/i18nStyle";
import { atomic } from "react-native-web/dist/exports/StyleSheet/compile";

import hash from "./hash";
import {
  ComponentStyle,
  findStylesForBreakpoint,
  normaliseBreakpointHookInput,
  useHasReactHydrated,
} from "./utilities";

export function useBreakpointStyles<T extends ComponentStyle>(
  parameters: Record<string | number, T> | Array<T>
) {
  const hasHydrated = useHasReactHydrated();

  const cache = getCache();

  const breakpointRecord = normaliseBreakpointHookInput(parameters);
  const breakpoints = Object.keys(breakpointRecord);

  // Work out the styles to be used during SSR and first render of web
  const [initialStyles] = useState<T>(() => {
    const varibleStyles = {} as T;

    // If a new component is created after hydration - we don't need to do this logic
    if (hasHydrated) {
      return varibleStyles;
    }

    const id = hash(JSON.stringify(breakpointRecord));

    const cacheHit = cache.get(id);

    if (cacheHit) {
      return cacheHit as T;
    }

    for (const [index, breakpoint] of breakpoints.entries()) {
      const styles = breakpointRecord[breakpoint];
      let rootStyles: string = "";

      for (const [property, value] of Object.entries(styles)) {
        const key = `rnv-${id}-${property}`;
        varibleStyles[property as keyof T] =
          `var(--${key})` as unknown as T[keyof T];

        // On the server, we need to ensure that we append the same
        // styles that RNW will generate
        if (typeof window === "undefined") {
          const compiledCSS = atomic(
            createCompileableStyle(i18nStyle({ [property]: value }))
          );
          const compiledValue = Object.values(compiledCSS)[0].value;
          rootStyles += `--${key}: ${compiledValue};`;
        }
      }

      // Force these styles into the RNW stylesheet
      if (typeof window === "undefined") {
        if (index < breakpoints.length - 1) {
          const nextBreakpoint = breakpoints[index + 1];
          styleResolver.sheet.insert(
            `@media (min-width: ${breakpoint}px) and (max-width: ${nextBreakpoint}px) { :root { ${rootStyles}  } }`,
            0
          );
        } else {
          styleResolver.sheet.insert(
            `@media (min-width: ${breakpoint}px) { :root { ${rootStyles}  } }`,
            0
          );
        }
      }
    }

    cache.set(id, varibleStyles);

    return varibleStyles;
  });

  const { width } = useWindowDimensions();

  // Once we have hydrated, we just use normal style objects
  if (hasHydrated) {
    return findStylesForBreakpoint(width, breakpointRecord);
  }

  return initialStyles;
}

const cacheKey = Symbol();
const browserCache = new Map();

// Add out cache on the stylesheet, as multiple stylesheets may be created
function getCache(): Map<string, ComponentStyle> {
  if (typeof window === "undefined") {
    const sheet: any = styleResolver.sheet;
    if (!sheet[cacheKey]) {
      sheet[cacheKey] = new Map();
    }

    return sheet[cacheKey];
  }

  return browserCache;
}
