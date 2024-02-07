"use client";

import { Button, FormControl, Input, Modal } from "native-base";
import React from "react";
import colors from "../../styles/colors";
import Select from "react-select";
import { uuidv4 } from "@firebase/util";
import { createGroupNew } from "../../firebase/database";
import { auth } from "../../firebase/config";

interface ModelProps {
  modalVisible: boolean;
  setModalVisible: any;
  services: [];
  setServices: any;
  selectedCandidatesLists: [];
  setGroupName: any;
  groupName: any;
  setGroupProfile: any;
  groupProfile: any;
}

const Model = ({
  modalVisible,
  setModalVisible,
  services,
  setServices,
  selectedCandidatesLists,
  setGroupName,
  groupName,
  groupProfile,
  setGroupProfile,
}: ModelProps) => {
  const uuid = uuidv4();
  const optionList: any = Object.entries(selectedCandidatesLists || {})
    ?.map(([keys, details]: any) => {
      return details;
    })
    ?.map(([ids, data]: any) => {
      return {
        value: data?.groupId !== ids && ids,
        label: data?.displayName,
      };
    });

  const handleMultiSelection = (e: any) => {
    setServices(e);
  };

  const createNewGroup = async () => {
    const groupAdmin = auth?.currentUser?.displayName;
    const groupAdminId = auth?.currentUser?.uid;

    await createGroupNew({
      groupName,
      services,
      uuid,
      groupAdmin,
      groupAdminId,
      groupProfile,
    }).then(() => {
      setServices([]);
      setGroupName("");
    });
  };

  return (
    <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
      <Modal.Content height={"100%"}>
        <Modal.CloseButton />
        <Modal.Header>Add Participants</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Group Name</FormControl.Label>
            <Input
              value={groupName}
              type="text"
              onChange={(e: any) => setGroupName(e?.target?.value)}
              variant={"outline"}
              width={"100%"}
              height={"auto"}
              fontSize={"16px"}
              paddingLeft={"5px"}
              paddingRight={"5px"}
              borderWidth={"1px"}
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
          </FormControl>
          <FormControl>
            <FormControl.Label>Group Profile</FormControl.Label>
            <Input
              value={groupProfile}
              type="text"
              onChange={(e: any) => setGroupProfile(e?.target?.value)}
              variant={"outline"}
              width={"100%"}
              height={"auto"}
              fontSize={"16px"}
              paddingLeft={"5px"}
              paddingRight={"5px"}
              borderWidth={"1px"}
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
          </FormControl>
          <FormControl>
            <FormControl.Label>List Of Candidates</FormControl.Label>
            <Select
              options={optionList}
              placeholder="Select Participants"
              value={services}
              onChange={handleMultiSelection}
              isSearchable={true}
              isMulti
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              backgroundColor={colors?._light_bg_primary}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              Cancel
            </Button>
            <Button
              backgroundColor={colors?._light_bg_primary}
              onPress={() => {
                setModalVisible(false);
                createNewGroup();
              }}
            >
              Create Group
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default Model;
