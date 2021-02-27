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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const object_id_scalar_1 = require("./object-id.scalar");
const hello_1 = require("./resolvers/hello");
const typegoose_middleware_1 = require("./typegoose-middleware");
const MONGO_DB_URL = "mongodb://localhost:27017/resale";
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const app = express_1.default();
        const mongoose = yield mongoose_1.connect(MONGO_DB_URL);
        mongoose.connection.on("open", () => console.log("DB CONNECTED"));
        app.use(cors_1.default({
            origin: "http://localhost:3000",
            credentials: true,
        }));
        const apolloServer = new apollo_server_express_1.ApolloServer({
            schema: yield type_graphql_1.buildSchema({
                resolvers: [hello_1.HelloResolver],
                emitSchemaFile: path_1.default.resolve(__dirname, "schema.gql"),
                globalMiddlewares: [typegoose_middleware_1.TypegooseMiddleware],
                scalarsMap: [{ type: mongodb_1.ObjectId, scalar: object_id_scalar_1.ObjectIdScalar }],
                validate: false,
            }),
        });
        apolloServer.applyMiddleware({ app, cors: false });
        app.listen(4000, () => console.log("Server is now running"));
    }
    catch (err) {
        console.error(err);
    }
});
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map