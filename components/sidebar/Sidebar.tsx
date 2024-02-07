"use client";

import {
  Avatar,
  Box,
  Divider,
  HStack,
  IconButton,
  Image,
  Input,
  Pressable,
  ScrollView,
  SearchIcon,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import colors from "../../styles/colors";
import { auth } from "../../firebase/config";
import { ClearSidebarNoOfChatList } from "../../firebase/database";

const Sidebar = ({
  user,
  usersArr,
  addUserToChat,
  flex,
  isToggle,
  anotherUsersIdsListArr,
}: any) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>();
  const [searchChatUser, setSearchChatUser] = useState<string>("");
  const [combinedUser, setCombinedUser] = useState<[] | any>([]);
  const [groupUser, setGroupUser] = useState<[] | any>([]);

  const curHightlightedUser = () => {
    const userid = localStorage.getItem("user_id_no");
    setCurrentUserId(userid);

    const listIds = anotherUsersIdsListArr?.map((anotherUserId: any) => {
      return anotherUserId;
    });

    const listIdsInfo = anotherUsersIdsListArr?.map((anotherUserId: any) => {
      return anotherUserId?.concat(`${auth?.currentUser?.uid}`);
    });

    setCombinedUser(listIdsInfo);
    setGroupUser(listIds);
  };

  const clearNoOfUnseenMessages = async (messageuid: any) => {
    const anotherUserActivate: any = localStorage.getItem("user_id_no");

    messageuid?.filter(async (e: any) => {
      const checkIsGroup = Object.entries(usersArr || {})
        .map(([key, data]: any) => data)
        ?.map(([ids, details]: any) => details)
        ?.filter((e: any) => e?.groupList?.length);
      const checking = checkIsGroup?.find((e: any) => {
        return e.groupId === localStorage.getItem("user_id_no");
      });

      if (e !== undefined) {
        await ClearSidebarNoOfChatList({
          user: checking?.groupList?.length ? false : user,
          anotherUserActivate,
          messageuid: e,
          messageData: true,
        });
      }
    });
  };

  useEffect(() => {
    curHightlightedUser();

    usersArr.map(([key, data]: [string, any]) => {
      Object.entries(data || {})?.map(([keys, details]: [string, any]) => {
        if (combinedUser?.includes(keys) || groupUser?.includes(keys)) {
          if (details?.messages) {
            return Object.entries(details?.messages || {})
              ?.map(([ids, values]: any) => {
                return values;
              })
              ?.map((e) => e?.isSeen === false)
              ? Object.entries(details?.messages || {})
                  ?.map(([ids, values]: any) => {
                    return values;
                  })
                  ?.map((e) => e?.uid)
              : "";
          } else {
            return [];
          }
        }
      });
    });
  }, [usersArr, user, isToggle, addUserToChat]);

  return (
    <Box
      flex={flex}
      display={{
        lg: "block",
        base: isToggle ? "block" : "none",
      }}
      width={"100%"}
      height={"90vh"}
      borderTopLeftRadius={"20px"}
      overflow={"hidden"}
      borderBottomLeftRadius={"20px"}
      backgroundColor={colors.white}
      borderBottomRightRadius={{
        lg: 0,
        base: "20px",
      }}
      borderTopRightRadius={{
        lg: 0,
        base: "20px",
      }}
    >
      <HStack
        display={"flex"}
        alignItems={"center"}
        width={"100%"}
        justifyContent={"space-between"}
        paddingTop={"10px"}
        paddingBottom={"10px"}
      >
        <Box width={"95%"} height={"3rem"}>
          <Input
            type="text"
            value={searchChatUser}
            width={"100%"}
            height={"100%"}
            fontSize={"18px"}
            borderRadius={"20px"}
            overflow={"hidden"}
            color={colors.black}
            placeholder="Search"
            placeholderTextColor={colors.light_gray_bg}
            backgroundColor={colors._dark_primary}
            marginLeft={"2.5%"}
            borderStyle={"none"}
            focusOutlineColor={colors.light_gray_bg}
            onChange={(e: any) => setSearchChatUser(e?.target?.value)}
            InputLeftElement={
              <IconButton
                backgroundColor={colors._dark_primary}
                _icon={{
                  color: colors.black,
                }}
              >
                <SearchIcon />
              </IconButton>
            }
          />
        </Box>
      </HStack>
      <Divider />
      <ScrollView
        width={"100%"}
        height={{
          lg: "90%",
          base: "80vh",
        }}
        nativeID="scroll_sidebar"
      >
        {usersArr
          .filter(([ids, data]: any) =>
            searchChatUser.length > 0
              ? data?.displayName
                  ?.toLowerCase()
                  ?.includes(searchChatUser.toLowerCase())
              : data
          )
          .map(([key, data]: any) => {
            return (
              <Box key={key}>
                <Pressable
                  backgroundColor={
                    currentUserId === key ? colors._dark_primary : "none"
                  }
                  borderColor={"none"}
                  borderWidth={"none"}
                  padding={"5px"}
                  paddingTop={"10px"}
                  paddingBottom={"10px"}
                  borderRadius={"10px"}
                  onPress={() => {
                    addUserToChat(key);
                    curHightlightedUser();
                    setSearchChatUser("");
                    clearNoOfUnseenMessages(
                      Object.entries(data || {})?.map(
                        ([keys, details]: [string, any]) => {
                          if (
                            combinedUser?.includes(keys) ||
                            groupUser?.includes(keys)
                          ) {
                            if (details?.messages) {
                              return Object.entries(details?.messages || {})
                                ?.map(([ids, values]: [string, any]) => {
                                  return values;
                                })
                                ?.map((e) => e?.isSeen === false)
                                ? Object.entries(details?.messages || {})
                                    ?.map(([ids, values]: [string, any]) => {
                                      return values;
                                    })
                                    ?.map((e) => e?.uid)
                                : "";
                            } else {
                              return [];
                            }
                          }
                        }
                      )
                    );
                  }}
                >
                  <HStack width={"100%"}>
                    <Box
                      width={"20%"}
                      height={"3rem"}
                      display={"flex"}
                      alignItems={"center"}
                      paddingLeft={"3.7%"}
                      paddingRight={"3.7%"}
                    >
                      {user && (
                        <Box width={"3rem"} height={"3rem"}>
                          <Avatar
                            source={{
                              uri: data?.photoURL,
                            }}
                            height={"100%"}
                            width={"100%"}
                            borderRadius={"50%"}
                          />
                        </Box>
                      )}
                    </Box>
                    <HStack width={"80%"} height={"3rem"}>
                      <VStack
                        width={"70%"}
                        height={"3rem"}
                        display={"flex"}
                        justifyContent={"center"}
                      >
                        <Text
                          position={"relative"}
                          marginLeft={"10px"}
                          color={colors.black}
                          fontSize={"14px"}
                        >
                          {new String(data?.displayName)?.toString()?.length >
                          15
                            ? data?.displayName?.substring(0, 15)?.concat("..")
                            : data?.displayName}
                        </Text>
                        <Text
                          position={"relative"}
                          marginLeft={"10px"}
                          color={colors.black}
                          fontSize={"14px"}
                        >
                          {Object.entries(data || {})?.map(
                            ([keys, details]: [string, any]) => {
                              if (
                                combinedUser?.includes(keys) ||
                                groupUser?.includes(keys)
                              ) {
                                if (details?.messages) {
                                  return Object.entries(details?.messages || {})
                                    ?.map(([ids, values]: [string, any]) => {
                                      return values;
                                    })
                                    ?.sort((a, b) => a.sendAt - b.sendAt)
                                    .slice(-1)
                                    ?.find((e) => e)
                                    ?.message?.includes("png", "jpg", "jpeg")
                                    ? "Photo"
                                    : Object.entries(data || {})?.map(
                                        ([keys, details]: [string, any]) => {
                                          if (
                                            combinedUser?.includes(keys) ||
                                            groupUser?.includes(keys)
                                          ) {
                                            if (details?.messages) {
                                              return Object.entries(
                                                details?.messages || {}
                                              )
                                                ?.map(([ids, values]: [string, any]) => {
                                                  return values;
                                                })
                                                ?.sort(
                                                  (a, b) => a.sendAt - b.sendAt
                                                )
                                                .slice(-1)
                                                ?.find((e) => e)
                                                ?.message?.substring(0, 16);
                                            } else {
                                              return [];
                                            }
                                          }
                                        }
                                      );
                                } else {
                                  return [];
                                }
                              } else {
                                return [];
                              }
                            }
                          )}
                          ..
                        </Text>
                      </VStack>
                      <VStack
                        width={"30%"}
                        height={"3rem"}
                        display={"flex"}
                        justifyContent={"flex-end"}
                        alignItems={"center"}
                        position={"relative"}
                      >
                        <Text position={"absolute"} fontSize={"10px"} top={1}>
                          {Object.entries(data || {})?.map(
                            ([keys, details]: [string, any]) => {
                              if (
                                combinedUser?.includes(keys) ||
                                groupUser?.includes(keys)
                              ) {
                                if (details?.messages) {
                                  return Number(
                                    new Date(
                                      Object.entries(details?.messages || {})
                                        ?.map(([ids, values]: [string, any]) => {
                                          return values;
                                        })
                                        ?.sort((a, b) => a.sendAt - b.sendAt)
                                        .slice(-1)
                                        ?.find((e) => e)?.sendAt
                                    )
                                      .toString()
                                      ?.substring(16, 18)
                                  ) > 12
                                    ? `${
                                        Number(
                                          new Date(
                                            Object.entries(
                                              details?.messages || {}
                                            )
                                              ?.map(([ids, values]: [string, any]) => {
                                                return values;
                                              })
                                              ?.sort(
                                                (a, b) => a.sendAt - b.sendAt
                                              )
                                              .slice(-1)
                                              ?.find((e) => e)?.sendAt
                                          )
                                            .toString()
                                            ?.substring(16, 18)
                                        ) - 12
                                      }:${new Date(
                                        Object.entries(details?.messages || {})
                                          ?.map(([ids, values]: [string, any]) => {
                                            return values;
                                          })
                                          ?.sort((a, b) => a.sendAt - b.sendAt)
                                          .slice(-1)
                                          ?.find((e) => e)?.sendAt
                                      )
                                        .toString()
                                        ?.substring(19, 21)} PM`
                                    : `${Number(
                                        new Date(
                                          Object.entries(
                                            details?.messages || {}
                                          )
                                            ?.map(([ids, values]: [string, any]) => {
                                              return values;
                                            })
                                            ?.sort(
                                              (a, b) => a.sendAt - b.sendAt
                                            )
                                            .slice(-1)
                                            ?.find((e) => e)?.sendAt
                                        )
                                          .toString()
                                          ?.substring(16, 18)
                                      )}:${new Date(
                                        Object.entries(details?.messages || {})
                                          ?.map(([ids, values]: [string, any]) => {
                                            return values;
                                          })
                                          ?.sort((a, b) => a.sendAt - b.sendAt)
                                          .slice(-1)
                                          ?.find((e) => e)?.sendAt
                                      )
                                        .toString()
                                        ?.substring(19, 21)} AM`;
                                } else {
                                  return [];
                                }
                              }
                            }
                          )}
                        </Text>
                        <Box position={"absolute"} bottom={1}>
                          {Object.entries(data || {})?.map(
                            ([keys, details]: [string, any]) => {
                              if (
                                combinedUser?.includes(keys) ||
                                groupUser?.includes(keys)
                              ) {
                                if (details?.messages) {
                                  return Object.entries(details?.messages || {})
                                    ?.map(([ids, values]: [string, any]) => {
                                      return values;
                                    })
                                    ?.sort((a, b) => a.sendAt - b.sendAt)
                                    .slice(-1)
                                    ?.find((e) => e)?.isSeen === false ? (
                                    <Box
                                      backgroundColor={
                                        colors._no_ofChat_hightlight
                                      }
                                      padding={"4px"}
                                      display={"flex"}
                                      justifyContent={"center"}
                                      alignItems={"center"}
                                      width={"20px"}
                                      height={"20px"}
                                      borderRadius={"50%"}
                                    >
                                      <Text
                                        fontSize={"10px"}
                                        fontWeight={"bold"}
                                      >
                                        {
                                          Object.entries(data || {})
                                            ?.map(([keys, details]: [string, any]) => {
                                              if (
                                                combinedUser?.includes(keys) ||
                                                groupUser?.includes(keys)
                                              ) {
                                                if (details?.messages) {
                                                  return Object.entries(
                                                    details?.messages || {}
                                                  )?.map(
                                                    ([ids, values]: [string, any]) => {
                                                      return values;
                                                    }
                                                  );
                                                } else {
                                                  return [];
                                                }
                                              }
                                            })
                                            ?.filter((e: any) => {
                                              if (e !== undefined) {
                                                return e;
                                              }
                                            })
                                            ?.find((e: any) => e)
                                            ?.filter((e: any) => {
                                              if (e?.isSeen === false) {
                                                return e;
                                              }
                                            })?.length
                                        }
                                      </Text>
                                    </Box>
                                  ) : (
                                    ""
                                  );
                                } else {
                                  return [];
                                }
                              }
                            }
                          )}
                        </Box>
                      </VStack>
                    </HStack>
                  </HStack>
                </Pressable>
                <Divider />
              </Box>
            );
          })
          .sort((a: any, b: any) => a?.sendAt - b?.sendAt)}
      </ScrollView>
    </Box>
  );
};

export default Sidebar;
