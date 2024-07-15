import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Heading, HStack, Icon, Text, VStack } from "native-base";
import { Pressable } from "react-native";

type Props = {
  title: string;
  subtitle: string;
};

const ExerciseHeader = ({ title, subtitle }: Props) => {
  return (
    <VStack background={"gray.600"} px={8} pt={12}>
      <Pressable onPress={() => router.back()}>
        <Icon
          as={MaterialIcons}
          name={"arrow-back"}
          size={7}
          color={"green.500"}
        />
      </Pressable>

      <HStack
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={4}
        mb={8}
      >
        <Heading
          color={"white"}
          fontSize={"lg"}
          flexShrink={1}
          fontFamily={"heading"}
        >
          {title}
        </Heading>
        <HStack alignItems={"center"} ml={4}>
          <Icon as={MaterialIcons} name="accessibility-new" size={5} />
          <Text color={"gray.200"} textTransform={"capitalize"}>
            {subtitle}
          </Text>
        </HStack>
      </HStack>
    </VStack>
  );
};

export default ExerciseHeader;
