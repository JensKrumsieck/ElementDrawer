import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElementDataService {
  constructor() {
  }

  readData() {
    var data = require('../assets/elements.json');
    return data;
  }
}
