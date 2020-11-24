import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private router: Router, private electron: ElectronService, private elementService: ElementDataService) { }

  ngOnInit(): void {
    this.elements = new Array();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.readData();
    this.onChange(1);
  }

  closeWindow() {
    this.electron.window.close();
  }

  minimizeWindow() {
    this.electron.window.minimize();
  }

  onChange(index: number) {
    var element = this.elements[index - 1];

    const fontTitle = "250px Titillium Web"
    const fontSymbol = "bold 1000px Titillium Web"
    const fontNumber = "250px Titillium Web"
    const fontWeight = "200px Titillium Web"
    var width = this.canvas.nativeElement.width;
    var height = this.canvas.nativeElement.height;

    //draw bg
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.fillStyle = "#ffffff";

    this.ctx.font = fontSymbol;
    var posSymbol = this.ctx.measureText(element.Symbol)
    this.ctx.fillText(element.Symbol, width / 2 - posSymbol.width / 2, height / 2 + 100)

    this.ctx.strokeStyle = "#ffffff"
    this.ctx.lineWidth = 100;
    this.ctx.strokeRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.ctx.font = fontTitle
    var posName = this.ctx.measureText(element.Name)
    this.ctx.fillText(element.Name, width / 2 - posName.width / 2, height / 2 + 800 / 2 + 200)

    this.ctx.font = fontNumber
    var posNumber = this.ctx.measureText(index.toString())
    this.ctx.fillText(index.toString(), 100, 250 + 50)

    this.ctx.font = fontWeight
    var weight: string = element.Weight.toString();
    var posWeight = this.ctx.measureText(weight)
    this.ctx.fillText(weight.toString(), width / 2 - posWeight.width / 2, height - (250 - 150))

    /**
     * const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync("./images/" + item.Symbol + ".png", buffer)
    console.log(symbol + " done!")
     */
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
