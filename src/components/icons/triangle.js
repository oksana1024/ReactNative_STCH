import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.width} height={props.height} viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M6.99966 12.078L0.189955 0.010317L14.0457 0.146765L6.99966 12.078Z" fill={props.color}/>
    </Svg>
  )
}