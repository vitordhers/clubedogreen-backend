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
// -------------------------------------- GOOGLE PLAY
export class WebhookGooglePlay {
  @ApiProperty({
    description: 'JSON',
    example: {
      message: {
        messageId: '1234567890',
        feedback: {
          comments: 'This app is awesome!',
          userEmail: 'johndoe@example.com',
          productId: 'com.example.app',
          starRating: 5,
          timestamp: '2023-04-14T12:00:00.000Z',
        },
      },
      subscription: {
        name: 'projects/my-project/subscriptions/my-subscription',
        topic: 'projects/my-project/topics/my-topic',
      },
    },
  })
  message: Message;
  subscription: Subscription;
}

export interface Message {
  messageId: string;
  feedback: Feedback;
}

export interface Feedback {
  comments: string;
  userEmail: string;
  productId: string;
  starRating: number;
  timestamp: string;
}

export interface Subscription {
  name: string;
  topic: string;
}

// -------------------------------------- APPLE STORE

export class WebhookApple {
  @ApiProperty({
    description: 'JSON',
    example: {
      topic: 'customer-reviews',
      type: 'customer-reviews',
      id: '1234567890',
      attributes: {
        storefront: 'us',
        developerResponse: null,
        nickname: 'JohnDoe',
        rating: 5,
        title: 'This app is awesome!',
        review: "I love this app, it's the best!",
        date: '2023-04-14T12:00:00Z',
        version: '1.2.3',
        reviewerId: '123456789',
      },
      links: {
        self: 'https://api.appstoreconnect.apple.com/v1/reviews/1234567890',
      },
    },
  })
  topic: string;
  type: string;
  id: string;
  attributes: Attributes;
  links: Links;
}

export interface Attributes {
  storefront: string;
  developerResponse: any;
  nickname: string;
  rating: number;
  title: string;
  review: string;
  date: string;
  version: string;
  reviewerId: string;
}

export interface Links {
  self: string;
}
