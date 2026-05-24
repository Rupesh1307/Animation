// src/constants/typography.js

export const fonts = {
  poppins: {
    black: 'Poppins-Black',
    bold: 'Poppins-Bold',
    semiBold: 'Poppins-SemiBold',
  },
  inter: {
    thin: 'Inter-Thin',
    light: 'Inter-Light', 
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
};

export const typography = {
  // Headings → Poppins
  h1: { fontFamily: fonts.poppins.black, fontSize: 32, lineHeight: 40 },
  h2: { fontFamily: fonts.poppins.bold, fontSize: 24, lineHeight: 32 },
  h3: { fontFamily: fonts.poppins.bold, fontSize: 20, lineHeight: 28 },
  h4: { fontFamily: fonts.poppins.semiBold, fontSize: 18, lineHeight: 24 },
  h5: { fontFamily: fonts.poppins.semiBold, fontSize: 16, lineHeight: 22 },

  // Body & UI → Inter
  bodyLg: { fontFamily: fonts.inter.regular, fontSize: 16, lineHeight: 24 },
  bodySm: { fontFamily: fonts.inter.regular, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fonts.inter.medium, fontSize: 14, lineHeight: 20 },
  button: { fontFamily: fonts.inter.semiBold, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.inter.light, fontSize: 12, lineHeight: 16 },
  overline: { fontFamily: fonts.inter.thin, fontSize: 11, lineHeight: 16 },
  strong: { fontFamily: fonts.inter.bold, fontSize: 14, lineHeight: 20 },
};
