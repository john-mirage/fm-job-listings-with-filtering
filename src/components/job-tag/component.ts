import classes from "./component.module.css";

class JobTag extends HTMLLIElement {
  [key: string]: any;
  #initialMount = true;
  #jobTag?: string;
  #buttonElement = document.createElement("button");

  constructor() {
    super();
    this.#buttonElement.classList.add(classes["jobTag__button"]);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  get jobTag(): string | undefined {
    return this.#jobTag;
  }

  set jobTag(newJobTag: string | undefined) {
    this.#jobTag = newJobTag;
    if (this.#jobTag) {
      this.#buttonElement.textContent = this.#jobTag;
    } else {
      this.#buttonElement.textContent = "";
    }
  } 

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobTag"]);
      this.append(this.#buttonElement);
      this.#initialMount = false;
    }
    this.upgradeProperty("jobTag");
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
    if (this.jobTag) {
      const customEvent = new CustomEvent("add-job-filter", {
        bubbles: true,
        detail: { filter: this.jobTag }
      });
      this.dispatchEvent(customEvent);
    }
  }
}

export default JobTag;