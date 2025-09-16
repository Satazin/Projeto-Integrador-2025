import { inject, Injectable } from '@angular/core';
import { Database, ref, list, set, onValue, remove } from '@angular/fire/database';
import { firstValueFrom, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeDatabaseService {
  get(arg0: string): any {
    throw new Error('Method not implemented.');
  }

  private db: Database = inject(Database);

  constructor() {}

  ref(url: string) {
    return ref(this.db, url);
  }

  list(url: string) {
    return list(this.ref(url));
  }

  add(url: string, data: any, id: number = 0) {
    return (async () => {
      let indice = 1;
      const snapshot: any = await firstValueFrom(this.list(url));

      if (snapshot !== undefined) {
        indice = snapshot.length + 1;
      }

      const url_indice = id === 0 ? indice : id;
      const url_full = `${url}/${url_indice}`;
      const refPath = this.ref(url_full);

      return set(refPath, data);
    })();
  }

  query(url: string, callback: any) {
    return onValue(this.ref(url), callback);
  }

  remove(url: string) {
    return remove(this.ref(url));
  }
}