import request from 'supertest';
import {ExpressServerHelper} from "../../helpers/expressServerHelper";
import {ServiceLocatorHelper} from "../../helpers/serviceLocatorHelper";


describe('REST - Register new user', function () {
    let servicesHelper: ServiceLocatorHelper;
    let server: ExpressServerHelper;

    afterAll(() => {
        server.stop();
    });

    beforeEach(function () {
        servicesHelper = new ServiceLocatorHelper();
        server = new ExpressServerHelper(servicesHelper.serviceLocator);
    });

    test('request has succeeded - return 200', async () => {
        const res = await request(server.get())
            .post('/api/identity/register')
            .send({
                email: "jane.doe@gmail.com",
                password: "Password!@"
            });

        expect(res.status).toBe(200);
    });

    test('request has failed with user email already used - return 409', async () => {
        servicesHelper.userRepository.populate({
            email: "jane.doe@gmail.com",
            password: "Password!@"
        });

        const res = await request(server.get())
            .post('/api/identity/register')
            .send({
                email: "jane.doe@gmail.com",
                password: "Password!@"
            });

        expect(res.status).toBe(409);
        expect(res.body.status_code).toBe(409);
        expect(res.body.error_name).toBe("Conflict");
        expect(res.body.error_code).toBe("IDENTITY_ERR_4001");
        expect(res.body.message).toStrictEqual('email "jane.doe@gmail.com" already used');
    });

    test('request has failed with a non matching domain password rules - return 400', async () => {
        const res = await request(server.get())
            .post('/api/identity/register')
            .send({
                email: "jane.doegmail.com",
                password: "pass"
            });

        expect(res.status).toBe(400);
        expect(res.body.status_code).toBe(400);
        expect(res.body.error_name).toBe("BadRequest");
        expect(res.body.error_code).toBe("IDENTITY_ERR_4004");
        expect(res.body.errors).toStrictEqual([{
            code: "IDENTITY_ERR_4000",
            message: "email invalid"
        }, {
            code: "IDENTITY_ERR_4002",
            message: "password invalid for the following reasons Password should have a minimum length of 6 characters,Password should contains special characters",
            errors: [{
                code: "IDENTITY_ERR_4003",
                message: "Password should have a minimum length of 6 characters"
            }, {
                code: "IDENTITY_ERR_4006",
                message: "Password should contains special characters"
            }]
        }]);
    });

    test('request has failed with bad parameters - return 400', async () => {
        const res = await request(server.get())
            .post('/api/identity/register')
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
            },
            {
                "param": "password",
                "message": "password is required"
            },
            {
                "param": "password",
                "message": "password must be a valid string"
            }
        ])
    });
});

