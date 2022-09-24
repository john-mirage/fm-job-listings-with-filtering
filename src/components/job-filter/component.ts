import classes from "./component.module.css";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

class JobFilter extends HTMLLIElement {
  [key: string]: any;
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

  get jobFilter(): string | undefined {
    return this.#jobFilter;
  }

  set jobFilter(newJobFilter: string | undefined) {
    this.#jobFilter = newJobFilter;
    if (this.#jobFilter) {
      this.#labelElement.textContent = this.#jobFilter;
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobFilter"]);
      this.append(this.#labelElement, this.#buttonElement);
      this.#initialMount = false;
    }
    this.upgradeProperty("jobFilter");
    this.#buttonElement.addEventListener("click", this.handleDeleteButton);
  }

  disconnectedCallback() {
    this.#buttonElement.removeEventListener("click", this.handleDeleteButton);
  }

  upgradeProperty(prop: string) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  handleDeleteButton() {
    if (this.jobFilter) {
      const customEvent = new CustomEvent("delete-job-filter", {
        bubbles: true,
        detail: { filter: this.jobFilter }
      });
      this.dispatchEvent(customEvent);
    }
  }
}

export default JobFilter;