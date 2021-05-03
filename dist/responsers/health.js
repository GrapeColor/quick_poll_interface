"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Health = void 0;
const constants_1 = require("../constants");
var Health;
(function (Health) {
    const statuses = new Map;
    function get(_, response) {
        let totalGuildCount = 0;
        statuses.forEach(({ guildCount }) => totalGuildCount += guildCount);
        let totalUserCount = 0;
        statuses.forEach(({ userCount }) => totalUserCount += userCount);
        const statusesMap = {};
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
    Health.get = get;
    function post(request, response) {
        const body = request.body;
        if (!varifyRequest(request, response, body))
            return;
        statuses.set(body.shardID, body);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc3BvbnNlcnMvaGVhbHRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDRDQUFrRDtBQUVsRCxJQUFpQixNQUFNLENBeUZ0QjtBQXpGRCxXQUFpQixNQUFNO0lBU3JCLE1BQU0sUUFBUSxHQUE2QixJQUFJLEdBQUcsQ0FBQztJQUVuRCxTQUFnQixHQUFHLENBQUMsQ0FBVSxFQUFFLFFBQWtCO1FBQ2hELElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQztRQUN4QixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsZUFBZSxJQUFJLFVBQVUsQ0FBQyxDQUFDO1FBRXBFLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztRQUN2QixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsY0FBYyxJQUFJLFNBQVMsQ0FBQyxDQUFDO1FBRWpFLE1BQU0sV0FBVyxHQUFtQyxFQUFFLENBQUM7UUFDdkQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUU3RCxNQUFNLElBQUksR0FBRztZQUNYLGVBQWU7WUFDZixjQUFjO1lBQ2QsUUFBUSxFQUFFLFdBQVc7U0FDdEIsQ0FBQztRQUVGLFFBQVE7YUFDTCxNQUFNLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDO2FBQ3RDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQzthQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQXBCZSxVQUFHLE1Bb0JsQixDQUFBO0lBRUQsU0FBZ0IsSUFBSSxDQUFDLE9BQWdCLEVBQUUsUUFBa0I7UUFDdkQsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDO1lBQUUsT0FBTztRQUVwRCxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFakMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBUGUsV0FBSSxPQU9uQixDQUFBO0lBRUQsU0FBUyxhQUFhLENBQ3BCLE9BQWdCLEVBQUUsUUFBa0IsRUFBRSxJQUFTO1FBRS9DLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUVsRCxJQUFJLEtBQUssS0FBSyxVQUFVLDhCQUFrQixFQUFFLEVBQUU7WUFDNUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM3QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMzRCxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFNBQVMsYUFBYSxDQUFDLElBQVM7UUFDOUIsT0FBTyxDQUNMLElBQUk7ZUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLEtBQVEsUUFBUTtlQUNuQyxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssUUFBUTtlQUNuQyxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQU8sUUFBUTtlQUNuQyxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssUUFBUTtlQUNuQyxPQUFPLElBQUksQ0FBQyxTQUFTLEtBQU0sUUFBUSxDQUN2QyxDQUFBO0lBQ0gsQ0FBQztJQUVELFNBQVMsV0FBVyxDQUFDLFFBQWtCLEVBQUUsS0FBeUI7UUFDaEUsTUFBTSxLQUFLLEdBQUcsS0FBSztZQUNqQixDQUFDLENBQUMsOEJBQThCO1lBQ2hDLENBQUMsQ0FBQywrQkFBK0IsQ0FBQztRQUVwQyxRQUFRO2FBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUM7YUFDakMsV0FBVyxDQUFDLGtCQUFrQixDQUFDO2FBQy9CLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNkLENBQUM7SUFFRCxTQUFTLFVBQVUsQ0FBQyxRQUFrQjtRQUNwQyxRQUFRO2FBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQzthQUMvQixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDZCxDQUFDO0FBQ0gsQ0FBQyxFQXpGZ0IsTUFBTSxHQUFOLGNBQU0sS0FBTixjQUFNLFFBeUZ0QiJ9