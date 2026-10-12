export default function(theme) {
  return {
      container: {
          flex: 1,
          backgroundColor: theme.colors.background,
      },
      title: {
          fontSize: theme.fontSizes.m,
          color: theme.colors.text,
      },
      checkboxContainer: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          paddingVertical: 14,
      },
  };
}