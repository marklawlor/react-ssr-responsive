import { View, Text } from "react-native";
import { useBreakpointStyles } from "ssr-styling";

export default function Web() {
  const responsiveStyles = useBreakpointStyles([
    {
      backgroundColor: "yellow",
    },
    {
      backgroundColor: "green",
      border: "10px solid blue",
    },
    {
      backgroundColor: "red",
    },
  ]);

  return (
    <View style={responsiveStyles}>
      <Text>Resize the window</Text>
    </View>
  );
}
