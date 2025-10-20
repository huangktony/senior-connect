import React, { useState } from "react";
import { Text, View, StyleSheet, Button, Modal } from "react-native";
import Popup from "./Popup"

export default function Card(props: CardProps) {
    const [visible, setVisible] = useState(false);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.status}>Status: {props.status}</Text>
            <Text style={styles.description}>{props.body}</Text>
            <Button title = "Edit info"
                    onPress={() => setVisible(true)} />
            <Modal
                backdropColor="gray"
                visible={visible}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.popupContainer}>
                    <View style={styles.modal}>
                        <Button title="Close"
                                onPress={() => setVisible(false)}
                        />
                        <Popup></Popup> 
                    </View>
                </View>
            </Modal>
        </View>
    )
}
interface CardProps {
    title: string
    body: string;
    status: string;
    navigation: any;
    route: { params: { someData: string } };

}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 20,
        backgroundColor: "#ffffff",
    },
    title: {
        fontSize: 20,
        textAlign: "left"
    },
    status: {
        fontSize: 15,
        textAlign: "right",
    },
    description: {
        fontSize: 15,
        marginBottom: 2
    },
    popupContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    popupClose: {
        padding: 5
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: 300,
        elevation: 5,
    }
})