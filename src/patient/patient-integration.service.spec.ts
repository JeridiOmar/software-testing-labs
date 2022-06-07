import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { Patient } from './entities/patient.entity';
import * as bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { RoleEnum } from './entities/role.enum';
import { CivilStatusEnum } from './entities/civil-status.enum';
import { Connection, Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { UpdatePatientDto } from './dto/update-patient.dto';

describe('PatientService integration test suite ', () => {
  let service: PatientService;
  let patientRepository: Repository<Patient>;
  let module: TestingModule;
  const patients: Patient[] = [
    {
      id: 1,
      email: 'amrouch_jridi@hotmail.fraa',
      role: 'Patient',
      firstName: 'omar',
      lastName: 'jridi',
      birthday: new Date('2000-05-01'),
      cin: '21111115',
      gender: 0,
      phoneNumber: '55479319',
      civilStatus: 'Married',
      socialStatus: 'working',
      cnamId: 1800,
      password: 'azerty',
      isEmailVerified: false,
      medicalRecord: null,
    } as Patient,
    {
      id: 2,
      email: 'foulen.benfoulen@yahoo.com',
      role: 'Patient',
      firstName: 'foulen',
      lastName: 'ben foulen',
      birthday: new Date('2000-05-01'),
      cin: '21111116',
      gender: 0,
      phoneNumber: '55479319',
      civilStatus: 'Married',
      socialStatus: 'working',
      cnamId: 1800,
      password: 'azerty',
      isEmailVerified: false,
      medicalRecord: null,
    } as Patient,
  ];
  const dtos = [
    {
      dto: {
        email: 'amrouch_jridi@hotmail.fraa',
        role: RoleEnum.PATIENT,
        firstName: 'omar',
        lastName: 'jridi',
        birthday: new Date('2000-05-01'),
        cin: '21111115',
        gender: 0,
        phoneNumber: '55479319',
        civilStatus: CivilStatusEnum.MARRIED,
        socialStatus: 'working',
        cnamId: 1800,
        password: 'azerty',
        isEmailVerified: false,
        medicalRecord: null,
      },
      expectedResult: patients[0],
    },
    {
      dto: {
        email: 'foulen.benfoulen@yahoo.com',
        role: RoleEnum.PATIENT,
        firstName: 'foulen',
        lastName: 'ben foulen',
        birthday: new Date('2000-05-01'),
        cin: '21111116',
        gender: 0,
        phoneNumber: '55479319',
        civilStatus: CivilStatusEnum.MARRIED,
        socialStatus: 'working',
        cnamId: 1800,
        password: 'azerty',
        isEmailVerified: false,
        medicalRecord: null,
      },
      expectedResult: patients[1],
    },
  ];

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<PatientService>(PatientService);
    patientRepository = module.get('PatientRepository');
  });
  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    module.get(Connection).close();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(patientRepository).toBeDefined();
  });
  it('should return the list of all patients', async () => {
    const allPatients = await service.findAll();
    expect(allPatients.length).toEqual(0);
  });
  it('should create patient', async () => {
    const result = {
      id: 1,
      email: 'amrouch_jridi@hotmail.fraa',
      role: 'Patient',
      firstName: 'omar',
      lastName: 'jridi',
      birthday: new Date('2000-05-01'),
      cin: '21111115',
      gender: 0,
      phoneNumber: '55479319',
      civilStatus: 'Married',
      socialStatus: 'working',
      cnamId: 1800,
      isEmailVerified: false,
      medicalRecord: null,
    };
    const patient = await service.create(dtos[0].dto);
    delete patient['password'];
    expect(patient).toEqual(result);
  });
  it('should find patient by his email', async () => {
    const result = {
      id: 1,
      email: 'amrouch_jridi@hotmail.fraa',
      role: 'Patient',
      firstName: 'omar',
      lastName: 'jridi',
      birthday: new Date('2000-05-01'),
      cin: '21111115',
      gender: 0,
      phoneNumber: '55479319',
      civilStatus: 'Married',
      socialStatus: 'working',
      cnamId: 1800,
      isEmailVerified: false,
    };
    const patient = await service.findByEmail(patients[0].email);
    delete patient['password'];
    expect(patient).toEqual(result);
  });
  it('should update patient phone number by id', async () => {
    const result = {
      id: 1,
      email: 'amrouch_jridi@hotmail.fraa',
      role: 'Patient',
      firstName: 'omar',
      lastName: 'jridi',
      birthday: new Date('2000-05-01'),
      cin: '21111115',
      gender: 0,
      phoneNumber: '55111222',
      civilStatus: 'Married',
      socialStatus: 'working',
      cnamId: 1800,
      isEmailVerified: false,
    };
    const updatePatientDto: UpdatePatientDto = {
      phoneNumber: '55111222',
    };
    const patient = await service.update(patients[0].id, updatePatientDto);
    delete patient['password'];
    expect(patient).toEqual(result);
  });
  it('should remove patient by his id', async () => {
    await service.remove(patients[0].id);
    const allPatients = await service.findAll();
    expect(allPatients.length).toEqual(0);
  });
});
