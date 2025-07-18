export default {
  auth: {
    domain: "dev-u4k7xup0c3hwxmb4.us.auth0.com",
    clientId: "FXK6XzX1pvFlxnmaZnoLJoCcnhw20wwq",
    authorizationParams: {
      redirect_uri: "http://localhost:4200",
      audience: "http://localhost:8080",
    },
  },
  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/userPosts/**',
      'http://localhost:8080/api/profile'
    ],
  },
}