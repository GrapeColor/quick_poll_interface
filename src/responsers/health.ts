import { Request, Response } from 'express';
import { FAMILY_PASS_PHRASE, STATUS_UPDATE_SPAN } from '../constants';

export namespace Health {
  interface CommonStatus {
    shardID   : number;
    wsStatus  : number;
    guildCount: number;
    userCount : number;
  }

  interface RegisterStatus extends CommonStatus {
    operational         : boolean;
    lastUpdateTimestamp: number;
  }

  interface ShardStatus extends CommonStatus {
    shardCount: number;
  }

  interface ReceiveStatus {
    ready          : boolean;
    updateSpan     : number;
    totalGuildCount: number;
    totalUserCount : number;
    statuses       : { [key: number]: RegisterStatus };
  }

  let shardCount: number = 0;
  const statuses: Map<number, RegisterStatus> = new Map;

  function detectfailure(): void {
    const now = Date.now();

    statuses.forEach(status => {
      if (now - status.lastUpdateTimestamp > STATUS_UPDATE_SPAN * 2)
        status.operational = false;
    });
  }

  setInterval(() => detectfailure(), STATUS_UPDATE_SPAN);

  export function get(_: Request, response: Response): void {
    let totalGuildCount = 0;
    statuses.forEach(({ guildCount }) => totalGuildCount += guildCount);

    let totalUserCount = 0;
    statuses.forEach(({ userCount }) => totalUserCount += userCount);

    const statusesMap: { [key: number]: RegisterStatus } = {};
    statuses.forEach((status, key) => statusesMap[key] = status);

    const body: ReceiveStatus = {
      ready     : process.uptime() > STATUS_UPDATE_SPAN * 2,
      updateSpan: STATUS_UPDATE_SPAN,
      totalGuildCount,
      totalUserCount,
      statuses  : statusesMap,
    };

    response
      .header('www-authenticate', 'realm=""')
      .contentType('application/json')
      .send(body);
  }

  export function post(request: Request, response: Response): void {
    const body = request.body;
    if (!varifyRequest(request, response, body)) return; 

    statuses.set(body.shardID, {
      ...body,
      operational: true,
      lastUpdateTimestamp: Date.now(),
    });
    shardCount = body.shardCount;

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
    );
  }

  function rejectToken(response: Response, token: string | undefined): void {
    const value = token
      ? 'Bearer error="invalid_token"'
      : 'Bearer realm="token_required"';

    response
      .status(401)
      .header('www-authenticate', value)
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
