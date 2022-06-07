import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { Patient } from './entities/patient.entity';
import * as bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { RoleEnum } from './entities/role.enum';
import { CivilStatusEnum } from './entities/civil-status.enum';
import { Connection } from 'typeorm';

describe('PatientService unit test suite', () => {
  let module: TestingModule;
  let service: PatientService;
  const patient = new Patient();
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
      async hashPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
      },
      emailToLowerCase() {
        this.email = this.email.toLowerCase().trim();
      },
      toJSON() {
        return classToPlain(this);
      },
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
        async hashPassword() {
          const salt = await bcrypt.genSalt();
          this.password = await bcrypt.hash(this.password, salt);
        },
        emailToLowerCase() {
          this.email = this.email.toLowerCase().trim();
        },
        toJSON() {
          return classToPlain(this);
        },
      },
      expectedResult: patients[0],
    },
  ];
  const mockPatientRepository = {
    preload: jest.fn().mockImplementation(({ patientId, updatePatientDto }) => {
      const patient = patients.find((patient) => patient.id == patientId);
      const newPatient: Patient = {
        phoneNumber: updatePatientDto.phoneNumber,
        async hashPassword() {
          const salt = await bcrypt.genSalt();
          this.password = await bcrypt.hash(this.password, salt);
        },
        emailToLowerCase() {
          this.email = this.email.toLowerCase().trim();
        },
        toJSON() {
          return classToPlain(this);
        },
        ...patient,
      };
      return newPatient;
    }),
    find: jest.fn().mockImplementation(() => {
      return [];
    }),
    findOne: jest.fn().mockImplementation(() => {
      return patient;
    }),
    save: jest.fn().mockImplementation((createPatientDto: CreatePatientDto) => {
      return { id: 1, ...createPatientDto };
    }),
    create: jest
      .fn()
      .mockImplementation((createPatientDto: CreatePatientDto) => {
        return { ...createPatientDto };
      }),
    delete: jest.fn().mockImplementation((id) => {
      return {};
    }),
  };
  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: getRepositoryToken(Patient),
          useValue: mockPatientRepository,
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return the list of all patients', async () => {
    expect(await service.findAll()).toBeDefined();
    expect(mockPatientRepository.find).toBeCalled();
    expect(await service.findAll()).toEqual([]);
  });
  it('should create a patient ', async () => {
    const patientId = 1;
    expect(await service.create(dtos[0].dto)).toBeDefined();
    expect(mockPatientRepository.save).toBeCalled();
    expect(mockPatientRepository.create).toBeCalled();
    expect(await service.create(dtos[0].dto)).toEqual({
      id: patientId,
      ...dtos[0].dto,
    });
  });
  it('should return a patient given his id', async () => {
    const id = 0;
    expect(await service.findOne(id)).toBeDefined();
    expect(mockPatientRepository.findOne).toBeCalledWith(id, {
      relations: ['medicalRecord'],
    });
    expect(await service.findOne(id)).toEqual(patient);
  });
  it('should call findOne method with expected param', async () => {
    const patientMail = patients[0].email;
    expect(await service.findByEmail(patientMail)).toBeDefined();
    expect(mockPatientRepository.findOne).toHaveBeenCalledWith({
      where: { email: patientMail },
    });
  });
});
