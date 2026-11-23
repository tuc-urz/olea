/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

/**
 * Gemeinsame Eigenschaften aller Icons des Ausweises.
 * Die Icons sind rein dekorativ und werden vor Screenreadern verborgen.
 */
const decorativeProps = {
    accessible: false,
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
};

/**
 * Personen-Silhouette als Platzhalter für das Profilbild.
 *
 * @param {Object} props
 * @param {number} props.size Kantenlänge in Pixeln
 * @param {string} props.color Strichfarbe
 */
export function PersonIcon({ size, color }) {
    return (
        <Svg {...decorativeProps} viewBox='0 0 24 24' width={size} height={size} fill='none' stroke={color} strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round'>
            <Circle cx='12' cy='8' r='4' />
            <Path d='M4 20c0-3.9 3.6-7 8-7s8 3.1 8 7' />
        </Svg>
    );
}

/**
 * Kalender-Icon für das Gültigkeitsdatum.
 *
 * @param {Object} props
 * @param {number} props.size Kantenlänge in Pixeln
 * @param {string} props.color Strichfarbe
 */
export function CalendarIcon({ size, color }) {
    return (
        <Svg {...decorativeProps} viewBox='0 0 16 16' width={size} height={size} fill='none' stroke={color} strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round'>
            <Rect x='1' y='2' width='14' height='12' rx='2' />
            <Line x1='1' y1='6' x2='15' y2='6' />
            <Line x1='5' y1='1' x2='5' y2='4' />
            <Line x1='11' y1='1' x2='11' y2='4' />
        </Svg>
    );
}

/**
 * Gefüllter Kreis mit Haken (gültig).
 *
 * @param {Object} props
 * @param {number} props.size Kantenlänge in Pixeln
 * @param {string} props.color Füllfarbe
 */
export function CheckCircleIcon({ size, color }) {
    return (
        <Svg {...decorativeProps} viewBox='0 0 20 20' width={size} height={size} fill={color}>
            <Path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z'
            />
        </Svg>
    );
}

/**
 * Kreis mit Ausrufezeichen (abgelaufen).
 *
 * @param {Object} props
 * @param {number} props.size Kantenlänge in Pixeln
 * @param {string} props.color Strichfarbe
 */
export function AlertCircleIcon({ size, color }) {
    return (
        <Svg {...decorativeProps} viewBox='0 0 24 24' width={size} height={size} fill='none' stroke={color} strokeWidth={2.5} strokeLinecap='round' strokeLinejoin='round'>
            <Circle cx='12' cy='12' r='10' />
            <Line x1='12' y1='7' x2='12' y2='13' />
            <Line x1='12' y1='17' x2='12' y2='17' />
        </Svg>
    );
}

/**
 * Zug-Icon für das Deutschlandticket.
 *
 * @param {Object} props
 * @param {number} props.size Kantenlänge in Pixeln
 * @param {string} props.color Strichfarbe
 */
export function TrainIcon({ size, color }) {
    return (
        <Svg {...decorativeProps} viewBox='0 0 24 24' width={size} height={size} fill='none' stroke={color} strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
            <Rect x='5' y='3' width='14' height='14' rx='3' />
            <Line x1='5' y1='11' x2='19' y2='11' />
            <Circle cx='9' cy='14' r='0.6' fill={color} />
            <Circle cx='15' cy='14' r='0.6' fill={color} />
            <Path d='M8 21l2-4' />
            <Path d='M16 21l-2-4' />
        </Svg>
    );
}

/**
 * Pfeil nach rechts für Verweise.
 *
 * @param {Object} props
 * @param {number} props.size Kantenlänge in Pixeln
 * @param {string} props.color Strichfarbe
 */
export function ChevronRightIcon({ size, color }) {
    return (
        <Svg {...decorativeProps} viewBox='0 0 16 16' width={size} height={size} fill='none' stroke={color} strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
            <Path d='M6 3l5 5-5 5' />
        </Svg>
    );
}
