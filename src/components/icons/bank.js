import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M3.33341 8.33337V14.1667H5.83341V8.33337H3.33341ZM8.33341 8.33337V14.1667H10.8334V8.33337H8.33341ZM1.66675 18.3334H17.5001V15.8334H1.66675V18.3334ZM13.3334 8.33337V14.1667H15.8334V8.33337H13.3334ZM9.58341 0.833374L1.66675 5.00004V6.66671H17.5001V5.00004L9.58341 0.833374Z" fill={props.color}/>
    </Svg>    
  )
}