import {root} from './path';

export const themeRootPath: string = `${root}www/themes/`;
export const defaultTheme: string = 'https://github.com/chralp/heyburrito-theme';

export const getThemeName = () => {
  if (process.env.THEME_PATH) {
    const themePath = process.env.THEME_PATH;
    const [themeName] = themePath.split('/').slice(-1);
    return themeName;
  }
  const theme = process.env.THEME_URL || defaultTheme;
  const [themeName] = theme.split('/').slice(-1);
  return themeName;
};

export const getThemePath = () => {
  if (process.env.THEME_PATH) {
    const themePath = process.env.THEME_PATH;
    if (themePath.endsWith('/')) return themePath;
    return `${themePath}/`;
  }

  const themeName = getThemeName();
  return `${themeRootPath}${themeName}/`;
};
