# Sahti
I used Sahti project (created in the Framework lab)
Sahti is a website which aims to organize the tunisian sanitary domain by providing the necessary functionalities for all tiers (Patients, Doctors, Technicians,
Pharmacists
etc...)

## Tech Stack

<div style="width:80%; margin:0 auto;">
  <img src="./readme_assets/nestjs.svg" width=100>

  <img src="./readme_assets/docker.png" width=100>
  <img src="./readme_assets/aws.png" width=100>
  <img src="./readme_assets/typeorm.png" width=100>
  <img src="./readme_assets/postgres.png" width=100>
</div>

# Testing project


## Unit & Integration Tests
Unit and integration test `are executed on PatientService`
Unit test file is `src/patient/patient.service.spec.ts`.
Integration test file is `src/patient/patient-integration.service.spec.ts`.

### PatientService Unit test
In this part we are mocking the PatientRepository to test only the service functions
```typescript
module = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: getRepositoryToken(Patient),
          useValue: mockPatientRepository,
        },
      ],
    }).compile();
```

### PatientService Unit test
Now We wont mock the repository the test the integration between the service and the repository
to isolate test cases
we are using jest `pretest` and `posttest` hoocks to create a new database for test suits
`    "pretest": "docker-compose -f docker-compose.test.yaml --env-file .test.env up -d ",
`

```typescript
 service = module.get<PatientService>(PatientService);
    patientRepository = module.get('PatientRepository');// real repo instance
```


To run unit tests, run the following command:

```bash
npm run test
```

result:
<img src="./readme_assets/unit-int.png">

## E2E Tests

In this part we are testing the app endpoint 
test file `/test/auth.e2e-spec.ts`
Test environment (redis /db) are created as in the previous part test environment (db and redis) a
So we focused on Auth Module
the test suit :
- we sign up a user ==> status 201
- login with correct credentials and test if we get 200 and valid jwt token
- then try to access a protected resource with the jwt ==> we must get 200 OK instead of 403 forbidden
- in the last part we test to login with wrong password/uncreated account ==> BAD REQUEST
```bash
npm run test:e2e
```

result:
<img src="./readme_assets/e2e2.png">
<img src="./readme_assets/e2e1.png">


**Note that you would probably encounter some error logs before seeing the result of tests, It is okay because it does not have an influence on the tests process. These are internal errors of Jest, not related to the actual tests.**
## Run Locally

1- Make sure you have docker and docker-compose installed in your system by running these commands:
```bash
docker --version
docker-compose --version
```
2- Clone the project



3- Go to the project directory

```bash
  cd sahti-backend
```

4- Run the project

```bash
  docker-compose up
```
## License

The source code for the site is licensed under the [MIT](https://choosealicense.com/licenses/mit/) license, which you can find in the LICENSE.txt file. 
