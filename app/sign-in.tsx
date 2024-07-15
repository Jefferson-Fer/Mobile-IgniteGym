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
import { AppError } from "@/utils/AppErros";

import BackgroundImg from "../assets/app/background.png";
import LogoImg from "../assets/app/logo.svg";

type FormDataProps = {
  email: string;
  password: string;
};

const signInSchema = yup.object({
  email: yup
    .string()
    .required("O campo e-mail é obrigatório")
    .email("E-mail inválido"),
  password: yup
    .string()
    .required("O campo senha é obrigatório")
    .min(6, "O campo deve ter no mínimo 6 caracteres"),
});

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });

  const handleSignIn = async ({ email, password }: FormDataProps) => {
    try {
      setIsLoading(true);
      await signIn(email, password);
      router.navigate("(tabs)/");
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível entrar. Tente novamente mais tarde";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
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
      <VStack flex={1} background={"gray.700"}>
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
            Acesse sua conta
          </Heading>

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Email"
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                errorMessage={errors.email?.message}
              />
            )}
            name="email"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
                onSubmitEditing={handleSubmit(handleSignIn)}
                returnKeyType="send"
                secureTextEntry
              />
            )}
            name="password"
          />

          <Button
            title={"Acessar"}
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>

        <Center flex={1} justifyContent="flex-end" my={10} px={10}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>
          <Button
            title="Criar conta"
            variant="outline"
            onPress={() => router.navigate("sign-up")}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
};

export default SignIn;
