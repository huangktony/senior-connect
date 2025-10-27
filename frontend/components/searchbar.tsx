import React, { useState } from "react";
import { View } from "react-native";

export default function SearchBar() {
  const [q, setQ] = useState("");

  return (
    <View style={{ flex: 1, paddingTop: 56, paddingHorizontal: 16 }}>
      <SearchBar
        value={q}
        onChangeText={setQ}
        onSubmit={(text: string) => { /* ... */ }}
        placeholder="Search…"
        debounceMs={300}
        loading={false}
      />
    </View>
  );
}