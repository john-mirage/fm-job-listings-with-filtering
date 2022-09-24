import JobCardList from "@components/job-card-list";
import JobFilterList from "@components/job-filter-list";
import jobs from "@data/jobs.json";
import classes from "./component.module.css";

class JobApp extends HTMLElement {
  [key: string]: any;
  #initialMount = true;
  #jobs?: AppData.Job[];
  #jobFilters?: string[];
  #containerElement = document.createElement("main");
  #titleElement = document.createElement("h1");
  #jobFilterListElement = <JobFilterList>document.createElement("job-filter-list");
  #jobCardListElement = <JobCardList>document.createElement("job-card-list");

  constructor() {
    super();
    this.#containerElement.classList.add(classes["jobApp__container"]);
    this.#titleElement.classList.add(classes["jobApp__title"]);
    this.#titleElement.textContent = "Job listings with filtering";
    this.#containerElement.append(this.#titleElement, this.#jobCardListElement);
    this.handleAddFilterEvent = this.handleAddFilterEvent.bind(this);
    this.handleDeleteFilterEvent = this.handleDeleteFilterEvent.bind(this);
    this.handleClearFiltersEvent = this.handleClearFiltersEvent.bind(this);
  }

  get jobs(): AppData.Job[] {
    return this.#jobs || [];
  }

  set jobs(newJobs: AppData.Job[]) {
    this.#jobs = newJobs;
    this.#jobCardListElement.jobs = this.#jobs;
  }

  get jobFilters(): string[] {
    return this.#jobFilters || [];
  }

  set jobFilters(newJobFilters: string[]) {
    this.#jobFilters = newJobFilters;
    this.#jobFilterListElement.jobFilters = this.#jobFilters;
    if (this.#jobFilters.length > 0) {
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
    this.upgradeProperty("jobs");
    this.upgradeProperty("jobFilters");
    this.jobs = jobs;
    this.addEventListener("add-job-filter", this.handleAddFilterEvent);
    this.addEventListener("delete-job-filter", this.handleDeleteFilterEvent);
    this.addEventListener("clear-job-filters", this.handleClearFiltersEvent);
  }

  disconnectedCallback() {
    this.removeEventListener("add-job-filter", this.handleAddFilterEvent);
    this.removeEventListener("delete-job-filter", this.handleDeleteFilterEvent);
    this.removeEventListener("clear-job-filters", this.handleClearFiltersEvent);
  }

  upgradeProperty(prop: string) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  filterJobs() {
    
  }

  handleAddFilterEvent(event: Event) {
    const { filter } = (<CustomEvent>event).detail;
    console.log("add" , filter, "filter");
    if (typeof filter === "string") {
      if (!this.jobFilters.includes(filter)) this.jobFilters = [...this.jobFilters, filter];
    }
  }

  handleDeleteFilterEvent(event: Event) {
    const { filter } = (<CustomEvent>event).detail;
    console.log("delete", filter, "filter");
    if (typeof filter === "string") {
      this.jobFilters = this.jobFilters.filter((jobFilter) => jobFilter !== filter);
    }
  }

  handleClearFiltersEvent() {
    this.jobFilters = [];
  }
}

export default JobApp;