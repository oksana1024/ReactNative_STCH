import React from 'react'
import Svg, { Path, Defs, G, Use, Mask, Text } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M15.75 14V9.625C15.75 6.93875 14.315 4.69 11.8125 4.095V3.5C11.8125 2.77375 11.2263 2.1875 10.5 2.1875C9.77375 2.1875 9.1875 2.77375 9.1875 3.5V4.095C6.67625 4.69 5.25 6.93 5.25 9.625V14L3.5 15.75V16.625H17.5V15.75L15.75 14ZM11.375 14H9.625V12.25H11.375V14ZM11.375 10.5H9.625V7H11.375V10.5ZM10.5 19.25C11.4625 19.25 12.25 18.4625 12.25 17.5H8.75C8.75 18.4625 9.52875 19.25 10.5 19.25Z" fill={props.color}/>
    </Svg>
    
  )
}