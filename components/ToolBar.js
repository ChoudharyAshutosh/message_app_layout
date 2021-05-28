import {StyleSheet, Image, TextInput, View, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import React,{useState, useEffect} from 'react'
const ToolbarButton=({source, onPress,isDisabled})=>{
    var tt=source
    return(
        <TouchableOpacity onPress={onPress} disabled={isDisabled}>
            <Image style={styles.image} source={tt}/>
        </TouchableOpacity>)
}
ToolbarButton.propTypes={
    source:Image.propTypes.source.isRequired,
    onPress:PropTypes.func.isRequired,
    isDisabled:PropTypes.bool.isRequired
}
export default function ToolBar({isFocused, onChangeFocus, onSubmit, onPressCamera, onPressLocation, isDisabled, opacity}){
    const [text,setText]=useState('')
    const handleChangeText=(text)=>{
        setText(text)
    }
    const handleSubmitEditing=()=>{
        if(!text) return;
        onSubmit(text)
        setText('')
    }
    const setInputRef=(ref)=>{
        ToolBar.input=ref
    }
    useEffect(()=>{
        if(isFocused){
            ToolBar.input.focus()
        }
        else
            {ToolBar.input.blur()}
    },[isFocused])
    const handleFocus=()=>{
        onChangeFocus(true)
    }
    const handleBlur=()=>{
        onChangeFocus(false)
    }
    const toolbarOpacity={opacity:opacity}
    return(
        <View style={[styles.toolbar, toolbarOpacity]}>
            <ToolbarButton source={require('../asset/camera.png')} onPress={onPressCamera} isDisabled={isDisabled}/>
            <ToolbarButton source={require('../asset/location.png')} onPress={onPressLocation} isDisabled={isDisabled}/> 
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Type something!'}
                    blurOnSubmit={false}
                    value={text}
                    onChangeText={handleChangeText}
                    onSubmitEditing={handleSubmitEditing}
                    ref={setInputRef}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    editable={!isDisabled}
                    />
            </View>
        </View>
    )
}
const styles=StyleSheet.create({
    toolbar:{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        paddingHorizontal:10,
        paddingLeft:16,
        backgroundColor:'white',
    },
    button:{
        top:-2,
        marginRight:12,
        fontSize:20,
        color:'grey'
    },
    inputContainer:{
        flex:1,
        flexDirection:'row',
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.04)',
        borderRadius:16,
        paddingVertical:4,
        paddingHorizontal:12,
        backgroundColor:'rgba(0,0,0,0.02)'
    },
    input:{
        flex:1,
        fontSize:18
    },
    image:{
        width:35,
        height:35,
        marginRight:5
    }
})
ToolBar.propTypes={
    isFocused:PropTypes.bool.isRequired,
    onChangeFocus:PropTypes.func,
    onSubmit:PropTypes.func,
    onPressCamera:PropTypes.func,
    onPressLocation:PropTypes.func,
    isDisabled:PropTypes.bool.isRequired
}
ToolBar.defaultProps={
    onChangeFocus:()=>{},
    onSubmit:()=>{},
    onPressCamera:()=>{},
    onPressLocation:()=>{},
    isDisabled:false
}