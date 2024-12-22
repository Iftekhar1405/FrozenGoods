import { Test, TestingModule } from '@nestjs/testing';
import { ClounidaryService } from './clounidary.service';

describe('ClounidaryService', () => {
  let service: ClounidaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClounidaryService],
    }).compile();

    service = module.get<ClounidaryService>(ClounidaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
