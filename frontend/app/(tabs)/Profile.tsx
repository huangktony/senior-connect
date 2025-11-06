import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import ElderProfile from "../../components/ElderProfile";
import {Text} from 'react-native';

export default function Profile() {
  return (
    <PaperProvider>
      <ElderProfile />
    </PaperProvider>
  );
}
