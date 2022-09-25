import jobApi from "@api/job-api";
import JobCardList from "@components/job-card-list";
import JobFilterList from "@components/job-filter-list";
import classes from "./component.module.css";

class JobApp extends HTMLElement {
  #initialMount = true;
  #containerElement = document.createElement("main");
  #titleElement = document.createElement("h1");
  #jobFilterListElement = <JobFilterList>document.createElement("job-filter-list");
  #jobCardListElement = <JobCardList>document.createElement("job-card-list");
  #jobFilters?: string[];

  constructor() {
    super();
    this.#containerElement.classList.add(classes["jobApp__container"]);
    this.#titleElement.classList.add(classes["jobApp__title"]);
    this.#titleElement.textContent = "Job listings with filtering";
    this.#containerElement.append(this.#titleElement, this.#jobCardListElement);
  }

  get jobFilters(): string[] {
    if (this.#jobFilters) {
      return this.#jobFilters;
    } else {
      throw new Error("The job filters are not defined");
    }
  }

  set jobFilters(newJobFilters: string[]) {
    this.#jobFilters = newJobFilters;
    if (this.jobFilters.length > 0) {
      if (!this.#jobFilterListElement.isConnected) this.#jobCardListElement.before(this.#jobFilterListElement);
    } else {
      if (this.#jobFilterListElement.isConnected) this.#jobFilterListElement.remove();
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobApp"]);
      this.append(this.#containerElement);
      this.#initialMount = false;
    }
    this.jobFilters = jobApi.jobFilters;
    jobApi.subscribe("jobFilters", this);
  }
}

export default JobApp;