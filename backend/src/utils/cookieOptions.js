const commonOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

// 2 hours cookie lifespan for Access Token
export const accessTokenCookieOptions = {
  ...commonOptions,
  maxAge: 2 * 60 * 60 * 1000,
};

// 30 days cookie lifespan for Refresh Token
export const refreshTokenCookieOptions = {
  ...commonOptions,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};
