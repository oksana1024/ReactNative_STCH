import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M32 28H36V12C36 9.8 34.2 8 32 8H16V12H32V28ZM12 32V0H8V8H0V12H8V32C8 34.2 9.8 36 12 36H32V44H36V36H44V32H12Z" fill={props.color}/>
    </Svg>
  )
}