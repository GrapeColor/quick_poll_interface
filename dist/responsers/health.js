"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Health = void 0;
const constants_1 = require("../constants");
var Health;
(function (Health) {
    let shardCount = 0;
    const statuses = new Map;
    function sweepStatuses() {
        const now = Date.now();
        statuses.forEach((status, key) => {
            if (now - status.lastUpdateTimestamp > constants_1.STATUS_UPDATE_SPAN * 2)
                statuses.delete(key);
        });
    }
    setInterval(() => sweepStatuses(), constants_1.STATUS_UPDATE_SPAN);
    function get(_, response) {
        let totalGuildCount = 0;
        statuses.forEach(({ guildCount }) => totalGuildCount += guildCount);
        let totalUserCount = 0;
        statuses.forEach(({ userCount }) => totalUserCount += userCount);
        const statusesMap = {};
        statuses.forEach((status, key) => statusesMap[key] = status);
        const body = {
            completed: !!shardCount && statuses.size === shardCount,
            totalGuildCount,
            totalUserCount,
            statuses: statusesMap,
            updateSpan: constants_1.STATUS_UPDATE_SPAN,
        };
        response
            .header('WWW-Authenticate', 'realm=""')
            .contentType('application/json')
            .send(body);
    }
    Health.get = get;
    function post(request, response) {
        const body = request.body;
        if (!varifyRequest(request, response, body))
            return;
        statuses.set(body.shardID, {
            ...body,
            lastUpdateTimestamp: Date.now(),
        });
        shardCount = body.shardCount;
        get(request, response);
    }
    Health.post = post;
    function varifyRequest(request, response, body) {
        const token = request.headers['www-authenticate'];
        if (token !== `Bearer ${constants_1.FAMILY_PASS_PHRASE}`) {
            rejectToken(response, token);
            return false;
        }
        if (!request.is('application/json') || !isShardStatus(body)) {
            rejectBody(response);
            return false;
        }
        return true;
    }
    function isShardStatus(body) {
        return (body
            && typeof body.shardID === 'number'
            && typeof body.shardCount === 'number'
            && typeof body.wsStatus === 'number'
            && typeof body.guildCount === 'number'
            && typeof body.userCount === 'number');
    }
    function rejectToken(response, token) {
        const value = token
            ? 'Bearer error="invalid_token"'
            : 'Bearer realm="token_required"';
        response
            .status(401)
            .header('WWW-Authenticate', value)
            .contentType('application/json')
            .send({});
    }
    function rejectBody(response) {
        response
            .status(400)
            .contentType('application/json')
            .send({});
    }
})(Health = exports.Health || (exports.Health = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc3BvbnNlcnMvaGVhbHRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDRDQUFzRTtBQUV0RSxJQUFpQixNQUFNLENBa0h0QjtBQWxIRCxXQUFpQixNQUFNO0lBZ0JyQixJQUFJLFVBQVUsR0FBVyxDQUFDLENBQUM7SUFDM0IsTUFBTSxRQUFRLEdBQWdDLElBQUksR0FBRyxDQUFDO0lBRXRELFNBQVMsYUFBYTtRQUNwQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFdkIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUMvQixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsbUJBQW1CLEdBQUcsOEJBQWtCLEdBQUcsQ0FBQztnQkFDM0QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxFQUFFLEVBQUUsOEJBQWtCLENBQUMsQ0FBQztJQUV2RCxTQUFnQixHQUFHLENBQUMsQ0FBVSxFQUFFLFFBQWtCO1FBQ2hELElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQztRQUN4QixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsZUFBZSxJQUFJLFVBQVUsQ0FBQyxDQUFDO1FBRXBFLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztRQUN2QixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsY0FBYyxJQUFJLFNBQVMsQ0FBQyxDQUFDO1FBRWpFLE1BQU0sV0FBVyxHQUFzQyxFQUFFLENBQUM7UUFDMUQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxH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