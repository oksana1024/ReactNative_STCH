import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M15 0C6.72 0 0 6.72 0 15C0 23.28 6.72 30 15 30C23.28 30 30 23.28 30 15C30 6.72 23.28 0 15 0ZM15 4.5C17.49 4.5 19.5 6.51 19.5 9C19.5 11.49 17.49 13.5 15 13.5C12.51 13.5 10.5 11.49 10.5 9C10.5 6.51 12.51 4.5 15 4.5ZM15 25.8C11.25 25.8 7.935 23.88 6 20.97C6.045 17.985 12 16.35 15 16.35C17.985 16.35 23.955 17.985 24 20.97C22.065 23.88 18.75 25.8 15 25.8Z" fill={props.color}/>
    </Svg>
  )
}