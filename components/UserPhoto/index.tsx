import { IImageProps, Image } from "native-base";

type Props = IImageProps & {
  size: number;
};

const UserPhoto = ({ size, ...props }: Props) => {
  return (
    <Image
      h={size}
      w={size}
      rounded={"full"}
      borderWidth={2}
      borderColor={"gray.400"}
      {...props}
    />
  );
};

export default UserPhoto;
