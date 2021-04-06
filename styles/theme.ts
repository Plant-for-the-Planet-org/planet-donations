import css from 'styled-jsx/css';
import theme from './themeProperties';

const { light, dark, fontSizes, primaryColor,primaryDarkColor,fontFamily } = theme;

const globalStyles = css.global`
  :root {
    --primary-font-family: ${fontFamily};
    --title-size: ${fontSizes.titleSize};
    --sub-title-size: ${fontSizes.subTitleSize};
    --primary-color: ${primaryColor};
    --primary-dark-color: ${primaryDarkColor};
  }
  .theme-light {
    --primary-font-color: ${light.primaryFontColor};
    --divider-color: ${light.dividerColor};
    --secondary-color: ${light.secondaryColor};
    --blueish-grey: ${light.blueishGrey};
    --background-color: ${light.backgroundColor};
    --highlight-background: ${light.highlightBackground};
    --light: ${light.light};
    --dark: ${light.dark};
    --danger-color: ${light.dangerColor};
  }
  .theme-dark {
    --primary-font-color: ${dark.primaryFontColor};
    --divider-color: ${dark.dividerColor};
    --secondary-color: ${dark.secondaryColor};
    --blueish-grey: ${dark.blueishGrey};
    --background-color: ${dark.backgroundColor};
    --highlight-background: ${dark.highlightBackground};
    --light: ${dark.light};
    --dark: ${dark.dark};
    --danger-color: ${dark.dangerColor};
  }
`;

export default globalStyles;