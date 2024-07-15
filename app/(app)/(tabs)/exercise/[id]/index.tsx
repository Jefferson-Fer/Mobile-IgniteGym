import { useLocalSearchParams } from "expo-router";
import {
  Box,
  HStack,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";

import Button from "@/components/Button/Index";
import ExerciseHeader from "@/components/Header/ExerciseHeader";
import Loading from "@/components/Loading";
import { ExerciseDTO } from "@/dtos/ExerciseDTO";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppErros";

import RepetitionsSvg from "../../../../../assets/app/repetitions.svg";
import SeriesSvg from "../../../../../assets/app/series.svg";

const Exercise = () => {
  const [exercise, setExercise] = useState<ExerciseDTO>();
  const [isLoading, setIsloading] = useState(true);
  const [submittingHistoryRegister, setSubmittingHistoryRegister] =
    useState(false);

  const toast = useToast();

  const local = useLocalSearchParams();

  const fecthExercise = async () => {
    try {
      setIsloading(true);
      const response = await api.get(`/exercises/${local.id}`);

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
      setIsloading(false);
    }
  };

  const handleExerciseHistoryRegister = async () => {
    try {
      setSubmittingHistoryRegister(true);

      await api.post("/history", {
        exercise_id: exercise?.id,
      });

      toast.show({
        title: "Exercício salvo em seu histórico",
        placement: "top",
        backgroundColor: "green.700",
      });
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
      setSubmittingHistoryRegister(false);
    }
  };

  useEffect(() => {
    fecthExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local.id]);

  return (
    <VStack flex={1} bg={"gray.700"}>
      <ExerciseHeader
        title={isLoading ? "" : exercise ? exercise.name : ""}
        subtitle={isLoading ? "" : exercise ? exercise.group : ""}
      />

      <ScrollView>
        {isLoading ? (
          <Loading />
        ) : (
          <VStack p={8}>
            <Box rounded={"lg"} mb={3} overflow={"hidden"}>
              <Image
                source={{
                  uri: `${api.defaults.baseURL}/exercise/demo/${exercise?.demo}`,
                }}
                alt="Imagem de exercício"
                w={"full"}
                h={80}
                mb={3}
                resizeMode={"cover"}
                rounded={"lg"}
              />
            </Box>

            <Box background={"gray.600"} rounded={"md"} pb={4} px={4}>
              <HStack
                alignItems={"center"}
                justifyContent={"space-around"}
                mb={6}
                mt={5}
              >
                <HStack>
                  <SeriesSvg />
                  <Text color={"gray.200"} ml={2}>
                    {exercise?.series} séries
                  </Text>
                </HStack>
                <HStack>
                  <RepetitionsSvg />
                  <Text color={"gray.200"} ml={2}>
                    {exercise?.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button
                title="Marcar como realizado"
                isLoading={submittingHistoryRegister}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        )}
      </ScrollView>
    </VStack>
  );
};

export default Exercise;
