import { Request, Response } from 'express';
import { FAMILY_PASS_PHRASE, STATUS_UPDATE_SPAN } from '../constants';

export namespace Health {
  interface CommonStatus {
    shardID   : number;
    wsStatus  : number; // Status value of the web socket on that shard.
    guildCount: number;
    userCount : number;
  }

  interface RegisterStatus extends CommonStatus {
    operational        : boolean; // Indicates whether the shard is operational.
    lastUpdateTimestamp: number;
  }

  interface ShardStatus extends CommonStatus {
    shardCount: number;
  }

  interface EntireStatus {
    ready          : boolean; // The data is complete or enough time has passed to collect the data.
    completed      : boolean; // Indicates that the data for all shards has been completed at least once.
    updateSpan     : number;  // Interval to have data sent from a shard.
    totalGuildCount: number;
    totalUserCount : number;
    statuses       : RegisterStatus[];
  }

  let shardCount: number = 0;
  let statuses: RegisterStatus[] = [];

  function detectfailure(): void {
    const now = Date.now();

    for (const status of statuses)
      if (now - status.lastUpdateTimestamp > STATUS_UPDATE_SPAN * 2)
        status.operational = false;
  }

  setInterval(() => detectfailure(), STATUS_UPDATE_SPAN);

  export function get(_: Request, response: Response): void {
    const completed = shardCount === statuses.reduce(count => ++count, 0);

    const body: EntireStatus = {
      ready: completed || process.uptime() > STATUS_UPDATE_SPAN * 2,
      completed,
      updateSpan: STATUS_UPDATE_SPAN,
      totalGuildCount: statuses.reduce(
        (total, { guildCount }) => total + guildCount, 0
      ),
      totalUserCount : statuses.reduce(
        (total, { userCount  }) => total + userCount , 0
      ),
      statuses,
    };

    response
      .header('www-authenticate', 'realm=""')
      .contentType('application/json')
      .send(body);
  }

  export function post(request: Request, response: Response): void {
    const token = request.headers['www-authenticate'];
    if (token !== `Bearer ${FAMILY_PASS_PHRASE}`) {
      rejectToken(response, token);
      return;
    }

    const body = request.body;
    if (!isShardStatus(body)) {
      rejectBody(response);
      return;
    }

    statuses[body.shardID] = {
      ...body,
      operational: true,
      lastUpdateTimestamp: Date.now(),
    };
    shardCount = body.shardCount;

    if (shardCount < statuses.length) statuses = statuses.slice(0, shardCount);

    get(request, response);
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
