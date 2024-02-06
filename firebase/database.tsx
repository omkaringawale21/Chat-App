import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app, auth } from "./config";
import {
  deleteObject,
  getStorage,
  uploadBytes,
  ref as sRef,
} from "firebase/storage";

const db = getDatabase(app);

// Store Messages In Database Realtime
export const messageSendTwoAuth = async ({
  user,
  anotherUserActivate,
  uuid,
  messageData,
}: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      await update(
        ref(
          db,
          `messagescollection/${user[0]?.uid}${anotherUserActivate?.uid}/messages/${uuid}`
        ),
        messageData
      );
      await update(
        ref(
          db,
          `messagescollection/${anotherUserActivate?.uid}${user[0]?.uid}/messages/${uuid}`
        ),
        messageData
      );

      await update(
        ref(
          db,
          `usercollections/${user[0]?.uid}/${user[0]?.uid}${anotherUserActivate?.uid}/messages/${uuid}`
        ),
        messageData
      );
      await update(
        ref(
          db,
          `usercollections/${anotherUserActivate?.uid}/${anotherUserActivate?.uid}${user[0]?.uid}/messages/${uuid}`
        ),
        messageData
      );

      resolve();
    } catch (error) {
      reject();
    }
  });
};

// Get Messages Between Two Users
export const exisitsMessageSendTwoAuth = async ({
  user,
  anotherUserActivate,
  messageuid,
  messageData,
}: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      await set(
        ref(
          db,
          `messagescollection/${user[0]?.uid}${anotherUserActivate?.uid}/messages/${messageuid}`
        ),
        messageData
      );
      await set(
        ref(
          db,
          `messagescollection/${anotherUserActivate?.uid}${user[0]?.uid}/messages/${messageuid}`
        ),
        messageData
      );

      await set(
        ref(
          db,
          `usercollections/${user[0]?.uid}/${user[0]?.uid}${anotherUserActivate?.uid}/messages/${messageuid}`
        ),
        messageData
      );
      await set(
        ref(
          db,
          `usercollections/${anotherUserActivate?.uid}/${anotherUserActivate?.uid}${user[0]?.uid}/messages/${messageuid}`
        ),
        messageData
      );

      resolve();
    } catch (error) {
      reject();
    }
  });
};

// Delete Existing Message
export const deleteExistingMessage = async ({
  user,
  anotherUser,
  uid,
}: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      await remove(
        ref(
          db,
          `messagescollection/${user[0]?.uid}${anotherUser}/messages/${uid}`
        )
      );

      await remove(
        ref(
          db,
          `usercollections/${anotherUser}/${anotherUser}${user[0]?.uid}/messages/${uid}`
        )
      );

      resolve();
    } catch (error) {
      reject();
    }
  });
};

// Unseen & Unread Messages Will Clear
export const clearSidebarNoOfChatList = async ({
  user,
  anotherUserActivate,
  messageuid,
  messageData,
}: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      if (messageuid?.length) {
        Array.from(messageuid)?.map(async (ids: any) => {
          if (user) {
            console.log("One two one chat");
            
            await update(
              ref(
                db,
                `messagescollection/${anotherUserActivate}${user?.uid}/messages/${ids}`
              ),
              {
                isSeen: messageData,
              }
            );

            await update(
              ref(
                db,
                `usercollections/${anotherUserActivate}/${anotherUserActivate}${user.uid}/messages/${ids}`
              ),
              {
                isSeen: messageData,
              }
            );
          } else {
            console.log("Select path for group");

            await update(
              ref(
                db,
                `messagescollection/${anotherUserActivate}/messages/${ids}`
              ),
              {
                isSeen: messageData,
              }
            );

            await update(
              ref(
                db,
                `usercollections/${anotherUserActivate}/${anotherUserActivate}/messages/${ids}`
              ),
              {
                isSeen: messageData,
              }
            );
          }
        });
      }

      resolve();
    } catch (error) {
      reject();
    }
  });
};

// Get User Details
export const letsChatWithUser = async ({ id }: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    await get(ref(db, `usercollections/${id}`))
      .then((snapshot: any) => {
        const currentUserForChatting = snapshot.val();
        resolve(currentUserForChatting);
      })
      .catch((err: any) => {
        reject();
      });
  });
};

// File Upload
export const uploadFile = async ({ fileName }: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    const storage: any = getStorage();
    const storageRef: any = ref(storage, `images/${fileName}`);

    uploadBytes(storageRef, fileName)
      .then((snapshot: any) => {
        // console.log('Uploaded a blob or file!');
      })
      .catch((err) => {
        reject();
      });
  });
};

// Create New Group
export const createGroupNew = async ({
  groupName,
  services,
  uuid,
  groupAdmin,
  groupAdminId,
  groupProfile,
}: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      let groupDetails = {
        displayName: groupName,
        photoURL: groupProfile,
        groupId: uuid,
        groupAdmin: groupAdmin,
        groupAdminId: groupAdminId,
      };
      let groupList: any = [];

      if (services?.length) {
        Array.from(services)?.map((member: any) => {
          let groupDetailsList = {
            gruopMemberName: member?.label,
            gruopMemberIds: member?.value,
          };

          groupList.push(groupDetailsList);
        });
      }

      const groupInfo = { ...groupDetails, groupList };

      await update(ref(db, `usercollections/${uuid}`), groupInfo);

      resolve();
    } catch (error) {
      reject();
      console.log(error);
    }
  });
};

// Store Messages In Database Realtime
export const messageSendInGroup = async ({ uuid, uid, messageData }: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      await update(
        ref(db, `messagescollection/${uuid}/messages/${uid}`),
        messageData
      );

      await update(
        ref(db, `usercollections/${uuid}/${uuid}/messages/${uid}`),
        messageData
      );

      resolve();
    } catch (error) {
      reject();
    }
  });
};

// Edit and Store Messages In Database Realtime
export const editMessageSendInGroup = async ({
  uuid,
  uid,
  messageData,
}: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      await set(
        ref(db, `messagescollection/${uuid}/messages/${uid}`),
        messageData
      );

      await set(
        ref(db, `usercollections/${uuid}/${uuid}/messages/${uid}`),
        messageData
      );

      resolve();
    } catch (error) {
      reject();
    }
  });
};

// Delete Existing Message
export const deleteExistingMessageInGroup = async ({
  anotherUser,
  uid,
}: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      await remove(
        ref(db, `messagescollection/${anotherUser}/messages/${uid}`)
      );

      await remove(
        ref(db, `usercollections/${anotherUser}/${anotherUser}/messages/${uid}`)
      );

      resolve();
    } catch (error) {
      reject();
    }
  });
};

// Delete Group
export const deleteGroup = async ({id}: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      await remove(
        ref(db, `messagescollection/${id}`)
      );

      await remove(
        ref(db, `usercollections/${id}`)
      );

      resolve();
    } catch (error) {
      reject();
    }
  });
}
