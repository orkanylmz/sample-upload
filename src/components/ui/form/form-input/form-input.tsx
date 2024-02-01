import { useController, useFormContext } from "react-hook-form";
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TextInputProps,
} from "react-native";

interface FormInputProps {
    name: string;
    label?: string;
    defaultValue?: string;
    error?: string;
}

type Props = FormInputProps & TextInputProps;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    inputContainer: {
        height: 70,
        backgroundColor: "white",
        borderRadius: 8,

        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: "space-evenly",
    },
    label: {
        color: "#222222",
        fontWeight: "bold",
    },
    error: {
        marginTop: 9,
        color: "red",
    },
});

export const FormInput = ({ name, label, error, ...props }: Props) => {
    const formContext = useFormContext();

    if (!formContext || !name) {
        const errorMessage = !name
            ? 'Form field must have a "name" prop'
            : "Form field must be a descendant of `FormProvider` as it uses `useFormContext`";
        console.warn(errorMessage);
        return null;
    }

    const { control } = formContext;

    const { field } = useController({
        control,
        name,
        defaultValue: props.defaultValue,
    });

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    {...props}
                    style={{ height: 30 }}
                    underlineColorAndroid="transparent"
                    placeholderTextColor="#95A3B3"
                    onBlur={field.onBlur}
                    onChangeText={field.onChange}
                />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
};
