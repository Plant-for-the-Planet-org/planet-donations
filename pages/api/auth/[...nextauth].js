import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

console.log('process.env.AUTH0_CLIENT_ID',process.env.AUTH0_CLIENT_ID);

console.log('process.env.AUTH0_CLIENT_SECRET',process.env.AUTH0_CLIENT_SECRET);

console.log('process.env.AUTH0_CUSTOM_DOMAIN',process.env.AUTH0_CUSTOM_DOMAIN);

export default NextAuth({
  providers: [
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_CUSTOM_DOMAIN,
    })
  ],
  debug: true,
})
