"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var axios_1 = require("axios");
// Initialize MCP Server
var server = new index_js_1.Server({
    name: "robinhood-mcp-server",
    version: "1.0.0"
}, {
    capabilities: { tools: {} }
});
// 1. Define Available Tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                tools: [
                    {
                        name: "get_quote",
                        description: "Fetch the real-time price of a stock ticker.",
                        inputSchema: {
                            type: "object",
                            properties: { ticker: { type: "string" } },
                            required: ["ticker"]
                        }
                    },
                    {
                        name: "execute_trade",
                        description: "Place a market trade order on Robinhood.",
                        inputSchema: {
                            type: "object",
                            properties: {
                                ticker: { type: "string" },
                                quantity: { type: "number" },
                                side: { type: "string", enum: ["buy", "sell"] }
                            },
                            required: ["ticker", "quantity", "side"]
                        }
                    }
                ]
            }];
    });
}); });
// 2. Handle Tool Call Executions (Interfacing with Robinhood)
server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, args, rhHeaders, ticker, res;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.params, name = _a.name, args = _a.arguments;
                rhHeaders = {
                    "Authorization": "Bearer ".concat(process.env.ROBINHOOD_TOKEN),
                };
                if (!(name === "get_quote")) return [3 /*break*/, 2];
                ticker = String(args === null || args === void 0 ? void 0 : args.ticker).toUpperCase();
                return [4 /*yield*/, axios_1.default.get("https://api.robinhood.com/quotes/".concat(ticker, "/"), { headers: rhHeaders })];
            case 1:
                res = _b.sent();
                return [2 /*return*/, {
                        content: [{ type: "text", text: "Current price for ".concat(ticker, " is $").concat(res.data.last_trade_price) }]
                    }];
            case 2:
                if (name === "execute_trade") {
                    // Implement your trade submission code here
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Successfully placed order to ".concat(args === null || args === void 0 ? void 0 : args.side, " ").concat(args === null || args === void 0 ? void 0 : args.quantity, " shares of ").concat(args === null || args === void 0 ? void 0 : args.ticker, ".") }]
                        }];
                }
                throw new Error("Tool not found: ".concat(name));
        }
    });
}); });
// Start via Stdio
var transport = new stdio_js_1.StdioServerTransport();
await server.connect(transport);
