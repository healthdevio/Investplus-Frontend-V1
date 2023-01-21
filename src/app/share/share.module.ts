import { FileDropComponent } from './file-drop/file-drop.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormComponent } from "./form/form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoaderComponent } from "./loader/loader.component";
import { RadioComponent } from "./radio/radio.component";
import { CountComponent } from "./count/count.component";
import { ToastrComponent } from "./toastr/toastr.component";
import { TableComponent } from "./table/table.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ChartjsComponent } from "./chartjs/chartjs.component";
import { TChartjsComponent } from "./t-chartjs/t-chartjs.component";
import { RadarComponent } from "./radar/radar.component";
import { DoughnutComponent } from "./doughnut/doughnut.component";
import { BarComponent } from "./bar/bar.component";
import { GeneralTerms } from "./general-terms/general-terms.component";
import { ModalComponent } from "./modal/modal.component";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxDatatableModule],
  declarations: [
    FormComponent,
    LoaderComponent,
    RadioComponent,
    CountComponent,
    ToastrComponent,
    TableComponent,
    ChartjsComponent,
    TChartjsComponent,
    RadarComponent,
    DoughnutComponent,
    BarComponent,
    GeneralTerms,
    ModalComponent,
    FileDropComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    FormComponent,
    LoaderComponent,
    RadioComponent,
    CountComponent,
    TableComponent,
    ChartjsComponent,
    TChartjsComponent,
    RadarComponent,
    DoughnutComponent,
    BarComponent,
    GeneralTerms,
    ModalComponent,
    FileDropComponent
  ],
})
export class ShareModule {}
