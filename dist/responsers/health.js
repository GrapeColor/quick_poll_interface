"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Health = void 0;
const constants_1 = require("../constants");
var Health;
(function (Health) {
    let shardCount = 0;
    let statuses = [];
    function detectfailure() {
        const now = Date.now();
        for (const status of statuses)
            if (now - status.lastUpdateTimestamp > constants_1.STATUS_UPDATE_SPAN * 2)
                status.operational = false;
    }
    setInterval(() => detectfailure(), constants_1.STATUS_UPDATE_SPAN);
    function get(_, response) {
        const completed = shardCount === statuses.reduce(count => ++count, 0);
        const body = {
            ready: completed || process.uptime() > constants_1.STATUS_UPDATE_SPAN * 2,
            completed,
            updateSpan: constants_1.STATUS_UPDATE_SPAN,
            totalGuildCount: statuses.reduce((total, { guildCount }) => total + guildCount, 0),
            totalUserCount: statuses.reduce((total, { userCount }) => total + userCount, 0),
            statuses,
        };
        response
            .header('www-authenticate', 'realm=""')
            .contentType('application/json')
            .send(body);
    }
    Health.get = get;
    function post(request, response) {
        const token = request.headers['www-authenticate'];
        if (token !== `Bearer ${constants_1.FAMILY_PASS_PHRASE}`) {
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
        if (shardCount < statuses.length)
            statuses = statuses.slice(0, shardCount);
        get(request, response);
    }
    Health.post = post;
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
            .header('www-authenticate', value)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc3BvbnNlcnMvaGVhbHRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDRDQUFzRTtBQUV0RSxJQUFpQixNQUFNLENBbUh0QjtBQW5IRCxXQUFpQixNQUFNO0lBMEJyQixJQUFJLFVBQVUsR0FBVyxDQUFDLENBQUM7SUFDM0IsSUFBSSxRQUFRLEdBQXFCLEVBQUUsQ0FBQztJQUVwQyxTQUFTLGFBQWE7UUFDcEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXZCLEtBQUssTUFBTSxNQUFNLElBQUksUUFBUTtZQUMzQixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsbUJBQW1CLEdBQUcsOEJBQWtCLEdBQUcsQ0FBQztnQkFDM0QsTUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQUVELFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsRUFBRSw4QkFBa0IsQ0FBQyxDQUFDO0lBRXZELFNBQWdCLEdBQUcsQ0FBQyxDQUFVLEVBQUUsUUFBa0I7UUFDaEQsTUFBTSxTQUFTLEdBQUcsVUFBVSxLQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV0RSxNQUFNLElBQUksR0FBaUI7WUFDekIsS0FBSyxFQUFFLFNBQVMsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsOEJBQWtCLEdBQUcsQ0FBQztZQUM3RCxTQUFTO1lBQ1QsVUFBVSxFQUFFLDhCQUFrQjtZQUM5QixlQUFlLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FDOUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLFVBQVUsRUFBRSxDQUFDLENBQ2pEO1lBQ0QsY0FBYyxFQUFHLFFBQVEsQ0FBQyxN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