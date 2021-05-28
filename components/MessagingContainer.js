import React,{useEffect} from 'react'
import PropTypes from 'prop-types'
import { BackHandler, LayoutAnimation, UIManager, View, Platform } from "react-native";
import {isIphoneX} from 'react-native-iphone-x-helper'
export const INPUT_METHOD={
    NONE:'NONE',
    KEYBOARD:'KEYBOARD',
    CUSTOM:'CUSTOM'
}
export default function MessagingContainer(props){
    if(Platform.OS==='android' && UIManager.setLayoutAnimationEnabledExperimental){
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    useEffect(()=>{
        MessagingContainer.subscription=BackHandler.addEventListener('hardwareBackPress',()=>{
            const {onChangeInputMethod, inputMethod}=props
            if(inputMethod===INPUT_METHOD.CUSTOM){
                onChangeInputMethod(INPUT_METHOD.NONE)
                return true
            }
            return false
        })
        return ()=>{
            MessagingContainer.subscription.remove()
        }
    },[props.inputMethod])
    useEffect(()=>{
        const {onChangeInputMethod}=props
        if(props.keyboardVisible){
            onChangeInputMethod(INPUT_METHOD.KEYBOARD)
        }else if(!props.keyboardVisible && props.inputMethod!==INPUT_METHOD.CUSTOM){
            onChangeInputMethod(INPUT_METHOD.NONE)
        }
    },[props.keyboardVisible])
    const {
        children,
        renderInputMethodEditor,
        inputMethod,
        containerHeight,
        contentHeight,
        keyboardHeight,
        keyboardWillShow,
        keyboardWillHide
    }=props
    const useContentHeight=keyboardWillShow||inputMethod===INPUT_METHOD.KEYBOARD
    const containerStyle={
        height:useContentHeight?contentHeight:containerHeight
    }
    const showCustomInput=inputMethod===INPUT_METHOD.CUSTOM && !keyboardWillShow
    const keyboardIsHidden=inputMethod===INPUT_METHOD.NONE && !keyboardWillShow
    const keyboardIsHiding=inputMethod===INPUT_METHOD.KEYBOARD && keyboardWillHide
    const inputStyle={
        height:showCustomInput? keyboardHeight||250:0,
        marginTop:isIphoneX() && (keyboardIsHidden || keyboardIsHiding)?24:0
    }
    return(
        <View style={containerStyle}>
            {children}
            <View style={inputStyle}>
            {renderInputMethodEditor()}
            </View>
        </View>
    )
}
MessagingContainer.propTypes={
    containerHeight:PropTypes.number.isRequired,
    contentHeight:PropTypes.number.isRequired,
    keyboardHeight:PropTypes.number.isRequired,
    keyboardVisible:PropTypes.bool.isRequired,
    keyboardWillShow:PropTypes.bool.isRequired,
    keyboardWillHide:PropTypes.bool.isRequired,
    keyboardAnimationDuration:PropTypes.number.isRequired,
    inputMethod:PropTypes.oneOf(Object.values(INPUT_METHOD)).isRequired,
    onChangeInputMethod:PropTypes.func,
    childern:PropTypes.node,
    renderInputMethodEditor:PropTypes.func.isRequired
}
MessagingContainer.defaultProps={
    children:null,
    onChangeInputMethod:()=>{}
}