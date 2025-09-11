import { inject, Injectable } from '@angular/core';
import { Database, ref, set, onValue, remove, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class RealtimeDatabaseService {

  private db: Database = inject(Database);

  constructor() {}

  ref(url: string) {
    return ref(this.db, url);
  }

  async get(url: string) {
    const snapshot = await get(this.ref(url));
    return snapshot;
  }

  async add(url: string, data: any, id: string) {
    const refPath = this.ref(`${url}/${id}`);
    return set(refPath, data);
  }

  query(url: string, callback: any) {
    return onValue(this.ref(url), callback);
  }

  remove(url: string) {
    return remove(this.ref(url));
  }
}
