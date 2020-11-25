import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { fstat } from 'fs';
import { threadId } from 'worker_threads';
import { ElectronService } from '../core/services/electron/electron.service';
import { ElementDataService } from '../element-data.service';

class ChemicalElement {
  Symbol: string;
  Name: string;
  Weight: number;
  Index: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  @ViewChild('preview', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  data: any;
  elements: ChemicalElement[];
  current: ChemicalElement;
  font: string;
  color: string;
  background: string;
  symbolSize: number;
  numberSize: number;
  weightSize: number;
  elementNameSize: number;

  constructor(private router: Router, private electron: ElectronService, private elementService: ElementDataService) { }

  ngOnInit(): void {
    this.elements = new Array();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    //read in elemental data
    //TODO: read settings
    this.readData();
    ///Default Values
    this.font = "Arial";
    this.color = "#ffffff";
    this.background = "#000000";
    this.symbolSize = 1000;
    this.elementNameSize = 250;
    this.numberSize = 250;
    this.weightSize = 200;
    //refresh preview
    this.onChange(1);
  }

  closeWindow() {
    this.electron.window.close();
  }

  minimizeWindow() {
    this.electron.window.minimize();
  }

  onChange(index: number) {
    this.current = this.elements[index - 1];
    this.drawCurrent();
  }

  drawCurrent() {
    this.draw(this.current)
  }
  draw(element: ChemicalElement) {
    var fontTitle = `${this.elementNameSize}px ${this.font}`;
    var fontSymbol = `bold ${this.symbolSize}px ${this.font}`;
    var fontNumber = `${this.numberSize}px ${this.font}`;
    var fontWeight = `${this.weightSize}px ${this.font}`;
    var width = this.canvas.nativeElement.width;
    var height = this.canvas.nativeElement.height;

    //clear to make transparent background possible
    this.ctx.clearRect(0, 0, width, height);

    //draw bg
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, width, height)

    //draw border
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 100;
    this.ctx.strokeRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    this.ctx.fillStyle = this.color;

    //draw text
    this.ctx.font = fontSymbol;
    var posSymbol = this.ctx.measureText(element.Symbol)
    this.ctx.fillText(element.Symbol, width / 2 - posSymbol.width / 2, height / 2 + 100)

    this.ctx.font = fontTitle
    var posName = this.ctx.measureText(element.Name)
    this.ctx.fillText(element.Name, width / 2 - posName.width / 2, height / 2 + 800 / 2 + 200)

    this.ctx.font = fontNumber
    var index: string = element.Index.toString();
    var posNumber = this.ctx.measureText(index.toString())
    this.ctx.fillText(index.toString(), 100, 250 + 50)

    this.ctx.font = fontWeight
    var weight: string = element.Weight.toString();
    var posWeight = this.ctx.measureText(weight)
    this.ctx.fillText(weight.toString(), width / 2 - posWeight.width / 2, height - (250 - 150))
  }

  save() {
    const dir = `${this.electron.remote.app.getAppPath()}/images`;
    if (!this.electron.fs.existsSync(dir)) {
      this.electron.fs.mkdirSync(dir)
    }
    this.elements.forEach(item => {
      this.draw(item);
      var img = this.canvas.nativeElement.toDataURL();
      var data = img.replace(/^data:image\/\w+;base64,/, "");
      var buffer = Buffer.from(data, 'base64');
      this.electron.fs.writeFileSync(`${dir}/${item.Symbol}.png`, buffer);
    });
  }

  readData() {
    this.data = this.elementService.readData();
    this.data.forEach(element => {
      var item: ChemicalElement = new ChemicalElement();
      item.Name = element.Name;
      item.Symbol = element.Symbol;
      item.Index = element.AtomicNumber;
      item.Weight = element.AtomicWeight;
      this.elements.push(item)
    });
  }
}
