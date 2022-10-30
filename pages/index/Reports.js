import React, {Component, useState} from 'react'
import { Text, View, Animated,Appearance, useColorScheme, Image, ActivityIndicator, StatusBar, Platform, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import {Button} from 'react-native-elements';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView,{PROVIDER_GOOGLE, OverlayComponent} from 'react-native-maps';
import { Host, Portal } from 'react-native-portalize';
import RBSheet from "react-native-raw-bottom-sheet";
import NavigationBar from 'react-native-navbar-color'
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import { Buffer } from 'buffer';

import { Objects } from '../../components';
import { ImageBackground } from 'react-native';
import ThemedListItem from 'react-native-elements/dist/list/ListItem';
import { ScrollView } from 'react-native';


const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

var webStyles;
var Colors;


// Pre-step, call this before any NFC operations
async function initNfc() {
  await NfcManager.start();
}




class Reports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDeviceID: "",
            hasFocus: false,
            search: false,
            addDataHeight: 250,
            postArray: [],
            colors: Appearance.getColorScheme(),
            colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)
        }

        
        
    }

    componentDidMount () {
        initNfc();

        Appearance.addChangeListener(this.onAppThemeChanged);

    }

    componentWillUnmount() {
        Appearance.addChangeListener(this.onAppThemeChanged);
      };
    
      onAppThemeChanged = (theme) => {
        const currentTheme = Appearance.getColorScheme();
        this.setState({colors: currentTheme});
        this.setState({colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)})
      };

    readNdef() {
        const cleanUp = () => {
          NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
          NfcManager.setEventListener(NfcEvents.SessionClosed, null);
        };
      
        return new Promise((resolve) => {
          let tagFound = null;
      
          NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
            tagFound = tag;
            resolve(tagFound);
            var buf = Buffer.from(tag.ndefMessage[0].payload);
            this.setState({addDataHeight: 275});
            setTimeout(()=> {
                this.setState({search: true})
                this.RBSheet.open();
            }, 200)
            
            console.log(buf.toString());
            NfcManager.unregisterTagEvent().catch(() => 0);
          });
      
          NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
            cleanUp();
            if (!tagFound) {
              resolve();
            }
          });
      
          NfcManager.registerTagEvent();
        });
      }
      
      closeNdef() {
          const cleanUp = () => {
              NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
              NfcManager.setEventListener(NfcEvents.SessionClosed, null);
            };
      }

      NfcPage = ({searching}) => {
        if (searching == false) {
            return (
                <>
                    <View style={{flexDirection: "row", marginBottom: 25}}>
                        <View style={webStyles.connectContainer}>
                                <ActivityIndicator size="large" color={Colors.lighterText} />
                        </View>
                        <View style={webStyles.connectText}>
                            <Text style={{color: Colors.lighterText, fontSize: 12, textAlign: "center", fontWeight: "bold"}}>HOVER OVER A MEDIBOUND BEACON</Text>
                            <Text style={{color: Colors.lighterText, textAlign: "center", fontSize: 12}}>TO ADD MEDICAL DATA TO YOUR FEED</Text>
                        </View>
                    </View>   
                    <Button onPress={() => {this.state.postArray.push(1);this.RBSheet.close();} } title="Cancel" buttonStyle={webStyles.connectButton} titleStyle={{color: Colors.errColor}} ></Button>
 
                </>
            )
        }
        return (
            <>
                <View style={{flexDirection: "row", marginBottom: 25}}>
                        <View style={webStyles.connectedContainer}>
                            <Ionicons name="checkmark-outline" size={40} color={Colors.primaryColor}></Ionicons>
                        </View>
                        <View style={webStyles.connectText}>
                            <Text style={{color: Colors.lighterText, fontSize: 12, textAlign: "center", fontWeight: "bold"}}>HOVER OVER A MEDIBOUND BEACON</Text>
                            <Text style={{color: Colors.lighterText, textAlign: "center", fontSize: 12}}>TO ADD MEDICAL DATA TO YOUR FEED</Text>
                        </View>
                </View>
                <Button onPress={() => {this.state.postArray.push(1);this.RBSheet.close(); } }  containerStyle={{marginBottom: 10}}  title="Approve Submission" buttonStyle={webStyles.connectedButton} titleStyle={{color: Colors.primaryColor}} ></Button>  
                <Button onPress={() => {this.RBSheet.close();} } title="View More Information" buttonStyle={webStyles.connectButton} titleStyle={{color: Colors.lighterText}} ></Button>
            </>
        )
    }

    Post = () => {
        return (
            <View style={{marginBottom: 3,margin: 15,  shadowColor: "#000",
                shadowOffset: {
                    width: 2,
                    height: 0,
                },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation:6,}}
            >
                    <ImageBackground blurRadius={3} resizeMode="cover" imageStyle={{opacity:0.2}} source={{ uri: "https://www.wealthmanagement.com/sites/wealthmanagement.com/files/styles/article_featured_standard/public/medical-office-examining-room_1.jpg?itok=YGaB5mT1" }} style={webStyles.dataBox}>
                        <View >
                            <Text style={{fontSize: 20, paddingTop: 12.5, paddingLeft: 20, fontWeight: "700", color: Colors.lighterText, marginBottom: 2, width: "80%"}}>Medibound Report</Text>
                            <Text style={{fontSize: 12, paddingLeft: 20, fontWeight: "700", color: Colors.lighterText, marginBottom: 20, width: "80%"}}>{new Date().toDateString()}</Text>
                            <View style={{backgroundColor: Colors.backgroundLightColor, borderBottomLeftRadius: 5, borderTopLeftRadius: 5,  marginBottom: 20, padding: 5, paddingRight: 10, width: "auto", position: "absolute", right: 0, top: 13, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                                <Image source={{uri: "https://avatars.githubusercontent.com/u/83532819?s=200&v=4"}}
                                    style={{width: 30, height: 30, marginRight: 10, backgroundColor: Colors.secondaryColor, borderRadius: 20}}
                                />
                                <Text style={{color: Colors.lighterText}}>Medibound</Text>
                            </View>
                            <Button onPress={() => {this.DataSheet.open(); NavigationBar.setColor('#121212')}} title="View Report" buttonStyle={webStyles.dataButton} titleStyle={{color: Colors.lighterText}} icon={<Ionicons name={"document"} size={20} style={{marginRight: 10}} color={Colors.lighterText}/>}></Button>
                        </View>
                    </ImageBackground>
                </View>
        )
    }

    render() {

        Colors = Objects.Vars.useColor(this.state.colors === "dark" ? true : false);
        webStyles = setStyle(Colors);
        
        return(
            <>
            <SafeAreaView style={{backgroundColor: Colors.backgroundLightColor}}>
            <View style={{padding: 15, flexDirection: "row", width: screen.width, backgroundColor: Colors.backgroundLightColor, borderBottomWidth: 0, borderBottomColor: Colors.backgroundLightColor}}>
                <Image source={{}} resizeMode="cover"
                    style={{width: 40, height: 40,  backgroundColor: Colors.secondaryColor, borderRadius: 5}}
                />
                <Button onPress={() => {this.RBSheet.open();this.readNdef(); NavigationBar.setColor('#121212')}} title="Add Medical Records" buttonStyle={webStyles.addDataButton} titleStyle={{color: Colors.lighterText}} icon={<Ionicons name={"cloud-upload"} size={20} style={{marginRight: 10}} color={Colors.lighterText}/>}></Button>
            </View>
            <View  style={{ paddingBottom: 0, flexDirection: "column", width: screen.width, height: window.height-140, borderBottomWidth: 1, backgroundColor: Colors.backgroundColor, marginBottom: 10}}>
                <ScrollView> 
                    <View style={{height: 10}}></View>
                    {this.state.postArray.map(d=> {
                        return(
                            <this.Post/>
                        );
                    })}  
                    <View style={{height: 100}}></View>
                </ScrollView>              
            </View>
            <TouchableWithoutFeedback onPress={Platform.OS == 'web' ? null : Keyboard.dismiss} >
                <View style={{height: "100%", width: "100%", backgroundColor: Colors.backgroundColor, }}>
                    <View style={webStyles.body}>
                        
                    <StatusBar style="auto" backgroundColor={Colors.barColor} barStyle={Colors.darkMode ? "light-content" : "dark-content"} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <Portal>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={this.state.addDataHeight}
                    openDuration={250}
                    closeOnDragDown={false}
                    closeOnPressMask={true}
                    onClose={() => {
                        this.closeNdef()
                        this.setState({search: false, addDataHeight: 250})
                    }}
                    customStyles={{
                        container: {
                            alignItems: "center",
                            backgroundColor: Colors.backgroundLightestColor,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20
                        },
                    }}
                    >
                    <View style={{justifyContent: "center", alignItems: "center", height: this.state.addDataHeight - 50}}>
                        <this.NfcPage searching={this.state.search}/>
                    </View>
                    
                </RBSheet>
                <RBSheet
                    ref={ref => {
                        this.DataSheet = ref;
                    }}
                    height={window.height - 200}
                    openDuration={250}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    onClose={() => {
                        
                    }}
                    customStyles={{
                        container: {
                            alignItems: "center",
                            backgroundColor: Colors.backgroundLightestColor,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 20
                        },
                        draggableIcon: {
                            backgroundColor: Colors.backgroundDarkestColor
                          }
                    }}
                    >
                    <View style={{ height: this.state.addDataHeight - 50}}>
                    <View style={{ borderRadius: 20,justifyContent: "center", alignItems: "center",}}>
                        <Image source={{uri: "https://raw.githubusercontent.com/hartytech/videos/main/myImage.png"}}
                                                                style={{width: window.width - 40, height: 200, backgroundColor: Colors.backgroundDarkestColor, borderRadius: 20}}

                        ></Image>
                    </View>
                    <Text style={{fontSize: 30, marginVertical: 20}}>Notes:</Text>
                    <View style={{width: window.width - 40, padding: 20, borderRadius: 20,backgroundColor: Colors.backgroundDarkestColor}}>
                        <Text style={{fontSize: 14}}>- Visit a Physician to Study this Irregularity Further.</Text>
                        <Text style={{fontSize: 14}}>- Avoid Excessive Viewing of Blue Light.</Text>
                    </View>
                    </View>
                    
                </RBSheet>
                </Portal>
                </SafeAreaView>

            </>
        )
    }

}
function setStyle(Colors) {
    return StyleSheet.create({
        body: {
            backgroundColor: Colors.backgroundColor,
            height: "100%",
            width: "100%",
            overflow: "hidden",
            padding: 0,
            zIndex: 10,
        },
        dataBox: {
            backgroundColor: Colors.backgroundColor,
            width: "100%",
            borderRadius: 10,
            overflow: "hidden",
            
        },
        dataButton: {
            height: 45,
            width: "100%",
            opacity: 0.9,
            backgroundColor: Colors.backgroundLightColor,
        },
        addDataButton: {
            height: 45,
            width: screen.width - 76,
            marginLeft: 10,
            marginTop: -2.5,
            backgroundColor: Colors.backgroundColor,
            borderRadius: 7.5,
            borderWidth: 0,
            borderColor: Colors.backgroundLighterColor,
        },
        searchInput: {
            "marginBottom": 10,
            "paddingTop": 2.5,
            "paddingRight": 2.5,
            "paddingBottom": 2.5,
            "paddingLeft": 40,
            "backgroundColor": "white",
            "borderWidth": 0,
            "borderColor": "#b0b4b3",
            "borderWidth": 1,
            "borderStyle": "solid",
            borderRadius: 7,
            "width": "100%",
            "height": 50,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4.65,
            elevation:6,
        },
        searchIcon: {
            "width": 20,
            "zIndex": 10,
            "left" : 15,
            "position" : "relative",
            "top": 36,
            "marginTop":-15,
            "alignSelf": "flex-start",
            "color": "#b0b4b3",
            elevation:6,
        },
        connectContainer: {
            borderWidth: 1,
            borderColor: Colors.backgroundDarkestColor,
            backgroundColor: Colors.backgroundDarkestColor,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            height: 75,
            width: 75,
        },
        connectedContainer: {
            borderWidth: 1,
            borderColor: Colors.secondaryColor,
            backgroundColor: Colors.secondaryColor,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            height: 75,
            width: 75,
        },
        connectText: {
            borderWidth: 2,
            borderColor: Colors.backgroundDarkestColor,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            height: 75,
            marginLeft: 10,
            color: Colors.lighterText,
            padding: 10,
            width: screen.width - 125,
        },
        connectButton: {
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            height: 45,
            width: screen.width - 40,
            backgroundColor: Colors.backgroundDarkestColor,
            borderRadius: 7.5,
            borderWidth: 2,
            borderColor: Colors.backgroundDarkestColor,
        },
        connectedButton: {
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            height: 45,
            width: screen.width - 40,
            backgroundColor: Colors.backgroundDarkestColor,
            borderRadius: 7.5,
            borderWidth: 2,
            borderColor: Colors.backgroundDarkestColor,
        }
    });
}

export default Reports;
