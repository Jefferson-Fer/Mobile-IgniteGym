import {
  FormControl,
  IInputProps,
  Input as NativeBaseInput,
} from "native-base";

type InputProps = IInputProps & {
  errorMessage?: string | null;
};

const Input = ({ errorMessage = null, isInvalid, ...props }: InputProps) => {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        bg="gray.700"
        h={14}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        placeholderTextColor="gray.300"
        _focus={{
          bg: "gray.700",
          borderWidth: "1",
          borderColor: "green.500",
        }}
        {...props}
      />

      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
};

export default Input;
