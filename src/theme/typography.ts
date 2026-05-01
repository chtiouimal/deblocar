export const typography = {
  fontFamily: "Poppins, sans-serif",

  headings: {
    fontFamily: "Montserrat, sans-serif",

    sizes: {
      h1: {
        fontSize: "clamp(2.625rem, 5vw, 4.5rem)",
        fontWeight: "400",
        lineHeight: "1.1",
      }, // 72px
      h2: { fontSize: "3rem", fontWeight: "400", lineHeight: "1.15" }, // 48px
      h3: { fontSize: "1.5rem", fontWeight: "400", lineHeight: "1.2" }, // 24px
      h4: { fontSize: "1.25rem", fontWeight: "400", lineHeight: "1.3" }, // 20px
      h5: { fontSize: "1rem", fontWeight: "400", lineHeight: "1.4" }, // 16px
      h6: { fontSize: "0.875rem", fontWeight: "400", lineHeight: "1.4" }, // 14px
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
