import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.width} height={props.height} viewBox="0 0 44 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M0 38H44L22 0L0 38ZM24 32H20V28H24V32ZM24 24H20V16H24V24Z" fill={props.color}/>
    </Svg>
  )
}