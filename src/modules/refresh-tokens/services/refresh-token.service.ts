import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly refreshTokenRepo: RefreshTokenRepository) {}
}
