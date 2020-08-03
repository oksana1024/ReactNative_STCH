import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.width} height={props.height} viewBox="0 0 86 84" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M15.6364 47.5067V66.1733L43 84L70.3636 66.1733V47.5067L43 65.3333L15.6364 47.5067ZM43 0L0 28L43 56L78.1818 33.0867V65.3333H86V28L43 0Z" fill={props.color}/>
    </Svg>
  )
}