import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M6 2.8275L9.834 10.5H2.166L6 2.8275ZM6 0L0 12H12L6 0Z" fill={props.color}/>
    </Svg>
  )
}