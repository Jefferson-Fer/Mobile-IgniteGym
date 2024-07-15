import { yupResolver } from "@hookform/resolvers/yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  useToast,
  VStack,
} from "native-base";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable } from "react-native";
import * as yup from "yup";

import Button from "@/components/Button/Index";
import ScreenHeader from "@/components/Header/ScreenHeader";
import Input from "@/components/Input/Index";
import UserPhoto from "@/components/UserPhoto";
import useAuth from "@/hooks/useAuth";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppErros";

type FormProfileProps = {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
};

const updateUserSchema = yup.object({
  name: yup.string().required("O campo nome é obrigatório"),
  email: yup
    .string()
    .required("O campo e-mail é obrigatório")
    .email("E-mail inválido"),
  password: yup
    .string()
    .required("O campo e-mail é obrigatório")
    .min(6, "mínimo de 6 caracteres"),
  oldPassword: yup
    .string()
    .required("O campo e-mail é obrigatório")
    .min(6, "mínimo de 6 caracteres"),
});

const Profile = () => {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProfileProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(updateUserSchema),
  });
  const toast = useToast();

  const handlePickImage = async () => {
    setPhotoIsLoading(true);

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
      });

      if (result.canceled) {
        return;
      }

      if (result.assets[0].uri) {
        let photoInfo = await FileSystem.getInfoAsync(result.assets[0].uri);

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 3) {
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma de até 3MB",
            placement: "top",
            bg: "red.500",
          });
        }

        const fileExtension = result.assets[0].uri.split(".").pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: result.assets[0].uri,
          type: `${result.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);

        const AvatarResponse = await api.patch(
          "/users/avatar",
          userPhotoUploadForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const userUpdated = user;
        userUpdated.avatar = AvatarResponse.data.avatar;
        updateUserProfile(userUpdated);

        toast.show({
          title: "Foto atualizada",
          placement: "top",
          backgroundColor: "green.500",
        });

        //setUserPhoto(photoInfo.uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  };

  const handleUpdateDataUser = async (data: FormProfileProps) => {
    try {
      setIsLoading(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put("/users", data);

      await updateUserProfile(userUpdated);

      toast.show({
        title: "Perfil atualizado com sucesso",
        placement: "top",
        backgroundColor: "green.700",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : "Não foi possível. Tente novamente mais tarde";

      toast.show({
        title,
        placement: "top",
        backgroundColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack flex={1} bg={"gray.700"}>
      <ScreenHeader title="Perfil" />

      <ScrollView px={10} contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6}>
          {photoIsLoading ? (
            <Skeleton
              w={33}
              h={33}
              rounded={"full"}
              startColor={"gray.500"}
              endColor={"gray.400"}
            />
          ) : (
            <UserPhoto
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : {
                      uri: "data:image/png;base64,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",
                    }
              }
              alt={"Imagem do usuário"}
              size={33}
            />
          )}

          <Pressable onPress={handlePickImage}>
            {({ pressed }) => (
              <Text
                color={"green.500"}
                fontWeight={"bold"}
                fontSize={"md"}
                opacity={pressed ? 0.5 : 1}
                mt={2}
                mb={8}
              >
                Alterar foto
              </Text>
            )}
          </Pressable>

          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                bg={"gray.600"}
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                bg={"gray.600"}
                placeholder="E-mail"
                onChangeText={onChange}
                value={value}
                isDisabled
              />
            )}
          />
        </Center>

        <Heading
          color={"gray.200"}
          fontSize={"md"}
          alignSelf={"flex-start"}
          fontFamily={"heading"}
          mt={12}
          mb={2}
        >
          Alterar senha
        </Heading>
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange } }) => (
            <Input
              bg={"gray.600"}
              placeholder="Nova Senha"
              onChangeText={onChange}
              errorMessage={errors.password?.message}
              secureTextEntry
            />
          )}
        />
        <Controller
          name="oldPassword"
          control={control}
          render={({ field: { onChange } }) => (
            <Input
              bg={"gray.600"}
              placeholder="Senha Antiga"
              onChangeText={onChange}
              errorMessage={errors.oldPassword?.message}
              secureTextEntry
            />
          )}
        />
        <Button
          title="Atualizar"
          onPress={handleSubmit(handleUpdateDataUser)}
          isLoading={isLoading}
          mt={4}
          mb={5}
        />
      </ScrollView>
    </VStack>
  );
};

export default Profile;
