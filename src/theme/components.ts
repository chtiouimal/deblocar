export const components = {
  Button: {
    defaultProps: {
      color: "glowingRed",
      radius: "6px",
    },
    styles: {
      root: {
        fontFamily: "Poppins, sans-serif",
        fontWeight: 400,
        letterSpacing: "0.04em",
        fontSize: "0.875rem",
        padding: "0px 24px",
        border: "none",
        transition: "opacity 0.2s ease",
        backgroundColor: "#DC1F26",
        maxHeight: "31px",
        "&:hover": {
          opacity: 0.92,
          transform: "translateY(-1px)",
        },
      },
    },
  },
  TextInput: {
    defaultProps: {
      variant: "unstyled",
    },
    styles: {
      root: {
        position: "relative",
      },
      input: {
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "0.5px solid rgba(244, 239, 231, 0.1)",
        borderRadius: 0,
        backgroundColor: "transparent",
        padding: "10px 0",
        transition: "border-color 0.2s ease",
      },
      label: {
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: "6px",
      },
      error: {
        position: "absolute",
        bottom: "-16px",
        left: 0,
        fontSize: 10,
        whiteSpace: "nowrap",
      },
    },
  },
  Textarea: {
    defaultProps: {
      variant: "unstyled",
    },
    styles: {
      root: {
        position: "relative",
      },
      input: {
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "0.5px solid rgba(244, 239, 231, 0.1)",
        borderRadius: 0,
        backgroundColor: "transparent",
        padding: "10px 0",
        transition: "border-color 0.2s ease",
      },
      label: {
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: "6px",
      },
      error: {
        position: "absolute",
        bottom: "-16px",
        left: 0,
        fontSize: 10,
        whiteSpace: "nowrap",
      },
    },
  },
  PasswordInput: {
    defaultProps: {
      variant: "unstyled",
    },
    styles: {
      root: {
        position: "relative",
      },
      input: {
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "0.5px solid rgba(244, 239, 231, 0.1)",
        borderRadius: 0,
        backgroundColor: "transparent",
        padding: "10px 0",
        transition: "border-color 0.2s ease",
      },
      label: {
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: "6px",
      },
      error: {
        position: "absolute",
        bottom: "-16px",
        left: 0,
        fontSize: 10,
        whiteSpace: "nowrap",
      },
    },
  },
  DatePickerInput: {
    defaultProps: {
      variant: "unstyled",
    },
    styles: {
      root: {
        position: "relative",
      },
      input: {
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "0.5px solid rgba(244, 239, 231, 0.1)",
        borderRadius: 0,
        backgroundColor: "transparent",
        padding: "10px 0",
        transition: "border-color 0.2s ease",
      },
      label: {
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: "6px",
      },
      error: {
        position: "absolute",
        bottom: "-16px",
        left: 0,
        fontSize: 10,
        whiteSpace: "nowrap",
      },
    },
  },
  TimeInput: {
    defaultProps: {
      variant: "unstyled",
    },
    styles: {
      root: {
        position: "relative",
      },
      input: {
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "0.5px solid rgba(244, 239, 231, 0.1)",
        borderRadius: 0,
        backgroundColor: "transparent",
        padding: "10px 0",
        transition: "border-color 0.2s ease",
      },
      label: {
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: "6px",
      },
      error: {
        position: "absolute",
        bottom: "-16px",
        left: 0,
        fontSize: 10,
        whiteSpace: "nowrap",
      },
    },
  },
  ColorInput: {
    defaultProps: {
      variant: "unstyled",
    },
    styles: {
      root: {
        position: "relative",
      },
      input: {
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "0.5px solid rgba(244, 239, 231, 0.1)",
        borderRadius: 0,
        backgroundColor: "transparent",
        padding: "10px 0 10px 40px",
        transition: "border-color 0.2s ease",
      },
      label: {
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: "6px",
      },
      error: {
        position: "absolute",
        bottom: "-16px",
        left: 0,
        fontSize: 10,
        whiteSpace: "nowrap",
      },
    },
  },
  Select: {
    defaultProps: {
      variant: "unstyled",
    },
    styles: {
      root: {
        position: "relative",
      },
      input: {
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "0.5px solid rgba(244, 239, 231, 0.1)",
        borderRadius: 0,
        backgroundColor: "transparent",
        padding: "10px 0",
        transition: "border-color 0.2s ease",
      },
      label: {
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: "6px",
      },
      dropdown: {
        backgroundColor: "#111",
        border: "1px solid rgba(244, 239, 231, 0.1)",
      },
      option: {
        padding: "10px 14px",
      },
      rightSection: {
        color: "rgba(255, 255, 255, 0.6)",
      },
      error: {
        position: "absolute",
        bottom: "-16px",
        left: 0,
        fontSize: 10,
        whiteSpace: "nowrap",
      },
    },
  },
  MultiSelect: {
    defaultProps: {
      variant: "unstyled",
    },
    styles: {
      root: {
        position: "relative",
      },
      input: {
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "0.5px solid rgba(244, 239, 231, 0.1)",
        borderRadius: 0,
        backgroundColor: "transparent",
        padding: "10px 0",
        transition: "border-color 0.2s ease",
      },
      label: {
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(255, 255, 255, 0.6)",
        marginBottom: "6px",
      },
      dropdown: {
        backgroundColor: "#111",
        border: "1px solid rgba(244, 239, 231, 0.1)",
      },
      option: {
        padding: "10px 14px",
      },
      rightSection: {
        color: "rgba(255, 255, 255, 0.6)",
      },
      error: {
        position: "absolute",
        bottom: "-16px",
        left: 0,
        fontSize: 10,
        whiteSpace: "nowrap",
      },
    },
  },
  Checkbox: {
    defaultProps: {
      color: "glowingRed",
      radius: "2px",
      size: "sm",
    },

    styles: {
      root: {
        cursor: "pointer",
      },

      body: {
        alignItems: "center",
        gap: "12px",
      },

      input: {
        width: "20px",
        height: "20px",
        border: "1px solid rgba(255,255,255,0.2)",
        "&:checked, &[data-indeterminate], &[data-checked]": {
          boxShadow: "0 0 30px rgba(220,31,38,.4)",
        },
      },
      icon: {
        color: "white",
      },

      label: {
        fontFamily: "Poppins, sans-serif",
        fontSize: "18px",
        fontWeight: 400,
        color: "rgba(255,255,255,0.8)",
        cursor: "pointer",
        paddingLeft: "2px",
      },
    },
  },
};
