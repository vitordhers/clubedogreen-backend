import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';

export class WebhookDto {
  type: string;
  basic_authentication: string;
  plan_name: string;
  plan_key: string;
  plan_amount: number;
  product_name: string;
  product_key: string;
  client_name: string;
  client_email: string;
  client_cel: string;
  client_documment: string;
  client_address?: any;
  client_address_city?: any;
  client_address_comp?: any;
  client_address_district?: any;
  client_address_number?: any;
  client_address_state?: any;
  client_address_country: string;
  client_zip_code?: any;
  subs_key: string;
  subs_next_charge: string;
  subs_next_try?: any;
  subs_attempts: number;
  subs_createdate: string;
  subs_status: string;
  subs_status_code: number;
  subs_meta: any;
}



