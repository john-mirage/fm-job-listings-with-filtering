import JobFilter from "@components/job-filter/component";
import classes from "./component.module.css";

class JobFilterList extends HTMLElement {
  [key: string]: any;
  #initialMount = true;
  #jobFilters?: string[];
  #listElement = document.createElement("ul");
  #buttonElement = document.createElement("button");
  #jobFilterElement = document.createElement("li", { is: "job-filter" });

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobFilterList__list"]);
    this.#buttonElement.classList.add(classes["jobFilterList__button"]);
    this.#buttonElement.textContent = "Clear";
    this.handleClearButtonClick = this.handleClearButtonClick.bind(this);
  }

  get jobFilters(): string[] {
    return this.#jobFilters || [];
  }

  set jobFilters(newJobFilters: string[]) {
    this.#jobFilters = newJobFilters;
    if (this.#jobFilters.length > 0) {
      this.#listElement.replaceChildren(
        ...this.#jobFilters.map((jobFilter) => {
          const jobFilterElement = <JobFilter>this.#jobFilterElement.cloneNode(true);
          jobFilterElement.jobFilter = jobFilter;
          return jobFilterElement;
        })
      );
    } else {
      this.#listElement.replaceChildren();
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobFilterList"]);
      this.append(this.#listElement, this.#buttonElement);
      this.#initialMount = false;
    }
    this.upgradeProperty("jobFilters");
    this.#buttonElement.addEventListener("click", this.handleClearButtonClick);
  }

  disconnectedCallback() {
    this.#buttonElement.removeEventListener("click", this.handleClearButtonClick);
  }

  upgradeProperty(prop: string) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  handleClearButtonClick() {
    const customEvent = new CustomEvent("clear-job-filters", { bubbles: true });
    this.dispatchEvent(customEvent);
  }
}

export default JobFilterList;