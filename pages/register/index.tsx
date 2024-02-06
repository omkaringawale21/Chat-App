"use client";

import { Box, Button, HStack, Image, Input, Text } from "native-base";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import colors from "../../styles/colors";
import { useRouter } from "next/router";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { getDatabase, ref, set } from "firebase/database";
import { app, auth } from "../../firebase/config";
const bgImage = require("../../public/images/register_logo.png");

const index = () => {
  const [show, setShow] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateCurrentUser] = useUpdateProfile(auth);
  const router = useRouter();
  const db = getDatabase(app);

  const addNewUser = async () => {
    try {
      if (!email || !password || !avatar || !userName) {
        console.log("Please fill fields!");
      } else {
        await createUserWithEmailAndPassword(email, password).then(
          async (res: any) => {
            await set(ref(db, `usercollections/${res?.user?.uid}`), {
              email: email,
              password: password,
              displayName: userName,
              photoURL: avatar,
            });

            await updateCurrentUser({
              ...res?.user,
              photoURL: avatar,
              displayName: userName,
            });

            localStorage.setItem("user_token", res?.user?.accessToken);
            setEmail("");
            setPassword("");
            setAvatar("");
            setUserName("");

            setTimeout(() => {
              router.replace("/dashboard");
            }, 1000);
          }
        );
      }
    } catch (error) {
      console.log("Register", error);
    }
  };

  const addNewUserFunc = useCallback(() => {
    addNewUser();
  }, [email, password]);

  return (
    <HStack
      flex={1}
      width={"100%"}
      minHeight={"100vh"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      backgroundColor={colors._light_bg_secondary}
    >
      <HStack
        width={{
          lg: "50%",
          base: "0",
        }}
        height={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box
          width={{
            lg: "100%",
            base: "0",
          }}
          height={"100%"}
          position={"relative"}
        >
          <Box
            width={{
              lg: "70%",
              base: "0",
            }}
            height={"60%"}
            position={"absolute"}
            right={0}
            top={200}
            zIndex={1000}
          >
            <Image
              source={{ uri: bgImage?.default?.src }}
              width={"100%"}
              height={"100%"}
              zIndex={1000}
            />
          </Box>
          <Box
            width={{
              lg: "60%",
              base: "0",
            }}
            zIndex={999}
            height={"100%"}
            position={"absolute"}
            left={0}
            backgroundColor={colors._light_bg_primary}
          ></Box>
        </Box>
      </HStack>
      <Box
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        width={{
          lg: "50%",
          sm: "100%",
        }}
        height={"auto"}
        padding={"10px"}
      >
        <Text
          fontSize={"30px"}
          fontFamily={"cursive"}
          marginBottom={"20px"}
          marginTop={"20px"}
        >
          Please fill out form Register!
        </Text>
        <Box
          width={"70%"}
          marginTop={"10px"}
          marginBottom={"10px"}
          height={"auto"}
        >
          <Text fontSize={"18px"}>Name:</Text>
          <Input
            value={userName}
            type="text"
            onChange={(e: any) => setUserName(e?.target?.value)}
            variant={"outline"}
            width={"100%"}
            fontSize={"18px"}
            paddingLeft={"5px"}
            paddingRight={"5px"}
            borderWidth={"1px"}
            borderRadius={"20px"}
            borderColor={colors._light_bg_primary}
            _hover={{
              borderColor: colors._light_bg_primary,
              backgroundColor: colors._light_bg_secondary,
            }}
            _focus={{
              borderColor: colors._light_bg_primary,
              borderWidth: "1px",
              backgroundColor: colors._light_bg_secondary,
            }}
          />
        </Box>
        <Box
          width={"70%"}
          marginTop={"10px"}
          marginBottom={"10px"}
          height={"auto"}
        >
          <Text fontSize={"18px"}>Email:</Text>
          <Input
            value={email}
            type="text"
            onChange={(e: any) => setEmail(e?.target?.value)}
            variant={"outline"}
            width={"100%"}
            fontSize={"18px"}
            paddingLeft={"5px"}
            paddingRight={"5px"}
            borderWidth={"1px"}
            borderRadius={"20px"}
            borderColor={colors._light_bg_primary}
            _hover={{
              borderColor: colors._light_bg_primary,
              backgroundColor: colors._light_bg_secondary,
            }}
            _focus={{
              borderColor: colors._light_bg_primary,
              borderWidth: "1px",
              backgroundColor: colors._light_bg_secondary,
            }}
          />
        </Box>
        <Box
          width={"70%"}
          marginTop={"10px"}
          marginBottom={"10px"}
          height={"auto"}
        >
          <Text fontSize={"18px"}>Photo URL:</Text>
          <Input
            value={avatar}
            type="text"
            onChange={(e: any) => setAvatar(e?.target?.value)}
            variant={"outline"}
            width={"100%"}
            fontSize={"18px"}
            paddingLeft={"5px"}
            paddingRight={"5px"}
            borderWidth={"1px"}
            borderRadius={"20px"}
            borderColor={colors._light_bg_primary}
            _hover={{
              borderColor: colors._light_bg_primary,
              backgroundColor: colors._light_bg_secondary,
            }}
            _focus={{
              borderColor: colors._light_bg_primary,
              borderWidth: "1px",
              backgroundColor: colors._light_bg_secondary,
            }}
          />
        </Box>
        <Box width={"70%"} height={"auto"}>
          <Text fontSize={"18px"}>Password:</Text>
          <Input
            value={password}
            onChange={(e: any) => setPassword(e?.target?.value)}
            type={show ? "text" : "password"}
            variant={"outline"}
            width={"100%"}
            fontSize={"18px"}
            paddingLeft={"5px"}
            paddingRight={"5px"}
            borderWidth={"1px"}
            borderRadius={"20px"}
            borderColor={colors._light_bg_primary}
            _hover={{
              borderColor: colors._light_bg_primary,
              backgroundColor: colors._light_bg_secondary,
            }}
            _focus={{
              borderColor: colors._light_bg_primary,
              borderWidth: "1px",
              backgroundColor: colors._light_bg_secondary,
            }}
            InputRightElement={
              <Button
                onPress={() => setShow(!show)}
                marginRight={"3px"}
                width={"4rem"}
                backgroundColor={colors._light_bg_primary}
                borderRadius={"20px"}
              >
                {show ? "Hide" : "Show"}
              </Button>
            }
          />
        </Box>
        <Box width={"70%"} marginTop={"10px"} height={"auto"}>
          <Button
            textTransform={"capitalize"}
            width={"100%"}
            height={"auto"}
            onPress={addNewUserFunc}
            backgroundColor={colors._light_bg_primary}
            borderRadius={"20px"}
          >
            <Text fontSize={"20px"} color={"#fff"}>
              sign up
            </Text>
          </Button>
        </Box>
        <HStack
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"auto"}
          width={"100%"}
        >
          <Text
            fontSize={"18px"}
            marginTop={"10px"}
            textTransform={"capitalize"}
          >
            login your account ?{" "}
          </Text>
          <Link href={"/"}>
            <Text
              fontSize={"18px"}
              marginTop={"10px"}
              textTransform={"capitalize"}
            >
              sign in
            </Text>
          </Link>
        </HStack>
      </Box>
    </HStack>
  );
};

export default index;
