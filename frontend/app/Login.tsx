import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword  } from 'firebase/auth';
import { TouchableOpacity, TextInput, Alert, View, Text, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    
    const handleSubmit = async () => {
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                Alert.alert("Login Succesful!");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                Alert.alert("Signup Succesful!");
            }
        } catch(error : any) {
            Alert.alert('Login failed', error.message);
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>
            <TextInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  style={styles.input}
                  placeholderTextColor="#000000ff"
            />
            <TextInput
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                  style={styles.input}
                  placeholderTextColor="#000000ff"
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.button}> 
                <Text>{isLogin ? "Don't have an Account? Sign up." : "Have an account? Login."}
                    </Text> 
            </TouchableOpacity>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 40
    },
    input: {
        margin: 5,
        borderWidth: 1,
    },
    button: {
        marginTop: 5,
        backgroundColor: '#1672c9ff',
        borderRadius: 5,
        padding: 5
    }
})