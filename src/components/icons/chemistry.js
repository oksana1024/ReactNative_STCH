import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M12 0H0V1.5L6.5 6L0 10.5V12H12V9.75H5L10 6L5 2.25H12V0Z" fill={props.color}/>
    </Svg>
  )
}