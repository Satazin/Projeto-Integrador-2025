import { inject, Injectable } from '@angular/core';
import { Database, ref, set as firebaseSet, onValue, remove, get as firebaseGet } from '@angular/fire/database';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeDatabaseService {
  private db: Database = inject(Database);

  constructor() { }

  set(path: string, data: any): Promise<void> {
    const dbRef = ref(this.db, path);
    return firebaseSet(dbRef, data);
  }

  get(url: string): Promise<any> {
    const dbRef = ref(this.db, url);
    return firebaseGet(dbRef);
  }

  ref(url: string) {
    return ref(this.db, url);
  }

  list(path: string): Observable<any[]> {
    const dbRef = ref(this.db, path);
    return new Observable(observer => {
      onValue(dbRef, (snapshot) => {
        const items = snapshot.val();
        if (items) {
          const list = Object.keys(items).map(key => ({ id: key, ...items[key] }));
          observer.next(list);
        } else {
          observer.next([]);
        }
      });
    });
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

    return firebaseSet(refPath, data);
  })();
}

query(url: string, callback: any) {
  return onValue(this.ref(url), callback);
}

remove(url: string): Promise < void> {
  return remove(ref(this.db, url));
}
}