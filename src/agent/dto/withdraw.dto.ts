import { IsNumber, Min } from 'class-validator';

export class WithdrawDto {
  @IsNumber()
  @Min(10, { message: 'Minimum withdrawal is 10' })
  amount: number;
}
