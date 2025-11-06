import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Assistant from "../../components/Assistant";
import {Text} from 'react-native';

export default function Chat() {
  return (
    <PaperProvider>
      <Text>Hello</Text>
    </PaperProvider>
  );
}
