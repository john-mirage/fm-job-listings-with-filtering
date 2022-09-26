import jobApi from "@api/job-api";
import classes from "./component.module.css";

class JobBadge extends HTMLLIElement {
  #initialMount = true;
  #jobBadge?: string;
  #buttonElement = document.createElement("button");

  static get observedAttributes() {
    return ["disabled"];
  }

  constructor() {
    super();
    this.#buttonElement.classList.add(classes["jobBadge__button"]);
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
    this.#buttonElement.addEventListener("click", this.handleButtonClick);
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

  disconnectedCallback() {
    this.#buttonElement.removeEventListener("click", this.handleButtonClick);
  }

  handleButtonClick() {
    if (this.jobBadge) jobApi.addJobFilter(this.jobBadge);
  }
}

export default JobBadge;