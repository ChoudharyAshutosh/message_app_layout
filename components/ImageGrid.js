import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import Grid from './Grid'
const keyExtractor=({uri})=>(uri)
export default function ImageGrid({onPressImage}){
    ImageGrid.loading=false
    const [data, setData]=useState({images: [
        ]})
    const [cursor, setCursor]=useState('first_call')
    useEffect(()=>{
        getImages('first_call')
    },[])
    const getImages=async(after)=>{
        if(after==='first_call'){
        const {status}= await MediaLibrary.requestPermissionsAsync()
        after='0'
        console.log(await MediaLibrary.getPermissionsAsync())
        if(status!=='granted'){
            console.log('Camera roll permission denied')
        }}
        else{
            if(ImageGrid.loading) return;
            ImageGrid.loading=true
        }
        console.log(cursor);
        if(after===null) return
        console.log(await MediaLibrary.getAlbumsAsync())
        const results= await MediaLibrary.getAssetsAsync({first:20,after,sortBy: ["creationTime"],})
        console.log(results)
        const {assets,endCursor,hasNextPage}=results;
        const loadedImages=assets.map(item=>({uri:item.uri}))
        let {images}=data
        setData({images:images.concat(loadedImages)})
            ImageGrid.loading=false
           await setCursor(hasNextPage?endCursor:null)
           console.log('has next page '+hasNextPage)
    }
    const getNextImages=()=>{
        console.log(cursor)
        if(!cursor) return;
        getImages(cursor)
    }
    const renderItem=({item:{uri},size,marginTop,marginLeft})=>{
        const style={
            width:size,
            height:size,
            marginLeft,
            marginTop
        }
        return(
            <TouchableOpacity key={{uri}} activeOpacity={0.75} onPress={()=>onPressImage(uri)} style={style}>
                <Image source={{uri}} style={[style.image, style]}/>
            </TouchableOpacity>
        )
    }
    const {images}=data;
    return(
        <Grid data={images} renderItem={renderItem} numColumns={4} keyExtractor={keyExtractor} onEndReached={getNextImages}/>
    )

}
const styles=StyleSheet.create({
    image:{
        flex:1
    }
})
ImageGrid.propTypes={
    onPressImage:PropTypes.func
}
ImageGrid.defaultProps={
    onPressImage:()=>{}
}