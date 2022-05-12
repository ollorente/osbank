// @ts-check
module.exports = {
  client: {
    service: {
      name: 'osbank',
      // URL to the GraphQL API
      url: '/.netlify/functions/graphql'
    },
    // Files processed by the extension
    includes: ['src/**/*.vue', 'src/**/*.js']
  }
}
