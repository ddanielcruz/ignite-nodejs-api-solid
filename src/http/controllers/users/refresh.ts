import type { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  // Verify the JWT token from the cookie.
  await request.jwtVerify({ onlyCookie: true })

  const { sub } = request.user
  const token = await reply.jwtSign({}, { sign: { sub } })
  const refreshToken = await reply.jwtSign(
    {},
    { sign: { sub, expiresIn: '7d' } },
  )

  return reply
    .status(200)
    .setCookie('refreshToken', refreshToken, {
      path: '/', // Gives access to all routes in the application.
      secure: true, // Ensures the browser only sends the cookie over HTTPS.
      sameSite: true, // Ensures the browser only sends the cookie with requests to the same domain.
      httpOnly: true, // Ensures the cookie is sent to the server only. This prevents client-side JavaScript from reading the cookie.
    })
    .send({ token })
}
