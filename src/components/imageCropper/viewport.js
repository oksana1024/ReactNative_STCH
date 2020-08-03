import { Dimensions } from 'react-native';
import {getHeight, getWidth} from '../../constants/dynamicSize';

export const SCREEN_WIDTH = getWidth(370);
export const SCREEN_HEIGHT = getHeight(640);
export const Q = getHeight(70); // buttons container height
export const H = SCREEN_HEIGHT - Q;
export const W = SCREEN_WIDTH;
