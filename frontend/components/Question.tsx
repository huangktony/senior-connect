import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";

export default function Question(props: QuestionProps) {
    return (
        <>
            <Text style={styles.inputTilte}>{props.question}:</Text>
            <TextInput 
                key = {props.id}
                onChangeText={newText => props.onChange(newText)}
                defaultValue={props.value}
                placeholder={props.emptyText}
                style={styles.input} />
        </>
    );
}

const styles = StyleSheet.create({
    inputTilte: {
        fontSize: 24
    },
    input: {
        padding: 4,
        fontSize: 20,
        borderColor: 'black',
        borderWidth: 1
    }
});
type Operation = (a: string) => void;
interface QuestionProps {
    question: string;
    emptyText: string;
    value: string;
    id: string;
    onChange: Operation;
}
