export const env: string = process.env.NODE_ENV || 'development';

export const mustHave = (key: string) => {
  if (env === 'development' || env === 'testing') return process.env[key];
  if (!process.env[key]) throw new Error(`Missing ENV ${key}`);
  return process.env[key];
};
