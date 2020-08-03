import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M14 28L16.4675 25.5325L6.7025 15.75L28 15.75L28 12.25L6.7025 12.25L16.4675 2.4675L14 0L0 14L14 28Z" fill={props.color}/>
    </Svg>
  )
}