export default function (theme) {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    title: {
      fontSize: theme.fontSizes.m,
      color: theme.colors.text,
      fontWeight: 'bold',
      textAlign: 'auto',
      marginStart: 10
    },
    checkboxContainer: {
      backgroundColor: 'transparent',
      paddingHorizontal: 14,
      paddingVertical: 14
    }
  }
}
