import JobFilter from "@components/job-filter/component";
import classes from "./component.module.css";

class JobFilterList extends HTMLElement {
  #initialMount = true;
  #jobFilters?: Set<string>;
  #listElement = document.createElement("ul");
  #buttonElement = document.createElement("button");
  #jobFilterElement = document.createElement("li", { is: "job-filter" });
  #jobFilterElementCache: Map<string, JobFilter> = new Map();

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobFilterList__list"]);
    this.#buttonElement.classList.add(classes["jobFilterList__button"]);
    this.#buttonElement.textContent = "Clear";
    this.handleClearButtonClick = this.handleClearButtonClick.bind(this);
  }

  get jobFilters(): Set<string> {
    if (this.#jobFilters) {
      return this.#jobFilters;
    } else {
      throw new Error("The job filters are not defined");
    }
  }

  set jobFilters(newJobFilters: Set<string>) {
    this.#jobFilters = newJobFilters;
    if (this.#jobFilters.size > 0) {
      this.displayJobFilters();
    } else {
      if (this.#listElement.children.length > 0) this.#listElement.replaceChildren();
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobFilterList"]);
      this.append(this.#listElement, this.#buttonElement);
      this.#initialMount = false;
    }
    this.#buttonElement.addEventListener("click", this.handleClearButtonClick);
  }

  disconnectedCallback() {
    this.#buttonElement.removeEventListener("click", this.handleClearButtonClick);
  }

  insertJobFilter(jobFilter: JobFilter, index: number) {
    if (index <= 0) {
      this.#listElement.prepend(jobFilter);
    } else {
      this.#listElement.children[index - 1].after(jobFilter);
    }
  }

  getJobFilter(jobFilter: string) {
    if (this.#jobFilterElementCache.has(jobFilter)) {
      return <JobFilter>this.#jobFilterElementCache.get(jobFilter);
    } else {
      const jobFilterElement = <JobFilter>this.#jobFilterElement.cloneNode(true);
      jobFilterElement.jobFilter = jobFilter;
      this.#jobFilterElementCache.set(jobFilter, jobFilterElement);
      return jobFilterElement;
    }
  }

  displayJobFilters() {
    const jobFilterElements = <JobFilter[]>Array.from(this.#listElement.children);
    jobFilterElements.forEach((jobFilterElement) => {
      const jobHasNotBeenFound = !this.jobFilters.has(jobFilterElement.jobFilter);
      if (jobHasNotBeenFound) jobFilterElement.remove();
    });

    [...this.jobFilters.values()].forEach((jobFilter, index) => {
      const jobFilterElement = <JobFilter | null>this.#listElement.querySelector(`[data-id="${jobFilter}"]`);
      if (!jobFilterElement) {
        const newJobFilter = this.getJobFilter(jobFilter);
        this.insertJobFilter(newJobFilter, index);
      }
    });
  }

  handleClearButtonClick() {
    const customEvent = new CustomEvent("clear-job-filters", { bubbles: true });
    this.dispatchEvent(customEvent);
  }
}

export default JobFilterList;