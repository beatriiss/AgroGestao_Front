import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import GlobalStyles from "../../styles/global";
import palette from "../../styles/palette";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react"
import { showFlashMessage } from './../Message';
import FlashMessage from "react-native-flash-message";

export function ModalPassword({ editable, handleClose }) {
    const { currentUser } = useAuth()
    const [password, setPassword] = useState("")

    const confirmPassword = () => {
        if (password == currentUser.senha) {
            editable()
            handleClose()
        } else {
            showFlashMessage('Senha incorreta!', 'warning');
            
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={GlobalStyles.textButton}>Confirme sua senha!</Text>

                <TextInput
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    style={[GlobalStyles.input, styles.input]}
                />

                <View style={styles.buttons}>
                <TouchableOpacity style={[GlobalStyles.primaryButton, styles.button, {backgroundColor:palette.danger}]} onPress={handleClose}>
                    <Text style={GlobalStyles.textButton}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[GlobalStyles.primaryButton, styles.button]} onPress={confirmPassword}>
                    <Text style={GlobalStyles.textButton}>Confirmar</Text>
                </TouchableOpacity>

                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(24, 24, 24, 0.6)",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    content: {
        backgroundColor: palette.highlightGreen,
        width: `93%`,
        padding: 24,
        alignItems: `center`,
        justifyContent: `center`,
        borderRadius: 8, 
        marginTop: -70
    },
    input: {
        backgroundColor: '#fff',
        margin: 15
    },
    buttons: {
        flexDirection: 'row',
        width: '50%',
        justifyContent: 'center'
    },
    button: {
        width: '60%', 
        marginHorizontal: 40
    }
})