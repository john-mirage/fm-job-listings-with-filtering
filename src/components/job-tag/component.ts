import classes from "./component.module.css";

class JobTag extends HTMLLIElement {
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
    this.#buttonElement.addEventListener("click", this.handleButtonClick);
  }

  disconnectedCallback() {
    this.#buttonElement.removeEventListener("click", this.handleButtonClick);
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