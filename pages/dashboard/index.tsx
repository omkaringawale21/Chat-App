"use client";

import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { app, auth } from "../../firebase/config";
import {
  Box,
  Divider,
  HStack,
  Input,
  Text,
  Button,
  ScrollView,
  Image,
  Avatar,
  IconButton,
  CloseIcon,
  SearchIcon,
  ThreeDotsIcon,
  Pressable,
  ArrowBackIcon,
  VStack,
  AddIcon,
  Tooltip,
  DeleteIcon,
} from "native-base";
import colors from "../../styles/colors";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { getDatabase, ref, onValue, off, get } from "firebase/database";
import { uuidv4 } from "@firebase/util";
import ChatItem from "../../components/chatitem/ChatItem";
import Sidebar from "../../components/sidebar/Sidebar";
import {
  deleteExistingMessage,
  deleteExistingMessageInGroup,
  deleteGroup,
  editMessageSendInGroup,
  exisitsMessageSendTwoAuth,
  letsChatWithUser,
  messageSendInGroup,
  messageSendTwoAuth,
} from "../../firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as sRef,
  uploadBytesResumable,
} from "firebase/storage";
import Model from "../../components/model/Model";
const sendMessage = require("../../public/images/send-message.png");
const documentAdded = require("../../public/images/shear.png");
const downArrow = require("../../public/images/down-arrow.svg");
import { useDropzone } from "react-dropzone";

interface AnotherUserActivate {
  chats: {};
  displayName: string;
  email: string;
  password: string;
  photoURL: string;
  uid: string;
}

const threeDotsArr = ["Logout", "Profile"];

const index = () => {
  const router = useRouter();
  const user = useAuthState(auth);
  const [messageText, setMessageText] = useState<string>("");
  const [usersArr, setUsersArr] = useState([]);
  const [anotherUserActivate, setAnotherUserActivate] =
    useState<AnotherUserActivate>();
  const [toggle, setToggle] = useState<boolean>(false);
  const [chatsArr, setChatsArr] = useState([]);
  const [avatar, setAvatar] = useState<File | undefined>();
  const [previewImg, setPreviewImg] = useState<string>("");
  const [threeDotsIconToggle, setthreeDotsIconToggle] =
    useState<boolean>(false);
  const [searchIconToggle, setSearchIconToggle] = useState<boolean>(false);
  const [searchChatText, setSearchChatText] = useState<string>("");
  const [previousDate, setPreviousDate] = useState<number>(0);
  const uuid = uuidv4();
  const [previousUid, setPreviousUid] = useState<string>("");
  const scrollRef: any = useRef();
  const [loadImage, setLoadImage] = useState<number>(0);
  const [goToPageDown, setGoToPageDown] = useState<boolean>(false);
  const [anotherUsersIdsListArr, setAnotherUsersIdsListArr] = useState([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedCandidatesLists, setSelectedCandidatesLists] = useState([]);
  const [services, setServices] = useState([]);
  const [groupName, setGroupName] = useState<string>("");
  const [groupProfile, setGroupProfile] = useState<string>("");
  const [findIdForGroupId, setFindIdForGroupId] = useState<string>("");

  const logoutUser = async () => {
    try {
      await signOut(auth);
      router.replace("/");
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_id_no");
    } catch (error) {
      console.log("logoutUser error ===>>>", error);
    }
  };

  const addUserToChat = async (id: any) => {
    localStorage.setItem("user_id_no", id);
    await letsChatWithUser({ id }).then((res: any) => {
      setAnotherUserActivate({ ...res, uid: id });
      setToggle(false);
    });
    usersArr
      .filter(([key, data]: any) => data?.groupAdminId)
      ?.filter(([ids, details]: any) => {
        if (ids === localStorage?.getItem("user_id_no")) {
          localStorage?.setItem("GroupAdminId", details?.groupAdminId);
          localStorage?.setItem("findIdForGroup", ids);
          setFindIdForGroupId(ids);
          return ids === localStorage?.getItem("user_id_no");
        } else {
          if (localStorage?.getItem("user_id_no") !==
          localStorage?.getItem("findIdForGroup")) {
            localStorage?.removeItem("findIdForGroup");
            setFindIdForGroupId("");
            localStorage?.removeItem("GroupAdminId");
          }
        }
      });
  };

  const goToBottomPage = () => {
    scrollRef?.current?.scrollTo(150000);
    setGoToPageDown(false);
  };

  const handleOnchangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    const mimeTypeArr = ["image/png", "image/jpg", "image/jpeg"];

    if (file) {
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        if (mimeTypeArr.includes(file?.type)) {
          setPreviewImg(`${reader.result}`);

          setAvatar(file);
        }
      };
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const reader: FileReader = new FileReader();

    const mimeTypeArr = ["image/png", "image/jpg", "image/jpeg"];

    if (acceptedFiles[0]) {
      reader.readAsDataURL(acceptedFiles[0]);

      reader.onloadend = () => {
        if (mimeTypeArr.includes(acceptedFiles[0]?.type)) {
          setPreviewImg(`${reader.result}`);

          setAvatar(acceptedFiles[0]);
        }
      };
    }
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop });

  const previewImageCancle = (id: any) => {
    setPreviewImg("");
    localStorage.removeItem("allow_edit_details");
  };

  const uploadImageInStorage = () => {
    if (!avatar) {
      console.log("Please fill this!");
    } else {
      const storage = getStorage(app);
      let storageRef;

      if (previousUid) {
        if (avatar?.name?.includes(".jpeg")) {
          storageRef = sRef(
            storage,
            `images/${previousUid}${avatar?.name?.slice(-5)}`
          );
        } else {
          storageRef = sRef(
            storage,
            `images/${previousUid}${avatar?.name?.slice(-4)}`
          );
        }
      } else {
        if (avatar?.name?.includes(".jpeg")) {
          storageRef = sRef(
            storage,
            `images/${uuid}${avatar?.name?.slice(-5)}`
          );
        } else {
          storageRef = sRef(
            storage,
            `images/${uuid}${avatar?.name?.slice(-4)}`
          );
        }
      }

      const mimeTypeArr = ["image/jpeg", "image/jpg", "image/png"];

      const metadata: any = {
        contentType: mimeTypeArr.includes(`${avatar?.type}`),
      };

      const uploadTask = uploadBytesResumable(
        storageRef,
        avatar as File,
        metadata
      );

      uploadTask.on(
        "state_changed",
        (snapshots) => {
          const progess =
            (snapshots.bytesTransferred / snapshots.totalBytes) * 100;
          setLoadImage(progess);
        },
        (error) => {
          console.log("Error while uploading docs ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            async (downLoadURL: any) => {
              const date = Date.now();
              const messageuid = localStorage.getItem("allow_edit_details");
              const groupID = localStorage.getItem("user_id_no");

              console.log("downLoadURL", downLoadURL);

              const messageData = {
                message: downLoadURL,
                sendBy: {
                  user: user[0]?.displayName,
                  photoURL: user[0]?.photoURL,
                  uid: user[0]?.uid,
                },
                sendAt: previousDate ? previousDate : date,
                isSeen: false,
                uid: messageuid ? messageuid : uuid,
              };

              const checkIsGroup = Object.entries(usersArr || {})
                .map(([key, data]: any) => data)
                ?.map(([ids, details]: any) => details)
                ?.filter((e: any) => e?.groupList?.length);
              const checking = checkIsGroup?.find((e: any) => {
                return e.groupId === localStorage.getItem("user_id_no");
              });
              // console.log(checking?.groupId);

              if (checking?.groupId) {
                if (checking?.groupId && messageuid) {
                  const checked = checking?.groupList?.filter(
                    (data: any) =>
                      data?.gruopMemberIds == auth?.currentUser?.uid
                  );
                  const checkIsId = checked
                    ?.map((e: any) => e.gruopMemberIds)
                    ?.find((e: any) => e);

                  checkIsId &&
                    (await editMessageSendInGroup({
                      uuid: groupID,
                      uid: messageuid,
                      messageData,
                    }));

                  setPreviewImg("");
                  setMessageText("");
                  setPreviousDate(0);
                  setAvatar({ ...avatar, name: "" });
                  setLoadImage(0);

                  localStorage.removeItem("allow_edit_details");
                } else if (checking?.groupId && !messageuid) {
                  const checked = checking?.groupList?.filter(
                    (data: any) =>
                      data?.gruopMemberIds == auth?.currentUser?.uid
                  );
                  const checkIsId = checked
                    ?.map((e: any) => e.gruopMemberIds)
                    ?.find((e: any) => e);

                  checkIsId &&
                    (await messageSendInGroup({
                      uuid: groupID,
                      uid: uuid,
                      messageData,
                    }));

                  setPreviewImg("");
                  setMessageText("");
                  setPreviousDate(0);
                  setAvatar({ ...avatar, name: "" });
                  setLoadImage(0);

                  localStorage.removeItem("allow_edit_details");
                }
              } else {
                if (
                  anotherUserActivate?.uid &&
                  previewImg !== "" &&
                  messageuid
                ) {
                  await exisitsMessageSendTwoAuth({
                    user,
                    anotherUserActivate,
                    messageuid,
                    messageData,
                  });

                  setPreviewImg("");
                  setMessageText("");
                  setPreviousDate(0);
                  setAvatar({ ...avatar, name: "" });
                  setLoadImage(0);

                  // console.log("Existing Image Updated!");
                  localStorage.removeItem("allow_edit_details");
                } else if (
                  anotherUserActivate?.uid &&
                  previewImg !== "" &&
                  !messageuid
                ) {
                  await messageSendTwoAuth({
                    user,
                    anotherUserActivate,
                    uuid,
                    messageData,
                  });

                  setPreviewImg("");
                  setMessageText("");
                  setPreviousDate(0);
                  setAvatar({ ...avatar, name: "" });
                  setLoadImage(0);

                  localStorage.removeItem("allow_edit_details");
                  // console.log("New Image Added!");
                } else {
                  console.log("Please select user.");
                }
              }
            }
          );
        }
      );
    }
  };

  const getAllInfo = async (uid: any) => {
    const db = getDatabase(app);
    const anotherUser = localStorage.getItem("user_id_no");

    const checkIsGroup = Object.entries(usersArr || {})
      .map(([key, data]: any) => data)
      ?.map(([ids, details]: any) => details)
      ?.filter((e: any) => e?.groupList?.length);
    const checking = checkIsGroup?.find((e: any) => {
      return e.groupId === localStorage.getItem("user_id_no");
    });

    if (checking?.groupId) {
      await get(
        ref(db, `messagescollection/${anotherUser}/messages/${uid}`)
      ).then((snapshots: any) => {
        const exists = snapshots.val();
        // console.log("getAllInfo", snapshots.val());
        localStorage.setItem("allow_edit_details", uid);
        console.log(
          "Get Info",
          `messagescollection/${anotherUser}/messages/${uid}`,
          checking?.groupId
        );

        let checkIsThisImage = snapshots.val();
        checkIsThisImage = checkIsThisImage?.message?.includes(
          "png",
          "jpeg",
          "jpg"
        );

        if (checkIsThisImage) {
          setPreviewImg(exists?.message);
          setPreviousDate(exists?.sendAt);
          setPreviousUid(exists?.uid);

          setMessageText("");
        } else {
          setMessageText(exists?.message);
          setPreviousDate(exists?.sendAt);

          setPreviewImg("");
        }
      });
    } else {
      await get(
        ref(
          db,
          `messagescollection/${auth?.currentUser?.uid}${anotherUser}/messages/${uid}`
        )
      ).then((snapshots: any) => {
        const exists = snapshots.val();
        // console.log("getAllInfo", snapshots.val());
        localStorage.setItem("allow_edit_details", exists?.uid);

        let checkIsThisImage = snapshots.val();
        checkIsThisImage = checkIsThisImage?.message?.includes(
          "png",
          "jpeg",
          "jpg"
        );

        if (checkIsThisImage) {
          setPreviewImg(exists?.message);
          setPreviousDate(exists?.sendAt);
          setPreviousUid(exists?.uid);

          setMessageText("");
        } else {
          setMessageText(exists?.message);
          setPreviousDate(exists?.sendAt);

          setPreviewImg("");
        }
      });
    }
  };

  const deleteInfo = async (uid: any) => {
    const anotherUser = localStorage.getItem("user_id_no");

    const checkIsGroup = Object.entries(usersArr || {})
      .map(([key, data]: any) => data)
      ?.map(([ids, details]: any) => details)
      ?.filter((e: any) => e?.groupList?.length);
    const checking = checkIsGroup?.find((e: any) => {
      return e.groupId === localStorage.getItem("user_id_no");
    });

    checking?.groupId
      ? await deleteExistingMessageInGroup({ anotherUser, uid })
      : await deleteExistingMessage({ user, anotherUser, uid });
  };

  const messageSend = async () => {
    const date = Date.now();
    const messageuid = localStorage.getItem("allow_edit_details");
    const groupID = localStorage.getItem("user_id_no");

    const checkIsGroup = Object.entries(usersArr || {})
      .map(([key, data]: any) => data)
      ?.map(([ids, details]: any) => details)
      ?.filter((e: any) => e?.groupList?.length);
    const checking = checkIsGroup?.find((e: any) => {
      return e.groupId === localStorage.getItem("user_id_no");
    });
    // console.log("checking", checking);

    if (!messageText) {
      console.log("Please fill this!");
    } else {
      if (checking) {
        const messageData = {
          message: messageText,
          sendBy: {
            displayName: user[0]?.displayName,
            photoURL: user[0]?.photoURL,
            uid: user[0]?.uid,
          },
          sendAt: previousDate ? previousDate : date,
          isSeen: false,
          uid: messageuid ? messageuid : uuid,
        };

        if (checking?.groupId && messageuid) {
          const checked = checking?.groupList?.filter(
            (data: any) => data?.gruopMemberIds == auth?.currentUser?.uid
          );
          const checkIsId = checked
            ?.map((e: any) => e.gruopMemberIds)
            ?.find((e: any) => e);

          checkIsId &&
            (await editMessageSendInGroup({
              uuid: groupID,
              uid: messageuid,
              messageData,
            }));

          // console.log("Edit existing message in group");

          setMessageText("");
          setPreviewImg("");
          setPreviousDate(0);

          localStorage.removeItem("allow_edit_details");
        } else if (checking?.groupId && !messageuid) {
          const checked = checking?.groupList?.filter(
            (data: any) => data?.gruopMemberIds == auth?.currentUser?.uid
          );
          const checkIsId = checked
            ?.map((e: any) => e.gruopMemberIds)
            ?.find((e: any) => e);

          checkIsId &&
            (await messageSendInGroup({
              uuid: groupID,
              uid: uuid,
              messageData,
            }));

          // console.log("Send message in group", checkIsId, groupID);

          setMessageText("");
          setPreviewImg("");
          setPreviousDate(0);

          localStorage.removeItem("allow_edit_details");
        } else {
          console.log("Please select user.");
        }
      } else {
        const messageData = {
          message: messageText,
          sendBy: {
            displayName: user[0]?.displayName,
            photoURL: user[0]?.photoURL,
            uid: user[0]?.uid,
          },
          sendAt: previousDate ? previousDate : date,
          isSeen: false,
          uid: messageuid ? messageuid : uuid,
        };

        if (anotherUserActivate?.uid && messageuid) {
          await exisitsMessageSendTwoAuth({
            user,
            anotherUserActivate,
            messageuid,
            messageData,
          });

          setMessageText("");
          setPreviewImg("");
          setPreviousDate(0);

          localStorage.removeItem("allow_edit_details");
        } else if (anotherUserActivate?.uid && !messageuid) {
          await messageSendTwoAuth({
            user,
            anotherUserActivate,
            uuid,
            messageData,
          });

          setMessageText("");
          setPreviewImg("");
          setPreviousDate(0);

          localStorage.removeItem("allow_edit_details");
        } else {
          console.log("Please select user.");
        }
      }
    }
  };

  const deleteCurrentGroup = async (id: any) => {
    await deleteGroup({id});
    localStorage.removeItem("GroupAdminId");
  };

  useEffect(() => {
    if (
      !localStorage.getItem("user_token") ||
      localStorage.getItem("user_token") === undefined
    ) {
      router.replace("/");
      localStorage.removeItem("user_token");
    }

    if (window.innerWidth === 778) {
      setToggle(false);
    }

    if (localStorage?.getItem("findIdForGroup")) {
      const ids: any = localStorage?.getItem("findIdForGroup");
      localStorage?.getItem("user_id_no") ===
        localStorage?.getItem("findIdForGroup") && setFindIdForGroupId(ids);
    }

    const userid = localStorage.getItem("user_id_no");
    if (userid) {
      addUserToChat(userid);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      setthreeDotsIconToggle(false);
      setSearchIconToggle(false);
      setPreviewImg("");
      setSearchChatText("");
      // setAvatar({ name: "" });
      // localStorage.removeItem("allow_edit_details");
    });
    window.innerWidth >= 992 && setToggle(false);

    if (localStorage?.getItem("findIdForGroup")) {
      const ids: any = localStorage?.getItem("findIdForGroup");
      localStorage?.getItem("user_id_no") ===
        localStorage?.getItem("findIdForGroup") && setFindIdForGroupId(ids);
    }

    document.getElementById("scroll")?.addEventListener("scroll", (e: any) => {
      const scrool = document.getElementById("scroll");

      let scrolled: any = scrool?.scrollTop;

      scrolled ? setGoToPageDown(true) : setGoToPageDown(false);
    });
  }, [user]);

  useEffect(() => {
    let messagesListener: any;
    const db = getDatabase(app);

    if (!anotherUserActivate?.uid) {
      console.log("Another user not found!");
    } else {
      const checkIsGroup = Object.entries(usersArr || {})
        .map(([key, data]: any) => data)
        ?.map(([ids, details]: any) => details)
        ?.filter((e: any) => e?.groupList?.length);
      const checking = checkIsGroup?.find((e: any) => {
        return e.groupId === localStorage.getItem("user_id_no");
      });

      if (checking) {
        const chatRef = ref(
          db,
          `messagescollection/${checking?.groupId}/messages`
        );

        messagesListener = onValue(chatRef, (shapshots) => {
          let chats = shapshots.val();

          chats = Object.entries(chats || {})
            .map(([key, data]) => data)
            .sort((a: any, b: any) => a.sendAt - b.sendAt);

          setChatsArr(chats);
        });

        // console.log("checking", checking);
      } else {
        const chatRef = ref(
          db,
          `messagescollection/${auth?.currentUser?.uid}${anotherUserActivate?.uid}/messages`
        );

        messagesListener = onValue(chatRef, (shapshots) => {
          let chats = shapshots.val();

          chats = Object.entries(chats || {})
            .map(([key, data]) => data)
            .sort((a: any, b: any) => a.sendAt - b.sendAt);

          setChatsArr(chats);
        });
      }
    }

    return () => {
      messagesListener?.lenght && off(messagesListener);
    };
  }, [anotherUserActivate]);

  useEffect(() => {
    let messagesListener: any;

    const db = getDatabase(app);
    
    const userRef = ref(db, `usercollections/`);

    messagesListener = onValue(userRef, (shapshots) => {
      let users = shapshots.val();
      let currentUser: any = auth?.currentUser?.uid;

      let checking = Object.entries(users || {})
        ?.map(([key, data]: any) => data)
        ?.filter((e: any) => e?.groupList);

      let currentGroupId: any = [];

      for (const item of checking) {
        for (const currentListParcipants of item?.groupList) {
          currentListParcipants?.gruopMemberIds?.includes(currentUser)
            ? currentGroupId.push(item?.groupId)
            : "";
        }
      }

      let notMatchedIds = checking?.filter(
        (el: any) => !currentGroupId?.some((id: any) => el?.groupId === id)
      );

      notMatchedIds?.map((ids: any) => delete users[ids?.groupId]);

      delete users[currentUser];

      users = Object.entries(users || {}).sort((a: any, b: any) => a - b);

      setUsersArr(users);

      let userIds = users;
      userIds = userIds?.map(([keys, details]: any) => keys);
      setAnotherUsersIdsListArr(userIds);
    });

    return () => {
      messagesListener?.lenght && off(messagesListener);
    };
  }, []);

  useEffect(() => {
    let messagesListener: any;

    const db = getDatabase(app);

    const userRef = ref(db, `usercollections/`);

    messagesListener = onValue(userRef, (shapshots) => {
      let users = shapshots.val();

      let checking: any = Object.entries(users || {})
        ?.map(([key, data]: any) => data)
        ?.filter((e: any) => e?.groupList);

      let currentGroupId: any = [];

      let currentUser: any = auth?.currentUser?.uid;

      for (const item of checking) {
        for (const currentListParcipants of item?.groupList) {
          currentListParcipants?.gruopMemberIds?.includes(currentUser)
            ? currentGroupId.push(item?.groupId)
            : "";
        }
      }

      checking?.map((el: any) => delete users[el?.groupId]);

      users = Object.entries(users || {}).sort((a: any, b: any) => a - b);

      // console.log(users, "<<<===", checking);

      setSelectedCandidatesLists(users);
    });

    return () => {
      messagesListener?.lenght && off(messagesListener);
    };
  }, []);

  return (
    <Box
      width={"100%"}
      height={"100vh"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flex={1}
      backgroundColor={colors._light_dashboard_primary}
    >
      <Box
        display={"flex"}
        width={"90%"}
        flexDirection={{
          lg: "row",
          base: "column",
        }}
        height={"auto"}
        marginBottom={"15px"}
        nativeID="chat_container"
        borderRadius={"20px"}
      >
        <Model
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          services={services}
          setServices={setServices}
          selectedCandidatesLists={selectedCandidatesLists}
          setGroupName={setGroupName}
          groupName={groupName}
          groupProfile={groupProfile}
          setGroupProfile={setGroupProfile}
        />
        <Sidebar
          flex={2}
          user={user[0]}
          usersArr={usersArr}
          addUserToChat={addUserToChat}
          auth={auth}
          anotherUsersIdsListArr={anotherUsersIdsListArr}
        />
        {toggle ? (
          <Sidebar
            user={user[0]}
            usersArr={usersArr}
            addUserToChat={addUserToChat}
            auth={auth}
            flex={6}
            isToggle={toggle}
            anotherUsersIdsListArr={anotherUsersIdsListArr}
          />
        ) : (
          <Box
            flex={6}
            position={"relative"}
            width={"100%"}
            height={"90vh"}
            overflowY={"hidden"}
            borderTopRightRadius={"20px"}
            borderBottomRightRadius={"20px"}
            borderBottomLeftRadius={{
              lg: 0,
              base: "20px",
            }}
            borderTopLeftRadius={{
              lg: 0,
              base: "20px",
            }}
            backgroundColor={colors.light_gray_bg}
          >
            <Pressable
              width={"100%"}
              zIndex={{
                lg: 999,
                base: 1000,
              }}
              onPress={() => {
                toggle === false &&
                  window.innerWidth <= 992 &&
                  !searchIconToggle &&
                  setToggle(true);
              }}
            >
              {searchIconToggle ? (
                <Box
                  width={"100%"}
                  paddingTop={"12px"}
                  paddingBottom={"12px"}
                  backgroundColor={colors.white}
                  borderLeftColor={colors.light_gray_bg}
                  borderLeftWidth={"1px"}
                >
                  <Input
                    type="text"
                    width={"95%"}
                    value={searchChatText}
                    zIndex={1004}
                    height={"100%"}
                    fontSize={"19px"}
                    borderRadius={"20px"}
                    overflow={"hidden"}
                    color={colors.black}
                    placeholder="Search"
                    placeholderTextColor={colors.light_gray_bg}
                    backgroundColor={colors._dark_primary}
                    marginLeft={"2.5%"}
                    borderStyle={"none"}
                    focusOutlineColor={colors.light_gray_bg}
                    onChange={(e: any) => setSearchChatText(e?.target?.value)}
                    InputLeftElement={
                      <HStack>
                        <IconButton
                          backgroundColor={colors._dark_primary}
                          _icon={{
                            color: colors.black,
                          }}
                          onPress={() => {
                            setSearchIconToggle(false);
                            setSearchChatText("");
                          }}
                        >
                          <ArrowBackIcon />
                        </IconButton>
                        <IconButton
                          backgroundColor={colors._dark_primary}
                          _icon={{
                            color: colors.black,
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      </HStack>
                    }
                  />
                </Box>
              ) : (
                <HStack
                  display={"flex"}
                  alignItems={"center"}
                  width={"100%"}
                  justifyContent={"space-between"}
                  backgroundColor={colors.white}
                  borderLeftColor={colors.light_gray_bg}
                >
                  <HStack
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"flex-start"}
                    paddingTop={"10px"}
                    paddingBottom={"10px"}
                    backgroundColor={colors.white}
                    borderLeftColor={colors.light_gray_bg}
                    borderWidth={"1px"}
                    borderBottomWidth={0}
                    borderRightWidth={0}
                    borderTopWidth={0}
                    paddingRight={"10px"}
                  >
                    <Box width={"3rem"} height={"3rem"} marginLeft={"10px"}>
                      {anotherUserActivate?.photoURL?.length ? (
                        <Avatar
                          source={{
                            uri: anotherUserActivate?.photoURL,
                          }}
                          height={"100%"}
                          width={"100%"}
                          borderRadius={"50%"}
                        />
                      ) : (
                        ""
                      )}
                    </Box>
                    <VStack marginLeft={"10px"}>
                      <Text color={colors._dark_bg} position={"relative"}>
                        {anotherUserActivate?.displayName}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    paddingTop={"10px"}
                    paddingBottom={"10px"}
                    paddingRight={"10px"}
                    position={"relative"}
                  >
                    {findIdForGroupId && auth?.currentUser?.uid === localStorage.getItem("GroupAdminId") && (
                      <Tooltip label="Delete Group">
                        <IconButton
                          nativeID="header_icon_search"
                          borderRadius={"50%"}
                          onPress={() => {
                            deleteCurrentGroup(findIdForGroupId);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip label="Create New Group">
                      <IconButton
                        nativeID="header_icon_search"
                        borderRadius={"50%"}
                        onPress={() => {
                          setModalVisible(!modalVisible);
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip label="Search Messages">
                      <IconButton
                        nativeID="header_icon_search"
                        borderRadius={"50%"}
                        onPress={() => setSearchIconToggle((state) => !state)}
                      >
                        <SearchIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip label="Logout Here..">
                      <IconButton
                        nativeID="header_icon_logout"
                        onPress={() =>
                          setthreeDotsIconToggle((state) => !state)
                        }
                        borderRadius={"50%"}
                      >
                        <ThreeDotsIcon />
                      </IconButton>
                    </Tooltip>
                    {threeDotsIconToggle && (
                      <Box
                        position={"absolute"}
                        top={"10px"}
                        left={"-70px"}
                        backgroundColor={colors._dark_primary}
                        borderRadius={"5px"}
                        zIndex={1005}
                      >
                        {threeDotsArr?.map((content) => {
                          return (
                            <>
                              <Button
                                backgroundColor={colors._dark_primary}
                                padding={3}
                                width={"9rem"}
                                onPress={() => {
                                  threeDotsIconToggle &&
                                    content === "Logout" &&
                                    logoutUser();
                                }}
                              >
                                <HStack display={"flex"} alignItems={"center"}>
                                  {content === "Profile" &&
                                    auth?.currentUser && (
                                      <Avatar
                                        source={{
                                          uri: `${user[0]?.photoURL}`,
                                        }}
                                        width={"2rem"}
                                        height={"2rem"}
                                        borderRadius={"50%"}
                                      />
                                    )}
                                  <Text
                                    color={colors.black}
                                    fontSize={
                                      content === "Profile" ? "12px" : "16px"
                                    }
                                    marginLeft={"4px"}
                                  >
                                    {content === "Profile"
                                      ? auth?.currentUser?.displayName
                                          ?.toString()
                                          ?.substring(0, 10)
                                          ?.concat("..")
                                      : content}
                                  </Text>
                                </HStack>
                              </Button>
                              <Divider />
                            </>
                          );
                        })}
                      </Box>
                    )}
                  </HStack>
                </HStack>
              )}
            </Pressable>
            <Divider />
            <div
              {...getRootProps({
                onClick: (event) => {
                  setthreeDotsIconToggle(false);
                  setSearchIconToggle(false);
                  setPreviewImg("");
                  setSearchChatText("");
                  setAvatar({ name: "" });
                  event?.stopPropagation();
                },
              })}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Box
                  width={"100%"}
                  minHeight={"83vh"}
                  position={"relative"}
                  // nativeID="scroll"
                  paddingBottom={"70px"}
                  ref={scrollRef}
                >
                  <Box
                    padding={5}
                    width={"100%"}
                    height={"82vh"}
                    borderStyle={"dotted"}
                    borderWidth={"1px"}
                    borderColor={"#000"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Text fontSize={"30px"}>Drop the files here</Text>
                  </Box>
                </Box>
              ) : (
                <ScrollView
                  width={"100%"}
                  minHeight={"83vh"}
                  position={"relative"}
                  nativeID="scroll"
                  paddingBottom={"70px"}
                  ref={scrollRef}
                >
                  {anotherUserActivate?.uid ? (
                    <Box
                      position={"absolute"}
                      top={0}
                      zIndex={1000}
                      left={0}
                      right={0}
                      padding={3.5}
                      marginBottom={"14px"}
                      paddingBottom={"90px"}
                    >
                      <>
                        {Object.keys(chatsArr).length
                          ? chatsArr?.map((item: any) => (
                              <>
                                {/* <Box
                                  display={"block"}
                                  margin={"auto"}
                                  backgroundColor={colors?.white}
                                  padding={1}
                                  borderRadius={"4px"}
                                >
                                  {new Date(item?.sendAt)
                                    ?.toString()
                                    ?.substring(4, 15) === new Date()?.toString()?.substring(4, 15) ?
                                    "Today"
                                    :
                                    new Date(item?.sendAt)
                                    ?.toString()
                                    ?.substring(4, 15)
                                  }
                                </Box> */}
                                <ChatItem
                                  key={item?.uid}
                                  uid={item?.uid}
                                  loadImage={loadImage}
                                  getAllInfo={getAllInfo}
                                  deleteInfo={deleteInfo}
                                  text={item?.message}
                                  photoURL={item?.sendBy?.photoURL}
                                  sendAt={item?.sendAt}
                                  senderName={item?.sendBy?.user}
                                  searchChatText={searchChatText}
                                  typeOfSender={
                                    auth?.currentUser?.uid === item?.sendBy?.uid
                                      ? true
                                      : false
                                  }
                                  user={user}
                                />
                              </>
                            ))
                          : ""}
                      </>
                    </Box>
                  ) : (
                    ""
                  )}
                </ScrollView>
              )}
            </div>
            {previewImg?.length ? (
              <HStack
                width={"87.5%"}
                height={"6rem"}
                position={"absolute"}
                bottom={"70px"}
                marginLeft={"2.5%"}
                backgroundColor={colors._dark_primary}
                zIndex={1007}
                borderRadius={"20px"}
              >
                <Box width={"12rem"} height={"6rem"}>
                  <IconButton
                    width={"2rem"}
                    height={"2rem"}
                    borderRadius={"50%"}
                    position={"absolute"}
                    top={"0px"}
                    right={"10px"}
                    backgroundColor={colors.light_gray_bg}
                    color={"#000"}
                    zIndex={1000}
                    onPress={previewImageCancle}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Avatar
                    source={{
                      uri: previewImg,
                    }}
                    width={"100%"}
                    height={"100%"}
                    zIndex={999}
                  />
                </Box>
              </HStack>
            ) : (
              ""
            )}
            <HStack
              width={"100%"}
              height={"3rem"}
              position={"absolute"}
              display={"flex"}
              bottom={5}
            >
              <Input
                type="text"
                value={messageText}
                width={{
                  lg: "87.5%",
                  base: "84.5%",
                }}
                height={"100%"}
                fontSize={"18px"}
                borderRadius={"20px"}
                overflow={"hidden"}
                color={colors.black}
                placeholder="Message"
                placeholderTextColor={colors.light_gray_bg}
                backgroundColor={colors.white}
                marginLeft={"2.5%"}
                borderStyle={"none"}
                focusOutlineColor={colors.light_gray_bg}
                onChange={(e: any) => setMessageText(e.target.value)}
                InputRightElement={
                  <Pressable
                    width={"10%"}
                    height={"3rem"}
                    overflow={"hidden"}
                    position={"relative"}
                    display={"flex"}
                    alignItems={"flex-end"}
                    _hover={{
                      opacity: 0.7,
                    }}
                  >
                    <Box
                      position={"relative"}
                      height={"3rem"}
                      width={"3rem"}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      borderRadius={"20px"}
                      padding={"5px"}
                    >
                      <Image
                        source={{
                          uri: documentAdded.default.src,
                        }}
                        width={"100%"}
                        height={"100%"}
                      />
                    </Box>
                    <input
                      type="file"
                      height={"3rem"}
                      width={"100%"}
                      style={{
                        // overflow: "hidden",
                        opacity: 0,
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        bottom: 0,
                      }}
                      onChange={handleOnchangeImage}
                    />
                  </Pressable>
                }
              />
              {goToPageDown && (
                <Box position={"absolute"} bottom={45} right={5}>
                  <Pressable
                    width={"2rem"}
                    height={"2rem"}
                    onPress={goToBottomPage}
                  >
                    <Image
                      source={{
                        uri: downArrow?.default?.src,
                      }}
                      width={"2rem"}
                      height={"2rem"}
                      borderRadius={"50%"}
                    />
                  </Pressable>
                </Box>
              )}
              <Pressable
                height={"3rem"}
                width={{
                  lg: "7.5%",
                  base: "10.5%",
                }}
                onPress={() => {
                  uploadImageInStorage();
                  messageSend();
                }}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                position={"absolute"}
                bottom={0}
                right={"2.5%"}
                borderRadius={"20px"}
                _hover={{
                  opacity: 0.7,
                }}
              >
                <Box
                  position={"relative"}
                  height={"3rem"}
                  width={"3rem"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRadius={"20px"}
                  padding={"5px"}
                >
                  <Image
                    source={{
                      uri: sendMessage.default.src,
                    }}
                    width={"100%"}
                    height={"100%"}
                  />
                </Box>
              </Pressable>
            </HStack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default index;
