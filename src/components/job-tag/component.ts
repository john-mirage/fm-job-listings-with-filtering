import classes from "./component.module.css";

class JobTag extends HTMLElement {
  [key: string]: any;
  #initialMount = true;
  #jobTag?: string;
  #listItemElement = document.createElement("li");
  #buttonElement = document.createElement("button");

  constructor() {
    super();
    this.#listItemElement.classList.add(classes["jobTag__listItem"]);
    this.#buttonElement.classList.add(classes["jobTag__button"]);
    this.#listItemElement.append(this.#buttonElement);
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
      this.append(this.#listItemElement);
      this.#initialMount = false;
    }
    this.upgradeProperty("jobTag");
  }

  upgradeProperty(prop: string) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}

export default JobTag;