import { Platform } from 'react-native';

const fonts = Platform.select({
    web: {
        regular: {
            fontFamily: 'poppins-regular',
            fontWeight: '400'
        },
        medium: {
            fontFamily: 'poppins-semi-bold',
            fontWeight: '400'
        },
        light: {
            fontFamily: 'poppins-regular',
            fontWeight: '300'
        },
        thin: {
            fontFamily: 'poppins-regular',
            fontWeight: '100'
        },
        bold: {
            fontFamily: 'poppins-bold',
            fontWeight: '800'
        },
    },
    ios: {
        regular: {
            fontFamily: 'poppins-regular',
            fontWeight: '400'
        },
        medium: {
            fontFamily: 'poppins-semi-bold',
            fontWeight: '400'
        },
        light: {
            fontFamily: 'poppins-regular',
            fontWeight: '300'
        },
        thin: {
            fontFamily: 'poppins-regular',
            fontWeight: '100'
        },
        bold: {
            fontFamily: 'poppins-bold',
            fontWeight: '800'
        },
    },
    default: {
        regular: {
            fontFamily: 'poppins-regular',
            fontWeight: '400'
        },
        medium: {
            fontFamily: 'poppins-semi-bold',
            fontWeight: '400'
        },
        light: {
            fontFamily: 'poppins-regular',
            fontWeight: '300'
        },
        thin: {
            fontFamily: 'poppins-regular',
            fontWeight: '100'
        },
        bold: {
            fontFamily: 'poppins-bold',
            fontWeight: '800'
        },
    },
});

export default fonts;
