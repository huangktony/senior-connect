import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';

interface props {
    elderEmail: string
}

export default function ElderCreateAccount({ elderEmail }: props) {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1 = Elder Info, 2 = Caregiver Info
    
    // Elder form data
    const [elderFormData, setElderFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });
    
    // Caregiver form data
    const [caregiverFormData, setCaregiverFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const updateElderField = (field: string, value: string) => {
        setElderFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateCaregiverField = (field: string, value: string) => {
        setCaregiverFormData(prev => ({ ...prev, [field]: value }));
    };

    // Step 1: Update Elder's personal info
    const handleElderSubmit = async () => {
        // Validate elder form
        if (!elderFormData.firstName || !elderFormData.lastName || !elderFormData.zipCode) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/users/${encodeURIComponent(elderEmail)}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName: elderFormData.firstName,
                        lastName: elderFormData.lastName,
                        phoneNumber: elderFormData.phoneNumber,
                        address: elderFormData.address,
                        city: elderFormData.city,
                        state: elderFormData.state,
                        zipCode: elderFormData.zipCode,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update elder info");
            }

            console.log("Elder info updated successfully");
            setStep(2); // Move to caregiver form
        } catch (error) {
            console.error("Error updating elder:", error);
            Alert.alert("Error", "Failed to save elder information");
        }
    };

    // Step 2: Create Caregiver and finalize elder
    const handleCaregiverSubmit = async () => {
        // Validate caregiver form
        if (!caregiverFormData.email || !caregiverFormData.firstName || !caregiverFormData.lastName) {
            Alert.alert("Error", "Please fill in all required caregiver fields");
            return;
        }

        try {
            // Create caregiver account
            const caregiverResponse = await fetch(
                "http://127.0.0.1:5000/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: caregiverFormData.email,
                        firstName: caregiverFormData.firstName,
                        lastName: caregiverFormData.lastName,
                        phoneNumber: caregiverFormData.phoneNumber,
                        address: caregiverFormData.address,
                        city: caregiverFormData.city,
                        state: caregiverFormData.state,
                        zipCode: caregiverFormData.zipCode,
                        type: "senior",
                        elderEmail: elderEmail, // Link to elder
                        hasInfo: true
                    }),
                }
            );
            if (!caregiverResponse.ok) {
                throw new Error("Failed to create caregiver account");
            }

            // Update elder to mark setup as complete
            const elderUpdateResponse = await fetch(
                `http://127.0.0.1:5000/users/${encodeURIComponent(elderEmail)}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        hasInfo: true,
                        caregiverEmail: caregiverFormData.email
                    }),
                }
            );

            if (!elderUpdateResponse.ok) {
                throw new Error("Failed to finalize elder account");
            }

            console.log("Setup complete!");
            Alert.alert("Success", "Account setup complete!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/(elderTabs)")
                }
            ]);
        } catch (error) {
            console.error("Error creating caregiver:", error);
            Alert.alert("Error", "Failed to create caregiver account");
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1); // Go back to elder form
        }
    };

    const handleNext = () => {
        if (step === 1) {
            handleElderSubmit(); // Submit elder info and move to step 2
        } else {
            handleCaregiverSubmit(); // Submit caregiver info and complete setup
        }
    };

    const currentFormData = step === 1 ? elderFormData : caregiverFormData;
    const updateField = step === 1 ? updateElderField : updateCaregiverField;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#8B4789" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarEmoji}>👴</Text>
                        </View>
                        <Text style={styles.logoText}>opal</Text>
                    </View>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.title}>
                        {step === 1 ? "Elder Create Account (Step 1 of 2)" : "Caregiver Create Account (Step 2 of 2)"}
                    </Text>

                    {step === 2 && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Caregiver Email *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. ajv@gmail.com"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={caregiverFormData.email}
                                onChangeText={(text) => updateCaregiverField('email', text)}
                            />
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>First Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. James"
                            placeholderTextColor="#999"
                            value={currentFormData.firstName}
                            onChangeText={(text) => updateField('firstName', text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Last Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. John"
                            placeholderTextColor="#999"
                            value={currentFormData.lastName}
                            onChangeText={(text) => updateField('lastName', text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 832-486-7123"
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            value={currentFormData.phoneNumber}
                            onChangeText={(text) => updateField('phoneNumber', text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 1234 Street Field"
                            placeholderTextColor="#999"
                            value={currentFormData.address}
                            onChangeText={(text) => updateField('address', text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Austin"
                            placeholderTextColor="#999"
                            value={currentFormData.city}
                            onChangeText={(text) => updateField('city', text)}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, styles.halfWidth]}>
                            <Text style={styles.label}>State</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="TX"
                                placeholderTextColor="#999"
                                maxLength={2}
                                autoCapitalize="characters"
                                value={currentFormData.state}
                                onChangeText={(text) => updateField('state', text.toUpperCase())}
                            />
                        </View>

                        <View style={[styles.inputGroup, styles.halfWidth]}>
                            <Text style={styles.label}>Zip Code *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="12345"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                maxLength={5}
                                value={currentFormData.zipCode}
                                onChangeText={(text) => updateField('zipCode', text)}
                            />
                        </View>
                    </View>

                    {step === 1 && (
                        <View style={styles.extraContact}>
                            <Text style={styles.extraContactTitle}>Next: Add a caregiver</Text>
                            <Text style={styles.extraContactSubtitle}>
                                In the next step, you'll add a caregiver who will have access to help manage your account
                            </Text>
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.backButton, step === 1 && styles.disabledButton]} 
                            onPress={handleBack}
                            activeOpacity={0.8}
                            disabled={step === 1}
                        >
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.nextButton} 
                            onPress={handleNext}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.nextButtonText}>
                                {step === 1 ? "Next" : "Complete Setup"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: '#8B4789',
        paddingVertical: 24,
        paddingHorizontal: 24,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E89B6C',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarEmoji: {
        fontSize: 32,
    },
    logoText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontStyle: 'italic',
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '400',
        color: '#999999',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 18,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#000000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },
    extraContact: {
        marginTop: 24,
        marginBottom: 32,
    },
    extraContactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    extraContactSubtitle: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    backButton: {
        backgroundColor: '#8B4789',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
        minWidth: 100,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
        opacity: 0.6,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#E89B6C',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
        minWidth: 100,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});