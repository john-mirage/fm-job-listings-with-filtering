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
    this.#iconElement.setAttribute("fill", "currentColor");
    this.#iconShapeElement.setAttribute("href", "#icon-delete");
    this.#iconElement.append(this.#iconShapeElement);
    this.#buttonElement.append(this.#labelElement, this.#iconElement);
    this.handleDeleteButton = this.handleDeleteButton.bind(this);
  }

  get jobFilter(): string | undefined {
    return this.#jobFilter;
  }

  set jobFilter(newJobFilter: string | undefined) {
    this.#jobFilter = newJobFilter;
    if (this.#jobFilter) {
      this.#labelElement.textContent = this.#jobFilter;
      this.#buttonElement.dataset.name = this.#jobFilter;
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes.host);
      this.append(this.#buttonElement);
      this.#initialMount = false;
    }
    this.#buttonElement.addEventListener("click", this.handleDeleteButton);
  }

  disconnectedCallback() {
    this.#buttonElement.removeEventListener("click", this.handleDeleteButton);
  }

  handleDeleteButton(event: Event) {
    const filter = (<HTMLButtonElement>event.currentTarget).dataset.name;
    const customEvent = new CustomEvent("delete-job-filter", { detail: { filter }, bubbles: true });
    this.dispatchEvent(customEvent);
  }
}

export default JobFilter;