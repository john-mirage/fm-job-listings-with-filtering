import classes from "./component.module.css";

class JobBadge extends HTMLLIElement {
  [key: string]: any;
  #initialMount = true;
  #jobBadge?: string;
  #buttonElement = document.createElement("button");

  constructor() {
    super();
    this.#buttonElement.classList.add(classes["jobBadge__button"]);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  get jobBadge(): string | undefined {
    return this.#jobBadge;
  }

  set jobBadge(newJobBadge: string | undefined) {
    this.#jobBadge = newJobBadge;
    if (this.#jobBadge) {
      if (this.#jobBadge === "new!") {
        this.#buttonElement.classList.remove(classes["jobBadge__button--black"]);
        this.#buttonElement.classList.add(classes["jobBadge__button--green"]);
      } else {
        this.#buttonElement.classList.add(classes["jobBadge__button--black"]);
        this.#buttonElement.classList.remove(classes["jobBadge__button--green"]);
      }
      this.#buttonElement.textContent = this.#jobBadge;
    } else {
      this.#buttonElement.classList.remove(classes["jobBadge__button--black"]);
      this.#buttonElement.classList.remove(classes["jobBadge__button--green"]);
      this.#buttonElement.textContent = null;
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobBadge"]);
      this.append(this.#buttonElement);
      this.#initialMount = false;
    }
    this.upgradeProperty("jobBadge");
    this.#buttonElement.addEventListener("click", this.handleButtonClick);
  }

  disconnectedCallback() {
    this.#buttonElement.removeEventListener("click", this.handleButtonClick);
  }

  upgradeProperty(prop: string) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  handleButtonClick() {
    if (this.jobBadge) {
      const customEvent = new CustomEvent("add-job-filter", {
        bubbles: true,
        detail: { filter: this.jobBadge }
      });
      this.dispatchEvent(customEvent);
    }
  }
}

export default JobBadge;