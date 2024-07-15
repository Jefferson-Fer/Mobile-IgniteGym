import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack,
} from "native-base";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import Button from "@/components/Button/Index";
import Input from "@/components/Input/Index";
import useAuth from "@/hooks/useAuth";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppErros";

import BackgroundImg from "../assets/app/background.png";
import LogoImg from "../assets/app/logo.svg";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const signupSchema = yup
  .object({
    name: yup.string().required("O campo nome é obrigatório"),
    email: yup
      .string()
      .required("O campo e-mail é obrigatório")
      .email("E-mail inválido"),
    password: yup
      .string()
      .required("O campo senha é obrigatório")
      .min(6, "O campo deve ter no mínimo 6 caracteres"),
    confirmPassword: yup
      .string()
      .required("O campo confirme a senha é obrigatório")
      .oneOf([yup.ref("password")], "A senha não confere"),
  })
  .required();

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signupSchema),
  });

  const onSubmitForm = async ({ name, email, password }: FormDataProps) => {
    try {
      setIsLoading(true);

      await api.post("/users", { name, email, password });
      await signIn(email, password);

      router.navigate("/(tabs)");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível criar a conta, tente novamente mais tarde";
      toast.show({
        title,
        placement: "top",
        bg: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg={"gray.700"}>
        <Image
          source={BackgroundImg}
          alt="pessoas treinando"
          position="absolute"
        />

        <Center my={24}>
          <LogoImg />

          <Text color={"gray.100"} fontSize={"sm"}>
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center px={10}>
          <Heading
            color={"gray.100"}
            fontSize={"xl"}
            mb={6}
            fontFamily={"heading"}
          >
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
            name="name"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
            name="email"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
            name="password"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confime a senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.confirmPassword?.message}
                onSubmitEditing={handleSubmit(onSubmitForm)}
                returnKeyType="send"
              />
            )}
            name="confirmPassword"
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(onSubmitForm)}
          />
        </Center>

        <Center flex={1} justifyContent="flex-end" my={10} px={10}>
          <Button
            title="Voltar para o login"
            variant="outline"
            onPress={() => router.back()}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
};

export default SignUp;
