import {ExpressServer} from "./expressServer";
import {serviceLocator} from "../configuration/serviceLocator";
import dotenv from "dotenv";

dotenv.config();

const services = serviceLocator();
services.dataSource.initialize()
    .then(() => {
        const expressServer = new ExpressServer().create(services);

        const startup = expressServer.listen(expressServer.get("port"), () => {
            services.logger.info(`Application starts on port ${expressServer.get("port")}`, { type: "SYSTEM" });
        });

        process.on("SIGTERM", () => {
            console.info(`Application stopped`, {type: "SYSTEM"});
            startup.close((error) => {
                if (error) {
                    console.error(error.message, {type: "SYSTEM"});
                    process.exit(1);
                }

                process.exit(0);
            });
        });
    })
    .catch((error: Error) => console.log(error));