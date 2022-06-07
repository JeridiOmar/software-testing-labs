import { Module } from '@nestjs/common';
import { PharmacyModule } from '../../pharmacy/pharmacy.module';
import { FakerPharmacyService } from './faker-pharmacy.service';

@Module({
  providers: [FakerPharmacyService],
  imports: [PharmacyModule],
  exports: [FakerPharmacyService],
})
export class FakerPharmacyModule {}
