import { IPressableProps, Pressable, Text } from "native-base";

type Props = IPressableProps & {
  name: string;
  isActive: boolean;
};

const Group = ({ name, isActive, ...props }: Props) => {
  return (
    <Pressable
      mr={3}
      w={24}
      h={10}
      bg={"gray.600"}
      rounded={"md"}
      justifyContent={"center"}
      alignItems={"center"}
      overflow={"hidden"}
      isPressed={isActive}
      _pressed={{
        borderColor: "green.500",
        borderWidth: "1",
      }}
      {...props}
    >
      <Text
        color={isActive ? "green.500" : "gray.200"}
        textTransform={"uppercase"}
        fontSize={"xs"}
        fontWeight={"bold"}
      >
        {name}
      </Text>
    </Pressable>
  );
};

export default Group;
