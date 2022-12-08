import {Express} from 'express';
import helmet from 'helmet';
import {Dependencies, workflows} from "../configuration/serviceLocator";
import * as bodyParser from "body-parser";
import {ExpressMiddlewares} from "./expressMiddlewares";
import {expressRouter} from "./expressRouter";

const express = require('express');

export class ExpressServer {
    create(services: Dependencies): Express {
        const server = express();

        server.set('port', process.env.API_PORT || 8801);
        server.use(helmet());

        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({extended: true}));

        server.use('/api', expressRouter(workflows(services)));

        server.use(ExpressMiddlewares.notCatchedExceptions(services.logger));

        return server;
    }
}