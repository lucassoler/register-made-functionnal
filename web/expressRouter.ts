import {Workflows} from "../configuration/serviceLocator";
import {Router} from "express";
import {identityAndAccessEndpoints} from "../identityAndAccess/writes/web/endpoints";


export const expressRouter = (workflows: Workflows): Router => {
    const router = Router();

    identityAndAccessEndpoints(router, workflows);

    return router;
}