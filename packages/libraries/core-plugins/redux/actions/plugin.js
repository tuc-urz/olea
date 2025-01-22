export const onComponentReplace = (componentToReplace, component) => {
    return {
        type: componentToReplace,
        component
    }
};

export const onStylesReplace = (stylesToReplace, styles) => {
    return {
        type: stylesToReplace,
        styles
    }
};