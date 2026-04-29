export const typography = {
  fontFamily: "Poppins, sans-serif",

  headings: {
    fontFamily: "Montserrat, sans-serif",

    sizes: {
      h1: { fontSize: "4rem", fontWeight: "700", lineHeight: "1.1" }, // 64px
      h2: { fontSize: "3.5rem", fontWeight: "600", lineHeight: "1.15" }, // 56px
      h3: { fontSize: "2.5rem", fontWeight: "600", lineHeight: "1.2" }, // 40px
      h4: { fontSize: "1.75rem", fontWeight: "600", lineHeight: "1.3" }, // 28px
      h5: { fontSize: "1.25rem", fontWeight: "500", lineHeight: "1.4" }, // 20px
      h6: { fontSize: "1rem", fontWeight: "500", lineHeight: "1.4" }, // 16px
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
