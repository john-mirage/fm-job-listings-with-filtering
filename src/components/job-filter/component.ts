import jobApi from "@api/job-api";
import classes from "./component.module.css";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

class JobFilter extends HTMLLIElement {
  #initialMount = true;
  #jobFilter?: string;
  #buttonElement = document.createElement("button");
  #labelElement = document.createElement("span");
  #iconElement = document.createElementNS(SVG_NAMESPACE, "svg");
  #iconShapeElement = document.createElementNS(SVG_NAMESPACE, "use");

  constructor() {
    super();
    this.#labelElement.classList.add(classes["jobFilter__label"]);
    this.#buttonElement.classList.add(classes["jobFilter__button"]);
    this.#iconElement.classList.add(classes["jobFilter__buttonIcon"]);
    this.#iconElement.setAttribute("fill", "currentColor");
    this.#iconShapeElement.setAttribute("href", "#icon-delete");
    this.#iconElement.append(this.#iconShapeElement);
    this.#buttonElement.append(this.#iconElement);
    this.handleDeleteButton = this.handleDeleteButton.bind(this);
  }

  get jobFilter(): string {
    if (this.#jobFilter) {
      return this.#jobFilter;
    } else {
      throw new Error("The job filter is not defined");
    }
  }

  set jobFilter(newJobFilter: string) {
    this.#jobFilter = newJobFilter;
    this.#labelElement.textContent = this.jobFilter;
    this.dataset.id = this.jobFilter;
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobFilter"]);
      this.append(this.#labelElement, this.#buttonElement);
      this.#initialMount = false;
    }
    this.#buttonElement.addEventListener("click", this.handleDeleteButton);
  }

  disconnectedCallback() {
    this.#buttonElement.removeEventListener("click", this.handleDeleteButton);
  }

  handleDeleteButton() {
    if (this.jobFilter) jobApi.deleteJobFilter(this.jobFilter);
  }
}

export default JobFilter;