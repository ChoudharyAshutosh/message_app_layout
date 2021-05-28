import React from 'react'
import PropTypes from 'prop-types'
import {MessageShape} from '../utils/MessageUtils'
import {FlatList, StyleSheet, Image, Text, TouchableOpacity, View, ActivityIndicator} from 'react-native'
import MapView, {Marker} from 'react-native-maps';
export default function MessageList ({messages, onPressMessage}){
    const keyExtractor=item=>item.id.toString();
    const renderMessageItem=({item})=>{
        return(
            <View key={item.id} style={styles.messageRow}>
                <TouchableOpacity onPress={()=>onPressMessage(item)} activeOpacity={1}>
                    {renderMessageBody(item)}
                </TouchableOpacity>
            </View>
        )
    }
    const renderMessageBody=({type, text, uri, coordinate, id})=>{
        switch(type){
            case'text':
                return(
                    <View style={styles.messageBubble}>
                        <Text style={styles.text}>{text}</Text>
                    </View>
                )
            case "image":
                return <Image style={styles.image} source={{uri}}/>
            case "location":
                return (
                    <View style={styles.mapContainer}>
                        <MapView style={styles.map} initialRegion={{...coordinate,latitudeDelta:0.08,longitudeDelta:0.04}}>
                            <Marker coordinate={coordinate}/>
                        </MapView>
                    </View>
                )
            case 'loading':
                return(
                    <View style={styles.mapLoading}>
                        <ActivityIndicator size="large" color="#00ff00"/>
                    </View>
                )
            default:return null
        }
    }
    return(
        <FlatList style={styles.container} 
            inverted data={messages} 
            renderItem={renderMessageItem} 
            keyExtractor={keyExtractor} 
            keyboardShouldPersistTaps={'handled'}
        />
    )
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        overflow:'visible'
    },
    messageRow:{
        flexDirection:'row',
        justifyContent:'flex-end',
        marginBottom:4,
        marginRight:10,
        marginLeft:60
    },
    messageBubble:{
        paddingVertical:5,
        paddingHorizontal:10,
        backgroundColor:'rgb(16,135,255)',
        borderRadius:20
    },
    text:{
        fontSize:18,
        color:'white'
    },
    image:{
        width:150,
        height:150,
        borderRadius:10
    },
    map:{
        width:250,
        height:250,
        borderRadius:10
    },
    mapContainer:{
        borderRadius:10,
    },
    mapLoading:{
        width:250,
        height:250,
        backgroundColor:'grey',
        alignContent:'center',
        justifyContent:'center'
    }
})
MessageList.propTypes={
    messages:PropTypes.arrayOf(MessageShape).isRequired,
    onPressMessage:PropTypes.func,
}
MessageList.defaultProps={
    onPressMessage:()=>{}
}