export default function (theme) {
  return {
    container: {
      flex: 1,
    },
    warningContainer: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      height: 30,
      justifyContent: "center",
      backgroundColor: theme.colors.error,
    },
    warningText: {
      color: theme.colors.errorText,
      textAlign: "center",
    },
  };
}
