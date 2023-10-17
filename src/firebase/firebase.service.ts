import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';

import * as admin from 'firebase-admin';
import * as jsonData from '../../key/firebase-credentials.json';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private _app: admin.app.App;
  private _firestore: admin.firestore.Firestore;

  onModuleInit() {
    if (!this._app) {
      const json = jsonData;
      const serviceAccount: admin.ServiceAccount = {
        projectId: json.project_id,
        clientEmail: json.client_email,
        privateKey: json.private_key,
      };
      this._app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    this._firestore = this._app.firestore();
  }

  get firestore() {
    return this._firestore;
  }
}
