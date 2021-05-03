import { Request, Response } from 'express';
import { FAMILY_PASS_PHRASE } from '../constants';

export namespace Health {
  interface ShardStatus {
    shardID: number;
    shardCount: number;
    wsStatus: number;
    guildCount: number;
    userCount: number;
  }

  const statuses: Map<number, ShardStatus> = new Map;

  export function get(_: Request, response: Response): void {
    let totalGuildCount = 0;
    statuses.forEach(({ guildCount }) => totalGuildCount += guildCount);

    let totalUserCount = 0;
    statuses.forEach(({ userCount }) => totalUserCount += userCount);

    const statusesMap: { [key: number]: ShardStatus } = {};
    statuses.forEach((status, key) => statusesMap[key] = status);

    const body = {
      totalGuildCount,
      totalUserCount,
      statuses: statusesMap,
    };

    response
      .header('WWW-Authenticate', 'realm=""')
      .contentType('application/json')
      .send(body);
  }

  export function post(request: Request, response: Response): void {
    const body = request.body;
    if (!varifyRequest(request, response, body)) return; 

    statuses.set(body.shardID, body);

    get(request, response);
  }

  function varifyRequest(
    request: Request, response: Response, body: any
  ): body is ShardStatus {
    const token = request.headers['www-authenticate'];

    if (token !== `Bearer ${FAMILY_PASS_PHRASE}`) {
      rejectToken(response, token);
      return false;
    }

    if (!request.is('application/json') || !isShardStatus(body)) {
      rejectBody(response);
      return false;
    }

    return true;
  }

  function isShardStatus(body: any): body is ShardStatus {
    return (
      body
      && typeof body.shardID    === 'number'
      && typeof body.shardCount === 'number'
      && typeof body.wsStatus   === 'number'
      && typeof body.guildCount === 'number'
      && typeof body.userCount  === 'number'
    )
  }

  function rejectToken(response: Response, token: string | undefined): void {
    const value = token
      ? 'Bearer error="invalid_token"'
      : 'Bearer realm="token_required"';

    response
      .status(401)
      .header('WWW-Authenticate', value)
      .contentType('application/json')
      .send({});
  }

  function rejectBody(response: Response): void {
    response
      .status(400)
      .contentType('application/json')
      .send({});
  }
}
