import jobApi from "@api/job-api";
import classes from "./component.module.css";

class JobTag extends HTMLLIElement {
  #initialMount = true;
  #buttonElement = document.createElement("button");
  #jobTag?: string;

  static get observedAttributes() {
    return ["disabled"];
  }

  constructor() {
    super();
    this.#buttonElement.classList.add(classes["jobTag__button"]);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  get disabled(): boolean {
    return this.hasAttribute("disabled");
  }

  set disabled(isDisabled: boolean) {
    if (isDisabled) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
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

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case "disabled":
        const isDisabled = newValue !== null;
        if (isDisabled) {
          this.#buttonElement.setAttribute("disabled", "");
        } else {
          this.#buttonElement.removeAttribute("disabled");
        }
        break;
      default:
        throw new Error("The modified attribute is not watched");
    }
  }

  handleButtonClick() {
    if (this.jobTag) jobApi.addJobFilter(this.jobTag);
  }
}

export default JobTag;