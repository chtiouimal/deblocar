export const typography = {
  fontFamily: "Poppins, sans-serif",

  headings: {
    fontFamily: "Montserrat, sans-serif",

    sizes: {
      h1: {
        fontSize: "clamp(2.625rem, 5vw, 4.5rem)",
        fontWeight: "400",
        lineHeight: "1.1",
      },

      h2: {
        fontSize: "clamp(2rem, 4vw, 3rem)", // 32 → 48
        fontWeight: "400",
        lineHeight: "1.1",
      },

      h3: {
        fontSize: "clamp(1.5rem, 3vw, 2rem)", // 24 → 32
        fontWeight: "400",
        lineHeight: "1.15",
      },

      h4: {
        fontSize: "clamp(1.25rem, 2.2vw, 1.5rem)", // 20 → 24
        fontWeight: "400",
        lineHeight: "1.2",
      },

      h5: {
        fontSize: "clamp(1rem, 1.8vw, 1.25rem)", // 16 → 20
        fontWeight: "400",
        lineHeight: "1.3",
      },

      h6: {
        fontSize: "clamp(0.875rem, 1.5vw, 1rem)", // 14 → 16
        fontWeight: "400",
        lineHeight: "1.35",
      },
    },
  },

  // 👇 body text system
  fontSizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px (base)
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
  },

  lineHeights: {
    xs: "1.2",
    sm: "1.3",
    md: "1.5",
    lg: "1.6",
    xl: "1.7",
  },

  // 👇 paragraph styles (for consistency in UI)
  paragraph: {
    fontFamily: "Poppins, sans-serif",
    fontSize: "1.125rem", // 18px
    lineHeight: "1.7",
    fontWeight: 400,
  },

  text: {
    fontFamily: "Poppins, sans-serif",
    fontSize: "1rem", // 16px
    lineHeight: "1.6",
    fontWeight: 400,
  },
};
