import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M30.82 33.18L21.66 24L30.82 14.82L28 12L16 24L28 36L30.82 33.18Z" fill={props.color}/>
    </Svg>
  )
}