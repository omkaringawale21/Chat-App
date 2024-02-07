"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Image,
  View,
  Stack,
  Text,
  ThreeDotsIcon,
  Button,
  Avatar,
} from "native-base";
import colors from "../../styles/colors";
import Link from "next/link";
import { auth } from "../../firebase/config";
const checkImage = require("../../public/images/read.png");

interface ChatItemProps {
  text: string,
  uid: string,
  photoURL: string,
  typeOfSender: boolean,
  sendAt: string,
  senderName: string,
  getAllInfo: any,
  searchChatText: string,
  deleteInfo: any,
  loadImage: number,
  user: any,
  loader: boolean,
}

const ChatItem = ({
  text,
  uid,
  photoURL,
  typeOfSender,
  sendAt,
  senderName,
  getAllInfo,
  searchChatText,
  deleteInfo,
  loadImage,
  user,
  loader,
}: ChatItemProps) => {
  const dropDownArr = ["Edit", "Delete"];
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const timeHrs: any = new Date(sendAt).toString().substring(16, 18);
  const timeMins: any = new Date(sendAt).toString().substring(19, 21);
  const textwidthhandle: any = new String(text).toString().length;

  useEffect(() => {
    window.addEventListener("click", () => {
      setOpenDropdown(false);
    });

    console.log("loading", loader);
  }, [user]);
  
  return (
    <Box
      marginLeft={typeOfSender ? "auto" : 0}
      width={
        textwidthhandle < 18
          ? textwidthhandle + 150
          : textwidthhandle < 36
          ? textwidthhandle + 200
          : textwidthhandle < 54
          ? textwidthhandle + 220
          : window.innerWidth < 558
          ? "26rem"
          : "30rem"
      }
      marginBottom={3.5}
      marginTop={3.5}
      position={"relative"}
      nativeID="chat_box"
      zIndex={999}
    >
      <IconButton
        position={"absolute"}
        top={"-23px"}
        right={"-10px"}
        borderRadius={"50%"}
        width={"1.5rem"}
        height={"1.5rem"}
        _dark={{ backgroundColor: colors._dark_bg }}
        _light={{ backgroundColor: colors._dark_primary }}
        zIndex={1000}
        nativeID="chatitem_btn_hover"
        onPress={() => {
          uid && setOpenDropdown((state: any) => !state);
        }}
      >
        <ThreeDotsIcon />
      </IconButton>
      {openDropdown && uid ? (
        <View position={"absolute"} top={"-23px"} right={"15px"} zIndex={1005}>
          {dropDownArr?.map((operation: string, index: number) =>
            typeOfSender ? (
              <Button
                key={index}
                backgroundColor={colors._dark_primary}
                width={"6rem"}
                padding={3}
                onPress={() => {
                  operation === "Edit" && getAllInfo(uid);
                  operation === "Delete" && deleteInfo(uid);
                  setOpenDropdown(false);
                }}
              >
                <Text color={"#000"}>
                  {loader && operation === "Edit" ? "Loading.." : operation}
                </Text>
              </Button>
            ) : (
              operation !== "Edit" && (
                <Button
                  key={index}
                  backgroundColor={colors._dark_primary}
                  width={"6rem"}
                  padding={3}
                  onPress={() => {
                    setOpenDropdown(false);
                    operation === "Delete" && deleteInfo(uid);
                  }}
                >
                  <Text color={"#000"}>{operation}</Text>
                </Button>
              )
            )
          )}
        </View>
      ) : (
        ""
      )}
      <Text
        fontSize={"10px"}
        position={"absolute"}
        bottom={0}
        right={6}
        zIndex={1004}
        color={colors.black}
      >
        {typeOfSender ? (
          Number(timeHrs > 12) ? (
            `${Number(timeHrs - 12)}:${timeMins} PM`
          ) : (
            `${timeHrs}:${timeMins} AM`
          )
        ) : (
          <>
            {Number(timeHrs > 12)
              ? `${Number(timeHrs - 12)}:${timeMins} PM`
              : `${timeHrs}:${timeMins} AM`}
          </>
        )}
      </Text>
      <Box
        width={"15px"}
        height={"15px"}
        position={"absolute"}
        bottom={0}
        right={1}
        zIndex={1004}
      >
        <Image
          source={{
            uri: checkImage?.default?.src,
          }}
          width={"100%"}
          height={"100%"}
        />
      </Box>
      <Box width={"100%"} borderRadius={"5px"} color={"#000"}>
        <Stack
          marginLeft={typeOfSender ? 0 : "3.2rem"}
          backgroundColor={
            typeOfSender ? colors._light_chat_sender : colors.white
          }
          padding={3}
          marginBottom={"1px"}
          borderRadius={"5px"}
        >
          {text?.includes("png" || "jpg" || "jpeg") ? (
            <>
              {(loadImage &&
                uid === localStorage.getItem("allow_edit_details")) ||
              (loadImage && auth?.currentUser?.uid) ? (
                <Text
                  width={"100%"}
                  height={"13rem"}
                  color={colors.black}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  fontSize={"30px"}
                  position={"relative"}
                >
                  {Math.floor(loadImage)}%
                  <svg
                    style={{
                      position: "absolute",
                      fill: "none",
                      stroke: "url(#GradientColor)",
                      strokeDashoffset: 472 - 472 * (loadImage / 100),
                      strokeDasharray: 472,
                      strokeWidth: "20px",
                    }}
                    width={"160px"}
                    height={"160px"}
                  >
                    <defs>
                      <linearGradient id="GradientColor">
                        <stop offset={"0%"} stopColor={"#327da8"} />
                        <stop offset={"100%"} stopColor={"#d84ced"} />
                      </linearGradient>
                    </defs>
                    <circle cx={80} cy={80} r={70} strokeLinecap="round" />
                  </svg>
                </Text>
              ) : (
                <Link href={text}>
                  <Image
                    source={{ uri: text }}
                    width={"100%"}
                    height={"13rem"}
                  />
                </Link>
              )}
            </>
          ) : (
            <Box
              backgroundColor={
                searchChatText !== "" &&
                text?.toLowerCase()?.includes(searchChatText?.toLowerCase())
                  ? colors._hightlight_color_chat
                  : ""
              }
            >
              {text}
            </Box>
          )}
        </Stack>
        <Box
          width={"2.8rem"}
          height={"2.8rem"}
          position={"absolute"}
          borderRadius={"50%"}
          overflow={"hidden"}
          top={"-13px"}
          right={typeOfSender ? 0 : ""}
          left={typeOfSender ? "" : 0}
        >
          {typeOfSender ? (
            <></>
          ) : (
            <Avatar
              source={{
                uri: photoURL,
              }}
              width={"100%"}
              height={"100%"}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatItem;
