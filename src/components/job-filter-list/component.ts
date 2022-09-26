import jobApi from "@api/job-api";
import JobFilter from "@components/job-filter/component";
import classes from "./component.module.css";

class JobFilterList extends HTMLElement {
  #initialMount = true;
  #listElement = document.createElement("ul");
  #buttonElement = document.createElement("button");
  #jobFilterElement = <JobFilter>document.createElement("li", { is: "job-filter" });
  #jobFilterElementCache: Map<string, JobFilter> = new Map();
  #jobFilters?: string[] | undefined;

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobFilterList__list"]);
    this.#buttonElement.classList.add(classes["jobFilterList__button"]);
    this.#buttonElement.textContent = "Clear";
    this.handleClearButtonClick = this.handleClearButtonClick.bind(this);
  }

  get jobFilters(): string[] | undefined {
    return this.#jobFilters;
  }

  set jobFilters(newJobFilters: string[] | undefined) {
    this.#jobFilters = newJobFilters;
    if (this.jobFilters && this.jobFilters.length > 0) {
      this.handleJobFilters();
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
    this.jobFilters = jobApi.jobFilters;
    jobApi.subscribe("jobFilters", this);
    this.#buttonElement.addEventListener("click", this.handleClearButtonClick);
  }

  disconnectedCallback() {
    jobApi.unsubscribe("jobFilters", this);
    this.#buttonElement.removeEventListener("click", this.handleClearButtonClick);
  }

  getJobFilterElement(jobFilter: string) {
    if (this.#jobFilterElementCache.has(jobFilter)) {
      return <JobFilter>this.#jobFilterElementCache.get(jobFilter);
    } else {
      const jobFilterElement = <JobFilter>this.#jobFilterElement.cloneNode(true);
      jobFilterElement.jobFilter = jobFilter;
      this.#jobFilterElementCache.set(jobFilter, jobFilterElement);
      return jobFilterElement;
    }
  }

  handleDeletedJobFilters(jobFilters: string[], jobFilterElements: JobFilter[]) {
    jobFilterElements.forEach((jobFilterElement) => {
      const jobFilterElementIsNotValid = !jobFilters.includes(jobFilterElement.jobFilter);
      if (jobFilterElementIsNotValid) jobFilterElement.remove();
    });
  }

  handleAddedJobFilters(jobFilters: string[], jobFilterElements: JobFilter[]) {
    let previousJobFilterElement: JobFilter | undefined;
    jobFilters.forEach((jobFilter) => {
      const currentJobFilterElement = jobFilterElements.find((jobFilterElement) => jobFilterElement.jobFilter === jobFilter);
      if (!currentJobFilterElement) {
        const newJobFilterElement = this.getJobFilterElement(jobFilter);
        if (previousJobFilterElement) {
          previousJobFilterElement.after(newJobFilterElement);
        } else {
          this.#listElement.prepend(newJobFilterElement);
        }
        previousJobFilterElement = newJobFilterElement;
      } else {
        previousJobFilterElement = currentJobFilterElement;
      }
    });
  }

  handleJobFilters() {
    const jobFilters = this.jobFilters;
    if (jobFilters) {
      const jobFilterElements = <JobFilter[]>Array.from(this.#listElement.children);
      this.handleDeletedJobFilters(jobFilters, jobFilterElements);
      this.handleAddedJobFilters(jobFilters, jobFilterElements);
    }
  }

  handleClearButtonClick() {
    jobApi.clearJobFilter();
  }
}

export default JobFilterList;