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

import React from 'react';

import { useTheme } from "react-native-paper";
import createIconSet from '@expo/vector-icons/createIconSet';
import PropTypes from "prop-types";
import { SvgCssUri } from 'react-native-svg';
const glyphMap = {
    "bus":                      "a",
    "train":                    "b",
    "close":                    "c",
    "messages":                 "d",
    "menu":                     "e",
    "grid":                     "f",
    "more-horizontal":          "g",
    "more-vertical":            "h",
    "paperplane-outline":       "i",
    "partlysunny":              "j",
    "partlysunny-outline":      "k",
    "rainy":                    "l",
    "rainy-outline":            "m",
    "thunderstorm":             "n",
    "thunderstorm-outline":     "o",
    "sunny":                    "p",
    "sunny-outline":            "q",
    "down":                     "r",
    "download":                 "s",
    "print":                    "t",
    "hilfe":                    "u",
    "back":                     "v",
    "lock":                     "w",
    "lock-open":                "x",
    "navigation":               "y",
    "forward":                  "z",
    "profile":                  "A",
    "opal":                     "B",
    "mensa":                    "C",
    "location":                 "D",
    "inbox":                    "E",
    "imprint":                  "F",
    "pts":                      "G",
    "feedback":                 "H",
    "book":                     "I",
    "news":                     "J",
    "up":                       "K",
    "tram":                     "L",
    "rss":                      "M",
    "map-search":               "N",
    "m-start1":                 "O",
    "dashboard":                "P",
    "timetable":                "Q",
    "search":                   "R",
    "settings":                 "S",
    "coffee":                   "T",
    "check":                    "V",
    "star":                     "W",
    "star-selected":            "X",
    "edit":                     "Y",
    "time":                     "A1",
    "open-external":            "A2",
    "share":                    "1",
    "accessibility":            "A3",
};
const CustomIcon = createIconSet(glyphMap, 'olea');


/**
 * Icons of the Openasist app
 *
 * This component handles the load of the icon font and
 * provides a simple way to include these icons.
 *
 * Parameters:
 *  - icon: Name (slug) of the icon
 *  - size: Size (as Number) of the icon
 *  - color: Color of the icon
 *
 * Navigation-Parameters:
 *  - none
 */
function IconsOpenasist({ icon, iconSVG: IconSVG, size, color, accessibilityLabel, ...props }) {
    const theme = useTheme();
    const { AppIcons } = theme;

    const iconSize = size ?? 26;
    const iconAriaLabel = props?.['aria-label'] ?? accessibilityLabel ?? null;
    const iconAriaHidden = iconAriaLabel ? false : true;

    const iconProps = {
        color: color ?? 'black',
        'aria-hidden': iconAriaHidden,
        'aria-label': iconAriaLabel,
    }

    if (IconSVG) {
        return (
            <IconSVG
                {...iconProps}
                width={iconSize}
                height={iconSize}
            />
        );
    } else if (AppIcons) {
        return (
            <AppIcons
                {...iconProps}
                name={icon}
                size={iconSize}
            />
        );
    } else {
        return (
            <CustomIcon
                {...iconProps}
                name={icon}
                size={iconSize}
            />
        );
    }
}

// propTypes für Funktionen wird in react.js 19 entfernt
IconsOpenasist.propTypes = {
    icon: PropTypes.string,
    iconSVG: PropTypes.func,
    size: PropTypes.number,
    color: PropTypes.string
};

export default IconsOpenasist;
