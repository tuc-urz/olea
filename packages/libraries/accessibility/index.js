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

import { useState, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Liefert, ob in den Systemeinstellungen "Bewegung reduzieren" aktiviert ist.
 * Änderungen der Einstellung werden live übernommen, die Komponente wird dann neu gerendert.
 *
 * Bis die Einstellung abgefragt wurde (oder falls sie nicht verfügbar ist), wird `false` geliefert.
 *
 * @returns {boolean} true, wenn Animationen reduziert werden sollen, sonst false
 * @example
 * const isReduceMotionEnabled = useReduceMotion();
 *
 * if (!isReduceMotionEnabled) {
 *     animation.start();
 * }
 */
export function useReduceMotion() {
    const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);

    useEffect(
        () => {
            // Verhindert, dass nach dem Unmount oder nach einer Änderungsmeldung
            // noch das (dann veraltete) Ergebnis der ersten Abfrage gesetzt wird.
            let isInitialValueOutdated = false;

            const reduceMotionSubscription = AccessibilityInfo.addEventListener(
                'reduceMotionChanged',
                isEnabled => {
                    isInitialValueOutdated = true;
                    setIsReduceMotionEnabled(isEnabled);
                }
            );

            AccessibilityInfo.isReduceMotionEnabled()
                .then(
                    isEnabled => {
                        if (!isInitialValueOutdated) {
                            setIsReduceMotionEnabled(isEnabled);
                        }
                    }
                )
                .catch(reason => console.debug(useReduceMotion.name, ':', 'reduce motion setting not available', ':', reason));

            return () => {
                isInitialValueOutdated = true;
                reduceMotionSubscription?.remove();
            };
        },
        []
    );

    return isReduceMotionEnabled;
}
