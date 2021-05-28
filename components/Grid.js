import React from 'react'
import PropTypes from 'prop-types'
import {Dimensions, FlatList, PixelRatio, StyleSheet} from 'react-native'
export default function Grid({renderItem, numColumns, itemMargin, keyExtractor,data,onEndReached}){
    const renderGridItem=(info)=>{
        const {index}=info;
        const width=Dimensions.get('window').width;
        const size=PixelRatio.roundToNearestPixel(
            (width-itemMargin*(numColumns-1))/numColumns
        )
        const marginLeft=index%numColumns===0?0:itemMargin;
        const marginTop=index<numColumns?0:itemMargin;
        return renderItem({...info,index,size, marginLeft, marginTop});
    }
    const onEnd=(cursor)=>{
        onEndReached(cursor)
    }
    return(
        <FlatList {...{data,numColumns,itemMargin,onEndReached}} keyExtractor={keyExtractor} renderItem={renderGridItem}/> 
    )
}
Grid.propTypes={
    renderItem:PropTypes.func.isRequired,
    numColumns:PropTypes.number,
    itemMargin:PropTypes.number
}
Grid.defaultProps={
    numColumns:4,
    itemMargin:StyleSheet.hairlineWidth
}