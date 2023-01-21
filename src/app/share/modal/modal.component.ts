import { Component, OnInit, Input, ElementRef } from "@angular/core";

@Component({
  selector: "modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
})
export class ModalComponent implements OnInit {
  constructor(private el: ElementRef) {}
  ngOnInit() {
    // we added this so that when the backdrop is clicked the modal is closed.
    this.el.nativeElement
      .querySelector(".mmodal-background,.mmodal-close")
      .addEventListener("click", () => {
        this.close();
      });
  }
  close() {
    this.el.nativeElement.classList.remove("sshow");
    this.el.nativeElement.classList.add("hhidden");
  }
}
