import { Component, OnInit, Input, ElementRef } from "@angular/core";

@Component({
  selector: "general-terms",
  templateUrl: "./general-terms.component.html",
  styleUrls: ["./general-terms.component.css"],
})
export class GeneralTerms {
  showDialog() {
    let modal_t = document.getElementById("termos-gerais");
    modal_t.classList.remove("hhidden");
    modal_t.classList.add("sshow");
  }
  closeDialog() {
    let modal_t = document.getElementById("termos-gerais");
    modal_t.classList.remove("sshow");
    modal_t.classList.add("hhidden");
  }
}
