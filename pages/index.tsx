import React, { useCallback, useState } from "react";
import { Box, Text, Input, Button, HStack, Image } from "native-base";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "./../firebase/config";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import colors from "../styles/colors";
const bgImage = require("../public/images/login_logo.png");

export default function App() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();

  const loginUser = async () => {
    try {
      if (!email || !password) {
        alert("Please fill fields!");
      } else {
        await signInWithEmailAndPassword(email, password).then((res: any) => {
          localStorage.setItem("user_token", res?.user?.accessToken);
        });
        setEmail("");
        setPassword("");
        router.replace("/dashboard");
      }
    } catch (error) {
      console.log("Login", error);
      router.replace("/");
    }
  };

  const loginUserFunc = useCallback(() => {
    loginUser();
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
      <Box
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        justifyContent={"center"}
        width={{
          lg: "50%",
          sm: "100%",
        }}
        height={"100%"}
        padding={"10px"}
      >
        <Text
          fontSize={"30px"}
          marginBottom={"20px"}
          marginTop={"20px"}
          fontFamily={"heading"}
        >
          Welcome Back!
        </Text>
        <Box
          width={"70%"}
          marginTop={"10px"}
          marginBottom={"10px"}
          height={"auto"}
        >
          <Text fontSize={"18px"}>Email:</Text>
          <Input
            value={email}
            type="email"
            onChange={(e: any) => setEmail(e.target.value)}
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
            onChange={(e: any) => setPassword(e.target.value)}
            variant={"outline"}
            type={show ? "text" : "password"}
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
                borderRadius={"20px"}
                backgroundColor={colors._light_bg_primary}
                color={"#fff"}
              >
                {show ? <Text>Hide</Text> : <Text>Show</Text>}
              </Button>
            }
          />
        </Box>
        <Box width={"70%"} marginTop={"10px"} height={"auto"}>
          <Button
            onPress={loginUserFunc}
            textTransform={"capitalize"}
            width={"100%"}
            height={"auto"}
            borderRadius={"20px"}
            backgroundColor={colors._light_bg_primary}
            color={"#fff"}
            _hover={{}}
          >
            <Text fontSize={"20px"}>sign in</Text>
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
          <Link href={"/register"}>
            <Text
              fontSize={"18px"}
              marginTop={"10px"}
              textTransform={"capitalize"}
            >
              sign up
            </Text>
          </Link>
        </HStack>
      </Box>
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
            left={50}
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
            right={0}
            backgroundColor={colors._light_bg_primary}
          ></Box>
        </Box>
      </HStack>
    </HStack>
  );
}
