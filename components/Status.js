import React,{useState, useEffect} from 'react'
import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { Constants } from 'react-native-unimodules';
const statusHeight=(Platform.OS==='ios'?Constants.statusBarHeight:0)
export default function Status(){
    const [info, setInfo]=useState(null)
    const isConnected=info !== 'none' && info!=='unknown'
    const backgroundColor=isConnected?'white':'red'
    const statusBar=(
        <StatusBar backgroundColor={backgroundColor} barStyle={isConnected?'dark-content':'light-content'} animated={false}/>
    )
    const messageContainer=(
        <View style={styles.messageContainer} pointerEvents={'none'}>
            {statusBar}
            {!isConnected && (
                <View style={styles.bubble}>
                    <Text style={styles.text}>No network connection</Text>
                </View>    
            )}
        </View>
    )
    const handleChange=(info)=>{setInfo(info)}
    const [subscription, setSubscription]=useState({})
    useEffect(()=>{
        (async()=>{
            setSubscription(NetInfo.addEventListener('connectionChange',handleChange));
            await NetInfo.fetch().then(state=>{
                setInfo(state.type)
                })
            }
        )()
        setInterval(async()=>{
            await NetInfo.fetch().then(state=>{
                setInfo(state.type)
                })
        },3000)
        return ()=>{
            subscription.remove()
        }
    },[])
 //   if(Platform.OS==='ios')
        return(
            <View style={[styles.status, {backgroundColor}]}>{messageContainer}</View>
        )
        return null
}
const styles=StyleSheet.create({
    status:{
        zIndex:1,
          height:statusHeight
      },
      messageContainer:{
          zIndex:1,
          position:'absolute',
          top:statusHeight+20,
          right:0,
          left:0,
          height:80,
          alignItems:'center'
      },
      bubble:{
          paddingHorizontal:20,
          paddingVertical:10,
          borderRadius:20,
          backgroundColor:'red'
      },
      text:{
          color:'white'
      }
})