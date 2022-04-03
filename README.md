# React SSR Responsive Demo

> This project is archived as I believe there are now better ways to do this. Please try https://github.com/marklawlor/tailwindcss-react-native which offers breakpoints and many more features using the TailwindCSS style language 

This experiment takes a different approach to responsive styling for React Native Web apps who use Server Side Rendering.

[DEMO](https://react-ssr-responsive.vercel.app/)

If you just interested in the code, look at the `ssr-styling` package under `packages/`

## Usage

### Basic example

```jsx
import { View, Text } from "react-native";
import { useBreakpointStyles } from "ssr-styling";

export const MyComponent = () => {
  const responsiveStyles = useBreakpointStyles([
    {
      backgroundColor: "yellow",
    },
    {
      backgroundColor: "green",
      border: "10px solid blue", // The border will only appear for this breakpoint
    },
    {
      backgroundColor: "red",
    },
  ]);

  return (
    <>
      <View style={responsiveStyles}>
        <Text>Resize me</Text>
      </View>
    </>
  );
};
```

### Complex example

```jsx
import { View, Text } from "react-native";
import { useBreakpointStyles } from "ssr-styling";

export const MyComponent = () => {
  const usingBreakpointArray = useBreakpointStyles([
    {
      backgroundColor: "yellow",
    },
    {
      backgroundColor: "green",
      border: "10px solid blue", // The border will only appear for this breakpoint
    },
    {
      backgroundColor: "red",
    },
  ]);

  return (
    <>
      <View style={usingBreakpointArray}>
        <Text>This container is styled using the default breakpoints</Text>
      </View>

      <BreakpointProvider breakpoints={[500, 1000, 1500]}
        <View style={usingBreakpointArray}>
          <Text>This container is styled using custom breakpoints</Text>
        </View>
      </BreakpointProvider>
    </>
  );
};

export const MyComponent2 = () => {
  const usingExplictBreakpoints = useBreakpointStyles({
    600: {
      backgroundColor: "yellow",
    },
    1200: {
      backgroundColor: "green",
      border: "10px solid blue", // The border will only appear for this breakpoint
    },
    1800: {
      backgroundColor: "red",
    },
  });

  return (
    <>
      <View style={usingExplictBreakpoints}>
        <Text>This container is styled using the breakpoints provided via the hook</Text>
      </View>
    </>
  );
};
```

## Details

### Server Rendering

When rendering on the server, the component's styles are replaced with CSS custom properties. Media queries are generated for the breakpoints and output the CSS for the customn properties.

### Web Rendering

#### Pre-hydration

Component styles are rendered using utilising CSS custom properties.

The user needs to ensure the values are exactly the same on to ensure the custom properties match.

#### Post-hydration

Component styles are rendered using style objects and can be dynamic.

### Native Rendering

Component styles are rendered using style objects and can be dynamic.

## How is this different from other solutions

Solutions like [react-native-responsive-query](https://github.com/intergalacticspacehighway/react-native-responsive-query) write media queries for all styles - even after hydration. This experiment bypasses that logic by defaulting to native behaviour after hydration.

## Custom Breakpoints

You can customise the breakpoints by using the `breakpointProvider`

```jsx
import { BreakpointProvider } from "ssr-styling";

export const MyComponent = () => {
  return (
    <BreakpointProvider breakpoints={[800, 1200, 1800]}
  );
};
```
