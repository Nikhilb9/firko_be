import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(private readonly configService: ConfigService) {
    const firebasePrivateKey: string =
      this.configService.get('FIREBASE_PRIVATE_KEY') ?? '';
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get('FIREBASE_PROJECT_ID'),
        clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
        privateKey: firebasePrivateKey.replace(/\\n/g, '\n') ?? '',
      }),
    });
  }

  //Payload example for sending notification engineer can use according but not down one thing in data object every key should be string
  //   const payload = {
  //     token: '<DEVICE_FCM_TOKEN>', // recipient's device token
  //     notification: {
  //       title: 'New Chat Message',
  //       body: 'John Doe sent you a message about the service.',
  //     },
  //     data: {
  //       type: 'CHAT_MESSAGE',
  //       message: '', // you can include a preview here if needed
  //       title: '',
  //       description: '',
  //       roomId: 'abc123',

  //       // service details
  //       'productService.title': 'Sample Product',
  //       'productService.description': 'This is a test product description.',
  //       'productService.images': 'https://example.com/image.jpg',
  //       'productService.serviceId': 'ps123',

  //       // sender details
  //       'sender.senderId': 'u456',
  //       'sender.firstName': 'John',
  //       'sender.lastName': 'Doe',
  //     },
  //   };
  async sendNotification(token: string, payload: admin.messaging.Message) {
    return admin.messaging().send({
      token,
      ...payload,
    });
  }
}
