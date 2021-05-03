"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
const health_1 = require("./responsers/health");
const app = express_1.default();
app.use(express_1.default.json());
app.get('/health', (request, response) => health_1.Health.get(request, response));
app.post('/health', (request, response) => health_1.Health.post(request, response));
app.listen(constants_1.APP_LISTEN_PORT, () => {
    console.log(`Quick Poll Interface start listening.`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBOEI7QUFFOUIsMkNBQThDO0FBQzlDLGdEQUE2QztBQUU3QyxNQUFNLEdBQUcsR0FBRyxpQkFBTyxFQUFFLENBQUM7QUFFdEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFFeEIsR0FBRyxDQUFDLEdBQUcsQ0FBRSxTQUFTLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxlQUFNLENBQUMsR0FBRyxDQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzNFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsZUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUUzRSxHQUFHLENBQUMsTUFBTSxDQUFDLDJCQUFlLEVBQUUsR0FBRyxFQUFFO0lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUNBQXVDLENBQUMsQ0FBQztBQUN2RCxDQUFDLENBQUMsQ0FBQyJ9