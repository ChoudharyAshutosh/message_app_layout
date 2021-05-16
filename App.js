import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from 'react';
import {StyleSheet, View, Alert, Image, TouchableOpacity, BackHandler, Platform, ActivityIndicator} from 'react-native';
import Constants from 'expo-constants'
import * as Location from 'expo-location'
import Status from './components/Status'
import MessageList from './components/MessageList'
import ToolBar from './components/ToolBar'
import {createImageMessage, createLocationMessage, createTextMessage, mapLoading} from './utils/MessageUtils'
export default function App() {
  const [fullScreenImageId,setfullScreenImageId]=useState(null)
  const [errorMsg, setErrorMsg]=useState(null)
  const [toolBarIsDisabled, setToolBarDisablitity]=useState(false)
  useEffect(()=>{
    (async()=>{
      if(Platform.OS==='android' && !Constants.isDevice){
        setErrorMsg(
          'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
        );return;}
      let {status}=await Location.requestForegroundPermissionsAsync()
      if(status!=='granted'){
        setErrorMsg('Permission to access location was denied, please provide location permission.')
        return
      }
    })()
    App.subscription=BackHandler.addEventListener('hardwareBackPress',()=>{
      if(fullScreenImageId){
        dismissFullScreenImage();
        return true;
      }
      return false
    })
    return ()=>{
      App.subscription.remove();
    }
  },[fullScreenImageId])
  const [data, setData]=useState(
    {messages:[
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('World'),
      createTextMessage('Hello'),
      createLocationMessage({
        latitude:37.78825,
        longitude:-122.4324
      })
    ]}
  )
  const [isInputFocused,  setIsInputFocused]=useState(false)
  const handleChangeFocus=(isFocused)=>{
    setIsInputFocused(isFocused)
  }
  const handleSubmit=(text)=>{
    let messages= [createTextMessage(text),...data.messages]
    setData({messages:messages})
  }
  const handlePressToolBarCamera=()=>{

  }
  const handlePressToolBarLocation=()=>{
    (async()=>{
      let messages=[mapLoading(),...data.messages]
      setData({messages:messages})
      setToolBarDisablitity(true)
      let location=await Location.getCurrentPositionAsync({});
      let {coords:{latitude,longitude}}=location
      messages=data.messages
      messages=[createLocationMessage({latitude,longitude}),...messages]
      setData({messages:messages})
      setToolBarDisablitity(false)
    })() 
  }
  const dismissFullScreenImage=()=>{
    setfullScreenImageId(null)
  }
  const handlePressMessage=({id, type})=>{
    switch(type){
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            {
              text:'Cancel',style:'cancel'
            },
            {
              text:'Delete',style:'destructive',
              onPress:()=>{
                const {messages}=data;
                setData({messages:messages.filter(message=>message.id!==id)})
              }
            }
          ]
        );break;
      case 'image':setfullScreenImageId(id);setIsInputFocused(false);break;
      default:break
    }
  }
  const renderMessageList=()=>{
    const {messages}=data
    return(
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={handlePressMessage}/>
      </View>
    )
  }
  const renderLoading=()=>{
    if(loading!==null)
      return <View style={styles.loadingMap}>
        <ActivityIndicator size={"large"} color="#00ff00"/>
      </View>
    else return
  }
  const renderInputMethodEditor=()=>{
    return(
      <View style={styles.inputMethodEditor}></View>
    )
  }
  const renderToolBar=()=>{
    return(
      <View style={styles.toolbar}>
        <ToolBar 
          isFocused={isInputFocused}
          onSubmit={handleSubmit}
          onChangeFocus={handleChangeFocus}
          onPressCamera={handlePressToolBarCamera}
          onPressLocation={handlePressToolBarLocation}
          isDisabled={toolBarIsDisabled}
          opacity={toolBarIsDisabled?0.5:1}
          />
      </View>
    )
  }
  const renderFullscreenImage=()=>{
    if(!fullScreenImageId) return null;
    const image=data.messages.find(message=>message.id===fullScreenImageId)
    if(!image) return null;
    const {uri}=image;
    return(
      <TouchableOpacity style={styles.fullscreenOverlay} onPress={dismissFullScreenImage}>
        <Image style={styles.fullscreenImage} source={{uri}}/>
      </TouchableOpacity>
    )
  }
  return (
    <View style={styles.container}>
      <Status/>
      {renderMessageList()}
      {renderToolBar()}
      {renderInputMethodEditor()}
      {renderFullscreenImage()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content:{
    flex:1,
    backgroundColor:'white'
  },
  inputMethodEditor:{
    flex:1,
    backgroundColor:'white'
  },
  toolbar:{
    borderTopWidth:1,
    borderTopColor:'rgba(0,0,0,0.04)',
    backgroundColor:'white'
  },
  fullscreenOverlay:{
    ...StyleSheet.absoluteFill,
    backgroundColor:'black',
    zIndex:2
  },
  fullscreenImage:{
    flex:1,
    resizeMode:'contain'
  },
  loadingMap:{
    backgroundColor:'grey',
    width:250,
    height:250,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'flex-end'
  }
});
