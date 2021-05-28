import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { Platform, StyleSheet, View } from 'react-native'
import {Constants} from 'react-native-unimodules'
export default function MeasureLayout({children}){
    const [state, setState]=useState({layout:null})
    const handleLayout=event=>{
        const {nativeEvent : {layout}}=event
        setState({
            layout:{
                ...layout,
                y:layout.y+(Platform.OS==='android'?Constants.statusBarHeight:0)
            }
        })
    }
    const {layout}=state
    if(!layout) 
        return <View onLayout={handleLayout} style={styles.container}/>
    return children(layout)
}
const styles=StyleSheet.create({
    container:{
        flex:1
    }
})
MeasureLayout.propTypes={
    children:PropTypes.func.isRequired
}