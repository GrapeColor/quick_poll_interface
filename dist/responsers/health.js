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
        const completed = shardCount === statuses.length;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc3BvbnNlcnMvaGVhbHRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDRDQUFzRTtBQUV0RSxJQUFpQixNQUFNLENBbUh0QjtBQW5IRCxXQUFpQixNQUFNO0lBMEJyQixJQUFJLFVBQVUsR0FBVyxDQUFDLENBQUM7SUFDM0IsSUFBSSxRQUFRLEdBQXFCLEVBQUUsQ0FBQztJQUVwQyxTQUFTLGFBQWE7UUFDcEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXZCLEtBQUssTUFBTSxNQUFNLElBQUksUUFBUTtZQUMzQixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsbUJBQW1CLEdBQUcsOEJBQWtCLEdBQUcsQ0FBQztnQkFDM0QsTUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQUVELFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxhQUFhLEVBQUUsRUFBRSw4QkFBa0IsQ0FBQyxDQUFDO0lBRXZELFNBQWdCLEdBQUcsQ0FBQyxDQUFVLEVBQUUsUUFBa0I7UUFDaEQsTUFBTSxTQUFTLEdBQUcsVUFBVSxLQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFFakQsTUFBTSxJQUFJLEdBQWlCO1lBQ3pCLEtBQUssRUFBRSxTQUFTLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLDhCQUFrQixHQUFHLENBQUM7WUFDN0QsU0FBUztZQUNULFVBQVUsRUFBRSw4QkFBa0I7WUFDOUIsZUFBZSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQzlCLENBQUMsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxVQUFVLEVBQUUsQ0FBQyxDQUNqRDtZQUNELGNBQWMsRUFBRyxRQUFRLENBQUMsTUFBTSxDQUM5QixDQUFDLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRyxFQUFFLEVBQUUs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