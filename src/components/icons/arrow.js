import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M13.3416 9.16663H3.33325V10.8333H13.3416V13.3333L16.6666 9.99996L13.3416 6.66663V9.16663Z" fill={props.color}/>
    </Svg>    
  )
}