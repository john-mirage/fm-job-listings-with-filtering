import jobApi from "@api/job-api";
import classes from "./component.module.css";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

class JobFilter extends HTMLLIElement {
  #initialMount = true;
  #buttonElement = document.createElement("button");
  #labelElement = document.createElement("span");
  #iconElement = document.createElementNS(SVG_NAMESPACE, "svg");
  #iconShapeElement = document.createElementNS(SVG_NAMESPACE, "use");
  #jobFilter?: string;

  constructor() {
    super();
    this.#labelElement.classList.add(classes["jobFilter__label"]);
    this.#buttonElement.classList.add(classes["jobFilter__button"]);
    this.#iconElement.classList.add(classes["jobFilter__buttonIcon"]);
    this.#buttonElement.setAttribute("type", "button");
    this.#iconElement.setAttribute("fill", "currentColor");
    this.#iconShapeElement.setAttribute("href", "#icon-delete");
    this.#iconElement.append(this.#iconShapeElement);
    this.#buttonElement.append(this.#iconElement);
    this.handleDeleteButton = this.handleDeleteButton.bind(this);
  }

  get jobFilter(): string | undefined {
    return this.#jobFilter;
  }

  set jobFilter(newJobFilter: string | undefined) {
    this.#jobFilter = newJobFilter;
    this.handleJobFilter();
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

  handleJobFilter() {
    const jobFilter = this.jobFilter;
    if (jobFilter) {
      const filterId = `${jobFilter.toLowerCase()}-filter`;
      this.#labelElement.textContent = jobFilter;
      this.setAttribute("id", filterId);
      this.#buttonElement.setAttribute("aria-labelledby", filterId);
    }
  }

  handleDeleteButton() {
    if (this.jobFilter) jobApi.deleteJobFilter(this.jobFilter);
  }
}

export default JobFilter;