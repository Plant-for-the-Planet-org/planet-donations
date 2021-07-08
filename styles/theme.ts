import css from 'styled-jsx/css';
import theme from './themeProperties';

const { light, dark, fontSizes, primaryColor,primaryDarkColor,fontFamily,darkGrey , grey} = theme;

const globalStyles = css.global`
  :root {
    --primary-font-family: ${fontFamily};
    --title-size: ${fontSizes.titleSize};
    --sub-title-size: ${fontSizes.subTitleSize};
    --primary-color: ${primaryColor};
    --primary-dark-color: ${primaryDarkColor};
    --grey-color: ${grey};
    --dark-grey-color: ${darkGrey};
  }
  .theme-light {
    --primary-font-color: ${light.primaryFontColor};
    --divider-color: ${light.dividerColor};
    --secondary-color: ${light.secondaryColor};
    --background-color: ${light.backgroundColor};
    --highlight-background: ${light.highlightBackground};
    --light: ${light.light};
    --dark: ${light.dark};
    --danger-color: ${light.dangerColor};
    --background-color-dark: ${light.backgroundColorDark};
  }
  .theme-dark {
    --primary-font-color: ${dark.primaryFontColor};
    --divider-color: ${dark.dividerColor};
    --secondary-color: ${dark.secondaryColor};
    --background-color: ${dark.backgroundColor};
    --highlight-background: ${dark.highlightBackground};
    --light: ${dark.light};
    --dark: ${dark.dark};
    --danger-color: ${dark.dangerColor};
    --background-color-dark: ${dark.backgroundColorDark};
  }
`;

export default globalStyles;