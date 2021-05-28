import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Keyboard, Platform} from 'react-native'
export default function KeyboardState(props){
    const INITIAL_ANIMATION_DURATION=250
    const {layout :{height}}=props
    const [state, setState]=useState({
        contentHeight:height,
        keyboardHeight:0,
        keyboardVisible:false,
        keyboardWillShow:false,
        keyboardWillHide:false,
        keyboardAnimationDuration:INITIAL_ANIMATION_DURATION
    })
    useEffect(()=>{
        if(Platform.OS==='ios'){
            KeyboardState.subscriptions=[
                Keyboard.addListener("keyboardWillShow",keyboardwillShow),
                Keyboard.addListener("keyboardWillHide",keyboardwillHide),
                Keyboard.addListener('keyboardDidShow',keyboardDidShow),
                Keyboard.addListener('keyboardDidHide',keyboardDidHide)
            ]
        }
        else{
            KeyboardState.subscriptions=[
                Keyboard.addListener('keyboardDidHide',keyboardDidHide),
                Keyboard.addListener('keyboardDidShow',keyboardDidShow)
            ]
        }
        return ()=>{
            KeyboardState.subscriptions.forEach(subcsription => subcsription.remove());
        }
    },[props,state])
    const keyboardwillShow=event=>{
        let data=state
        data.keyboardWillShow=true
        setState(data)
        measure(event)
    }
    const keyboardDidShow=(event)=>{
        let data=state
        data.keyboardWillShow=false
        data.keyboardVisible=true
        setState(data)
        measure(event)
        props.setKeyboardVisibility(true)
    }
    const keyboardwillHide=event=>{
        let data=state
        data.keyboardWillHide=true
        setState(data)
        measure(event)
    }
    const keyboardDidHide=(event)=>{
        let data=state
        data.keyboardWillHide=false,
        data.keyboardVisible=false
        setState(data)
        measure(event)
        props.setKeyboardVisibility(false)
    }
    const measure=event=>{
        const {layout}=props
        const  {endCoordinates:{height,screenY}, duration=INITIAL_ANIMATION_DURATION}=event
        let data=state
        data.contentHeight=screenY-layout.y
        data.keyboardHeight=height
        data.keyboardAnimationDuration=duration==0?1000:duration
        setState(data)
    }
    const {children, layout}=props
    var {
        contentHeight,
        keyboardHeight,
        keyboardVisible,
        keyboardWillShow,
        keyboardWillHide,
        keyboardAnimationDuration
    }=state
    return children({
        containerHeight:layout.height,...state
    })

}
KeyboardState.protoTypes={
    layout:PropTypes.shape({
        x:PropTypes.number.isRequired,
        y:PropTypes.number.isRequired,
        width:PropTypes.number.isRequired,
        height:PropTypes.number.isRequired
    })
}
