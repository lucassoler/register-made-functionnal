import {ServiceLocatorHelper} from "../../helpers/serviceLocatorHelper";
import {ExpressServerHelper} from "../../helpers/expressServerHelper";
import request from "supertest";
import {An} from "../../builders/An";

describe('REST - Request reset password', function () {
    let servicesHelper: ServiceLocatorHelper;
    let server: ExpressServerHelper;

    afterAll(() => {
        server.stop();
    });

    beforeEach(function () {
        servicesHelper = new ServiceLocatorHelper();
        server = new ExpressServerHelper(servicesHelper.serviceLocator);
    });


    test('request reset password has succeeded - return 200', async () => {
        servicesHelper.userRepository.populate(
            An.ExistingUser()
                .withEmail("jane.doe@gmail.com")
                .withPassword("Password!@")
                .build()
        );

        const res = await request(server.get())
            .post('/api/identity/reset-password/request')
            .send({
                email: "jane.doe@gmail.com"
            });

        expect(res.status).toBe(200);
    });


    test('request reset password failed - email not found - return 404', async () => {
        const res = await request(server.get())
            .post('/api/identity/reset-password/request')
            .send({
                email: "jane.doe@gmail.com"
            });

        expect(res.status).toBe(404);
        expect(res.body.status_code).toBe(404);
        expect(res.body.error_name).toBe("NotFound");
        expect(res.body.error_code).toBe("IDENTITY_ERR_4010");
        expect(res.body.message).toStrictEqual('email jane.doe@gmail.com does not exists');
    });

    test('request reset password failed - bad parameters - return 400', async () => {
        const res = await request(server.get())
            .post('/api/identity/reset-password/request')
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.status_code).toBe(400);
        expect(res.body.error_name).toBe("BadRequest");
        expect(res.body.errors).toStrictEqual([
            {
                "param": "email",
                "message": "email is required"
            },
            {
                "param": "email",
                "message": "email must be a valid string"
            }
        ])
    });
});