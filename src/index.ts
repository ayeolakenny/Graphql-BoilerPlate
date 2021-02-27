import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { ObjectId } from "mongodb";
import { connect } from "mongoose";
import path from "path";
import { buildSchema } from "type-graphql";
import { ObjectIdScalar } from "./object-id.scalar";
import { HelloResolver } from "./resolvers/hello";
import { TypegooseMiddleware } from "./typegoose-middleware";

const MONGO_DB_URL = "mongodb://localhost:27017/resale";

const main = async () => {
  try {
    const app = express();

    //connect to the database
    const mongoose = await connect(MONGO_DB_URL);
    mongoose.connection.on("open", () => console.log("DB CONNECTED"));

    //configure crossite origin requests
    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );

    //connection with apolloserver
    const apolloServer = new ApolloServer({
      // build TypeGraphQL executable schema
      schema: await buildSchema({
        resolvers: [HelloResolver],
        emitSchemaFile: path.resolve(__dirname, "schema.gql"),
        // use document converting middleware
        globalMiddlewares: [TypegooseMiddleware],
        // use ObjectId scalar mapping
        scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
        validate: false,
      }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    //Start server
    app.listen(4000, () => console.log("Server is now running"));
  } catch (err) {
    console.error(err);
  }
};

main().catch((err) => console.log(err));
