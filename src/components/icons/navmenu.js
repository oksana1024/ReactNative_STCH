import React from 'react'
import Svg, { Path, Defs, G, Use, Mask, Rect } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.width} height={props.height} viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect y="19.7647" width="24.4444" height="4.23529" fill={props.color}/>
      <Rect y="9.88235" width="33" height="4.23529" fill={props.color}/>
      <Rect width="26.8889" height="4.23529" fill={props.color}/>
    </Svg>
  )
}