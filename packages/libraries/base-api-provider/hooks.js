import { useMemo } from 'react';

import { useTheme } from 'react-native-paper';

import { useAccessToken, useIdToken, useAccessToken } from '@openasist/context-user';

export function useProvider(provider, providersInitializers) {
    const theme = useTheme();
    const appSettings = theme?.appSettings;
    const accessToken = useAccessToken();
    const idToken = useIdToken();
    const providerInitializer = providersInitializers?.[provider];

    return useMemo(
        () => {
            return providerInitiliser?.({
                appSettings,
                accessToken,
                idToken,
            })
        },
        [provider, providerInitializer, appSettings, accessToken, idToken]
    )
}