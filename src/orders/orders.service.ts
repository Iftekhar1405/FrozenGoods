import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class OrdersService {
  private twilio: Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilio = new Twilio(accountSid, authToken);
  }

  async sendOrderConfirmation(phoneNumber: string, orderDetails: string) {
    const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

    try {
      await this.twilio.messages.create({
        body: `Order Confirmation: ${orderDetails}`,
        from: fromNumber,
        to: phoneNumber,
      });
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }
}
