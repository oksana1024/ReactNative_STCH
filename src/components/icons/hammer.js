import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M0.833311 17.4999H10.8333V19.1666H0.833311V17.4999ZM4.37081 6.72492L6.72914 4.36909L18.5125 16.1541L16.1558 18.5107L4.37081 6.72492ZM10.2641 0.833252L14.9783 5.54659L12.62 7.90492L7.90831 3.18825L10.2641 0.833252ZM3.18748 7.90408L7.90164 12.6183L5.54498 14.9749L0.830811 10.2608L3.18748 7.90408Z" fill={props.color}/>
    </Svg>
  )
}