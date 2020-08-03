import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.width} height={props.height} viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M14 1.56586L16.6694 9.48793L16.7841 9.82827H17.1432H25.7297L18.7989 14.684L18.4925 14.8986L18.612 15.2531L21.269 23.1387L14.2869 18.247L14 18.046L13.7131 18.247L6.73095 23.1387L9.38803 15.2531L9.50748 14.8986L9.2011 14.684L2.27029 9.82827H10.8568H11.2159L11.3306 9.48793L14 1.56586Z" fill={props.color} stroke={props.stroke}/>
    </Svg>
  )
}