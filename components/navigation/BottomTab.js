import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, usetst, useRef} from 'react';
import { StyleSheet, Text, TextInput, Appearance, View, ImageBackground, Dimensions, Button, Easing, SafeAreaView, Keyboard, Animated} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { createStackNavigator, TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaProvider, useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { Host, Portal } from 'react-native-portalize';
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";

import firebase from 'firebase';

import {Pages} from '../../pages/index';
import { screensEnabled } from 'react-native-screens';
import { Objects } from '..'; 

const Tab = createBottomTabNavigator();

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const Tabs = createBottomTabNavigator();

var webStyle;
var Colors;

export default class BottomTab extends Component {

    _isMounted = false;
  
    constructor(props) {
      super(props)
      this.state = {
        loaded: false,
        areResourcesReady: false,
        accountType: 0,
        colors: Appearance.getColorScheme(),
            colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)
      };
      this.data = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(doc => {
        this.setState({
          accountType: doc.data().accounttype,
        })
      });
      
    }


    componentDidMount = async() => {
      Appearance.addChangeListener(this.onAppThemeChanged);

      this._isMounted = true;


      

      await firebase.auth().onAuthStateChanged((user) => {
        if (this._isMounted) {
          if (!user) {
            this.setState({
              loggedIn: false,
              loaded: true,
            })
          } else {
            this.setState({
              loggedIn: true,
              loaded: true,
            });
          }
        }
        });
        
    }

    componentWillUnmount() {
      Appearance.addChangeListener(this.onAppThemeChanged);

      this._isMounted = false;
    }
    onAppThemeChanged = (theme) => {
      const currentTheme = Appearance.getColorScheme();
      this.setState({colors: currentTheme});
      this.setState({colorTheme: Objects.Vars.useColor(Appearance.getColorScheme() === "dark" ? true : false)})
    };


    signOut() {
      firebase.auth().signOut()
        .catch((err) => {
          console.log(error);
        })
    }

/*
<Tabs.Screen name={"Home"} children={()=><Pages.Pathways {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "cube" : "cube"} size={22} color={focused ? Colors.primaryColor :  Colors.dividerColor}/>
                  )
                }} />

*/
    render() {

      Colors = Objects.Vars.useColor(this.state.colors === "dark" ? true : false);
  
      if (this.state.accountType == 0) {
        return (
          <>
          <NavigationContainer >
              <Tabs.Navigator
                // default configuration from React Navigation
                tabBarOptions={{
                  activeTintColor: Colors.primaryColor,
                  inactiveTintColor: Colors.lighterText,
                  showLabel: false,
                  style: {
                    borderTopColor: Colors.backgroundLightColor,
                    borderTopWidth: 0,
                    backgroundColor: Colors.backgroundLightColor,
                    height: 60,
                  }
                }}
                
                appearance={{
                  tabBarBackground: Colors.backgroundColor,
                  dotCornerRadius: 100,
                }}
                lazy={false}
                optimizationsEnabled={true}

              >
                
                <Tabs.Screen name="Partners" children={()=><Pages.Partners {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "shield-checkmark" : "shield-checkmark"} size={26} color={focused ? Colors.primaryColor :  Colors.dividerColor}/>
                  ),
                }}/>
                <Tabs.Screen name="Reports" children={()=><Pages.Reports {...this.props}/>}  
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "pie-chart" : "pie-chart" } size={26} color={focused ? Colors.primaryColor :  Colors.dividerColor}/>
                  )
                }}/>
                <Tabs.Screen name="Account" children={()=><Pages.Account {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? "person" : "person"} size={26} color={focused ? Colors.primaryColor :  Colors.dividerColor}/>
                  )
                }}/>
  
              </Tabs.Navigator>
            </NavigationContainer>
        </>
        
        );
      }
      else {
        return (
          <>
          <NavigationContainer>
              <Tabs.Navigator
                // default configuration from React Navigation
                tabBarOptions={{
                  activeTintColor: Colors.primaryColor,
                  inactiveTintColor: Colors.lighterText,
                  activeBackgroundColor: Colors.secondaryColor,
                  tabStyle: {
                    borderTopColor: Colors.backgroundLightColor,
                    borderTopWidth: 1,
                  }
                }}
                appearance={{
                  tabBarBackground: Colors.backgroundColor,
                  dotCornerRadius: 100,
                }}
              >
                <Tabs.Screen name={"Home"} children={()=><Pages.Pathways {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"cube"} size={20} color={focused ? Colors.primaryColor :  Colors.backgroundLighterColor}/>
                  )
                }} />
                <Tabs.Screen name="Devices" children={()=><Pages.Device {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"layers"} size={20} color={focused ? Colors.primaryColor :  Colors.backgroundLighterColor}/>
                  )
                }}/>
                <Tabs.Screen name="Users" children={()=><Pages.Users {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"people"} size={20} color={focused ? Colors.primaryColor :  Colors.backgroundLighterColor}/>
                  )
                }}/>
                <Tabs.Screen name="Account" children={()=><Pages.Account {...this.props}/>} 
                options={{
                  tabBarIcon: ({ focused, color, size }) => (
                    <Ionicons name={"person"} size={20} color={focused ? Colors.primaryColor :  Colors.backgroundLighterColor}/>
                  )
                }}/>
  
              </Tabs.Navigator>
            </NavigationContainer>
        </>
        
        );
      }
      
    }
}