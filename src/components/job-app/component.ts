import JobCardList from "@components/job-card-list";
import JobFilterList from "@components/job-filter-list";
import classes from "./component.module.css";

class JobApp extends HTMLElement {
  #initialMount = true;
  #containerElement = document.createElement("main");
  #titleElement = document.createElement("h1");
  #jobFilterListElement = <JobFilterList>document.createElement("job-filter-list");
  #jobCardListElement = <JobCardList>document.createElement("job-card-list");
  jobs: Map<number, AppData.Job> = new Map();
  jobFilters: Set<string> = new Set();

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

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobApp"]);
      this.append(this.#containerElement);
      this.#initialMount = false;
    }
    this.addEventListener("add-job-filter", this.handleAddFilterEvent);
    this.addEventListener("delete-job-filter", this.handleDeleteFilterEvent);
    this.addEventListener("clear-job-filters", this.handleClearFiltersEvent);
  }

  disconnectedCallback() {
    this.removeEventListener("add-job-filter", this.handleAddFilterEvent);
    this.removeEventListener("delete-job-filter", this.handleDeleteFilterEvent);
    this.removeEventListener("clear-job-filters", this.handleClearFiltersEvent);
  }

  updateJobCardList() {
    
  }

  updateJobFilterList() {
    if (this.jobFilters.size > 0) {
      if (!this.#jobFilterListElement.isConnected) this.#jobCardListElement.before(this.#jobFilterListElement);
    } else {
      if (this.#jobFilterListElement.isConnected) this.#jobFilterListElement.remove();
    }
  }

  filterJobs() {
    if (window.scrollY > 0) window.scroll(0, 0);
    const jobsMap = new Map();
    this.jobs.forEach((job) => {
      const tags = [job.role, job.level, ...job.languages, ...job.tools];
      if (job.new) tags.push("new!");
      if (job.featured) tags.push("featured");
      const isValid = [...this.jobFilters].every((jobFilter) => tags.includes(jobFilter));
      if (isValid) jobsMap.set(job.id, job);
    });
    this.#jobCardListElement.jobs = jobsMap;
  }

  handleAddFilterEvent(event: Event) {
    const { filter } = (<CustomEvent>event).detail;
    if (typeof filter === "string") {
      if (!this.jobFilters.has(filter)) {
        this.jobFilters.add(filter);
        this.jobFilters = this.jobFilters;
        this.filterJobs();
      };
    }
  }

  handleDeleteFilterEvent(event: Event) {
    const { filter } = (<CustomEvent>event).detail;
    if (typeof filter === "string") {
      if (this.jobFilters.has(filter)) {
        this.jobFilters.delete(filter);
        this.jobFilters = this.jobFilters;
        this.filterJobs();
      }
    }
  }

  handleClearFiltersEvent() {
    this.jobFilters.clear();
    this.jobFilters = this.jobFilters;
    this.#jobCardListElement.jobs = this.jobs;
  }
}

export default JobApp;