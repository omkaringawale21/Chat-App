"use client";

import React from "react";
import { IconButton, MoonIcon, SunIcon, Tooltip, useColorMode } from "native-base";

const ColorModeSwitch = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    
    return (
        <Tooltip
            label={colorMode === "dark" ? "Enable light mode" : "Enable dark mode"}
            placement="bottom right"
            openDelay={300}
            closeOnClick={false}
            zIndex={1000}
        >
            <IconButton
                position="absolute"
                top={2}
                right={2}
                onPress={toggleColorMode}
                icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                borderRadius={"50%"}
                accessibilityLabel="Color Mode Switch"
                zIndex={1000}
            />
        </Tooltip>
    );
}

export default ColorModeSwitch;