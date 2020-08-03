import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M16.6667 3.33337H3.33341C2.40841 3.33337 1.67508 4.07504 1.67508 5.00004L1.66675 15C1.66675 15.925 2.40841 16.6667 3.33341 16.6667H16.6667C17.5917 16.6667 18.3334 15.925 18.3334 15V5.00004C18.3334 4.07504 17.5917 3.33337 16.6667 3.33337ZM16.6667 15H3.33341V10H16.6667V15ZM16.6667 6.66671H3.33341V5.00004H16.6667V6.66671Z" fill={props.color}/>
    </Svg>
  )
}