import { Component, OnInit, ElementRef } from "@angular/core";

@Component({
  selector: "modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
})
export class ModalComponent implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    const background = this.el.nativeElement.querySelector(".mmodal-background");
    const closeButton = this.el.nativeElement.querySelector(".mmodal-close");

    if (background) {
      background.addEventListener("click", () => {
        this.close();
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        this.close();
      });
    }
  }

  close() {
    this.el.nativeElement.classList.remove("sshow");
    this.el.nativeElement.classList.add("hhidden");
  }
}
