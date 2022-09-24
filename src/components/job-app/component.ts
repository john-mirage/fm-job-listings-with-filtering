import JobCardList from "@components/job-card-list";
import JobFilterList from "@components/job-filter-list";
import classes from "./component.module.css";

class JobApp extends HTMLElement {
  #initialMount = true;
  #jobList?: AppData.Job[];
  #jobFilterList?: string[];
  #containerElement = document.createElement("main");
  #titleElement = document.createElement("h1");
  #filterListElement = <JobFilterList>document.createElement("job-filter-list");
  #cardListElement = <JobCardList>document.createElement("job-card-list");

  constructor() {
    super();
    this.#containerElement.classList.add(classes.container);
    this.#titleElement.classList.add(classes.title);
    this.#titleElement.textContent = "Job listings with filtering";
    this.#containerElement.append(this.#titleElement, this.#cardListElement);
  }

  get jobList(): AppData.Job[] | undefined {
    return this.#jobList;
  }

  set jobList(newJobList: AppData.Job[] | undefined) {
    this.#jobList = newJobList;
    //this.CardListElement.jobList = this.#jobList;
  }

  get jobFilterList(): string[] | undefined {
    return this.#jobFilterList;
  }

  set jobFilterList(newJobFilterList: string[] | undefined) {
    this.#jobFilterList = newJobFilterList;
    //this.webFilterList.jobFilterList = this.#jobFilterList;
    this.handleJobFilterListVisibility();
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes.host);
      this.append(this.#containerElement);
      this.#initialMount = false;
    }
    this.addEventListener("add-job-filter", this.addJobFilter);
    this.addEventListener("delete-job-filter", this.deleteJobFilter);
    this.addEventListener("clear-job-filter-list", this.clearJobFilterList);
  }

  disconnectedCallback() {
    this.removeEventListener("add-job-filter", this.addJobFilter);
    this.removeEventListener("delete-job-filter", this.deleteJobFilter);
    this.removeEventListener("clear-job-filter-list", this.clearJobFilterList);
  }

  addJobFilter(event: Event) {
    if (this.jobFilterList) {
      const filterToAdd = (<CustomEvent>event).detail.filter;
      if (!this.jobFilterList.includes(filterToAdd)) {
        this.jobFilterList = [...this.jobFilterList, filterToAdd];
        this.filterJobList();
        this.scrollToTheTop();
      }
    }
  }

  deleteJobFilter(event: Event) {
    if (this.jobFilterList) {
      const filterToDelete = (<CustomEvent>event).detail.filter;
      if (this.jobFilterList.includes(filterToDelete)) {
        this.jobFilterList = this.jobFilterList.filter((filter) => filter !== filterToDelete);
        this.filterJobList();
        this.scrollToTheTop();
      }
    }
  }

  clearJobFilterList() {
    this.jobFilterList = [];
    this.filterJobList();
    this.scrollToTheTop();
  }

  scrollToTheTop() {
    if (window.scrollY > 0) {
      window.scroll(0, 0);
    }
  }

  filterJobList() {
    if (this.jobFilterList && this.jobList && this.jobFilterList.length > 0) {
      this.#cardListElement.jobList = this.jobList.filter((job) => {
        const tags = [job.role, job.level, ...job.languages, ...job.tools];
        return this.jobFilterList?.every((jobFilter) => tags.includes(jobFilter));
      });
    } else {
      this.#cardListElement.jobList = this.jobList;
    }
  }

  handleJobFilterListVisibility() {
    if (this.jobFilterList && this.jobFilterList.length > 0 && !this.#filterListElement.isConnected) {
      this.#cardListElement.before(this.#filterListElement);
    } else if (this.jobFilterList && this.jobFilterList.length <= 0 && this.#filterListElement.isConnected) {
      this.removeChild(this.#filterListElement);
    }
  }
}

export default JobApp;