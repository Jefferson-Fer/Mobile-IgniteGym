import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { FlatList, Heading, HStack, Text, useToast, VStack } from "native-base";
import { useCallback, useState } from "react";

import ExerciseCard from "@/components/Card/ExerciseCard";
import Group from "@/components/Group";
import HomeHeader from "@/components/Header/HomeHeader";
import Loading from "@/components/Loading";
import { ExerciseDTO } from "@/dtos/ExerciseDTO";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppErros";

export default function Index() {
  const groups = ["Pernas", "Bíceps", "Costas", "Ombros"];
  const [exercise, setExercise] = useState<ExerciseDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState("Pernas");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const fecthExercisesByGroup = async (group: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/exercises/bygroup/${group.toLocaleLowerCase()}`,
      );
      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível carregar os grupos";

      toast.show({
        title,
        placement: "top",
        backgroundColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fecthExercisesByGroup(groupSelected);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupSelected]),
  );

  return (
    <VStack bg={"gray.700"} flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        my={10}
        _contentContainerStyle={{ px: 8 }}
        maxH={10}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack alignItems={"center"} justifyContent={"space-between"} mb={5}>
            <Heading color={"gray.200"} fontFamily={"heading"} fontSize={"md"}>
              Exercícios
            </Heading>
            <Text color={"gray.200"} fontSize={"sm"}>
              {exercise.length}
            </Text>
          </HStack>

          <FlatList
            data={exercise}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <ExerciseCard
                title={item.name}
                subtitle={`${item.series} séries x ${item.repetitions} repetições`}
                image={item.thumb}
                onPress={() => router.navigate(`/exercise/${item.id}/`)}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 10 }}
          />
        </VStack>
      )}
    </VStack>
  );
}
