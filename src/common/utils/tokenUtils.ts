/**
 * Extracts a token from the header of a request.
 *
 * @param {Request} request - The request object.
 * @returns {string | undefined} - The extracted token, or undefined if no token was found.
 */
import {Request} from 'express'
import {JwtService} from '@nestjs/jwt'

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.cookie?.split('=') ?? []
  return type === 'Authorization' ? token.split(';')[0] : undefined
}

/**
 * Verify the token and extracts the payload from it.
 *
 * @param token - The token to extract the payload from.
 * @param jwtService - The JWT service.
 * @return {username: string; roles: string[]} - The extracted payload.
 */
export function extractPayloadFromVerifiedToken(
  token: string,
  jwtService: JwtService,
): {username: string; roles: string[]} {
  return jwtService.verify(token, {
    secret: process.env.JWT_SECRET_KEY,
  }) as {username: string; roles: string[]}
}
