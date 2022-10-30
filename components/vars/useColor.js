import {Appearance, useColorScheme} from 'react-native';


export default function getColor(darkMode) {
    return Colors = {
        backgroundColor: darkMode ? "#111111" : "#f2f2f7",
        backgroundColorRGB: darkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)",
        backgroundLightColor: darkMode ? "#1C1C1E" : "#ffffff",
        backgroundLighterColor: darkMode ? "#090909" : "#E3E3E8",
        backgroundLightestColor: darkMode ? "#111111" : "#ffffff",
        backgroundDarkestColor: darkMode ? "#1C1C1E" : "#f2f2f7",
        primaryColor: darkMode ? "#3e71ff" : "#142249",
        lightColor: darkMode ? "#00d6a1" : "#222",
        secondaryColor: darkMode ? "#142249" : "#3e71ff",
        lighterText: darkMode ? "#ddd" : "#222",
        lightText: darkMode ? "#8E8E93" : "#8E8E93",
        errColor: darkMode ? "#d36e6e" : "#cc3737",
        barColor: "#3e71ff",
        dividerColor: darkMode ?  "#444": "#ddd",
        darkMode: darkMode,
    }
}

/*export default Colors = {
    backgroundColor:  new DynamicValue('#eeeeee', '#121212'),
    backgroundLightColor: new DynamicValue('#dedede', '#222222'),
    backgroundLighterColor:  new DynamicValue('#aaaaaa', '#444444'),
    primaryColor: new DynamicValue('#004030', '#00d6a1'),
    secondaryColor: new DynamicValue('#00d6a1', '#004030'),
    lighterText: new DynamicValue('#222', '#ddd'),
    errColor: new DynamicValue('#cc3737', '#d36e6e'),
    barColor: "#00d6a1"
} */