import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from '../reservations.controller';
import { ReservationsService } from '../reservations.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  const mockService = {
    createReservation: jest.fn(),
    findAll: jest.fn(), // match con controlador
    updateReservation: jest.fn(),
    deleteReservation: jest.fn(),
    removeReservation: jest.fn(), // match con controlador
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a reservation', async () => {
    const dto = {
      courtId: '1',
      date: '2025-05-20',
      time: '18:00',
      phone: '1234567890',
      name: 'Juan',
      surname: 'Pérez',
      email: 'juan@example.com',
      isPermanent: false,
    };

    const created = { id: 'res1', ...dto };
    mockService.createReservation.mockResolvedValue(created);

    const result = await controller.create(dto);

    expect(result).toEqual(created);
    expect(mockService.createReservation).toHaveBeenCalledWith(dto);
  });

  it('should return all reservations', async () => {
    const reservations = [{ id: 'res1' }, { id: 'res2' }];
    mockService.findAll.mockResolvedValue(reservations); // match con findAll

    const result = await controller.findAll();

    expect(result).toEqual(reservations);
    expect(mockService.findAll).toHaveBeenCalled();
  });
});
