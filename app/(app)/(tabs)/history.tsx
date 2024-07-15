import { useFocusEffect } from "@react-navigation/native";
import { Heading, SectionList, Text, useToast, VStack } from "native-base";
import { useCallback, useState } from "react";

import HistoryCard from "@/components/Card/HistoryCard";
import ScreenHeader from "@/components/Header/ScreenHeader";
import Loading from "@/components/Loading";
import { HistoryByDayDTO } from "@/dtos/HistoryByDayDTO";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppErros";

const History = () => {
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  const fetchExercisesHistory = async () => {
    try {
      setIsLoading(true);

      const response = await api.get("/history");
      setExercises(response.data);
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
      fetchExercisesHistory();
    }, []),
  );

  return (
    <VStack flex={1} bg={"gray.700"}>
      <ScreenHeader title="Histórico de Exercícios" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryCard title={item.group} subtitle={item.name} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Heading
              fontSize={"md"}
              color={"gray.200"}
              mt={7}
              mb={2}
              fontFamily={"heading"}
            >
              {title}
            </Heading>
          )}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: "center" }
          }
          ListEmptyComponent={() => (
            <Text color={"gray.100"} textAlign={"center"}>
              Não há exercicios registrados ainda. {"\n"} Vamos fazer exercícios
              hoje?
            </Text>
          )}
          px={8}
          pb={5}
        />
      )}
    </VStack>
  );
};

export default History;
