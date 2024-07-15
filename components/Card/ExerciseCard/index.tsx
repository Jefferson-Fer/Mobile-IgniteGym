import { MaterialIcons } from "@expo/vector-icons";
import { Heading, HStack, Icon, Image, Text, VStack } from "native-base";
import { Pressable, PressableProps } from "react-native";

import { api } from "@/services/api";

type Props = PressableProps & {
  title: string;
  subtitle: string;
  image: string;
};

const ExerciseCard = ({ title, subtitle, image, ...props }: Props) => {
  return (
    <Pressable {...props}>
      <HStack
        alignItems={"center"}
        background={"gray.600"}
        p={3}
        rounded={"md"}
        mb={2}
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${image}`,
          }}
          w={16}
          h={16}
          alt="Imagem do Exercício"
          rounded={"md"}
          resizeMode={"cover"}
        />
        <VStack flex={1} mx={4}>
          <Heading fontSize={"lg"} color={"white"} fontFamily={"heading"}>
            {title}
          </Heading>
          <Text fontSize={"sm"} color={"gray.300"} numberOfLines={2}>
            {subtitle}
          </Text>
        </VStack>
        <Icon
          as={MaterialIcons}
          name={"chevron-right"}
          size={7}
          color={"gray.300"}
        />
      </HStack>
    </Pressable>
  );
};

export default ExerciseCard;
