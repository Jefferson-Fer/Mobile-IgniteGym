import { Heading, HStack, Text, VStack } from "native-base";

type Props = {
  title: string;
  subtitle: string;
};

const HistoryCard = ({ title, subtitle }: Props) => {
  return (
    <HStack
      background={"gray.600"}
      rounded={"md"}
      px={5}
      py={4}
      mb={2}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <VStack mx={3} flex={1}>
        <Heading
          color={"white"}
          fontSize={"md"}
          textTransform={"capitalize"}
          fontFamily={"heading"}
          numberOfLines={1}
        >
          {title}
        </Heading>
        <Text color={"gray.200"} fontSize={"lg"} numberOfLines={1}>
          {subtitle}
        </Text>
      </VStack>
      <Text color={"gray.300"} fontSize={"md"}>
        08:56
      </Text>
    </HStack>
  );
};

export default HistoryCard;
