"use client";

import { Button, Tooltip } from 'native-base';
import React, { useCallback } from 'react';
import colors from '../../styles/colors';

const UserAuthorisedButton = ({ email, logoutUser }: any) => {
    const authorisedUserLogout = useCallback(() => {
        logoutUser();
        localStorage.removeItem("user_token");
    }, [email]);

    return (
        <Tooltip
            label={"Logout Handler"}
            placement="bottom right"
            openDelay={300}
            closeOnClick={false}
            zIndex={1000}
        >
            <Button
                borderRadius={"20px"}
                width={"5rem"}
                height={"3rem"}
                position={"absolute"}
                variant={"solid"}
                top={2}
                right={"93px"}
                overflow={"hidden"}
                onPress={authorisedUserLogout}
                zIndex={1000}
                backgroundColor={colors._light_bg_primary}
                color={"#fff"}
            >
                {email === undefined ? "" : "Logout"}
            </Button>
        </Tooltip>
    )
}

export default UserAuthorisedButton;