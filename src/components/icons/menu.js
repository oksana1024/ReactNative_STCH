import React from 'react'
import Svg, { Path, Defs, G, Use, Mask, Rect } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 28 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M0.5 18H27.5V15H0.5V18ZM0.5 10.5H27.5V7.5H0.5V10.5ZM0.5 0V3H27.5V0H0.5Z" fill={props.color}/>
    </Svg>
  )
}