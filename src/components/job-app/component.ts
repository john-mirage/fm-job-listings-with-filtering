import JobCardList from "@components/job-card-list";
import JobFilterList from "@components/job-filter-list";
import jobs from "@data/jobs.json";
import classes from "./component.module.css";

class JobApp extends HTMLElement {
  [key: string]: any;
  #initialMount = true;
  #jobList?: AppData.Job[];
  #jobFilterList?: string[];
  #containerElement = document.createElement("main");
  #titleElement = document.createElement("h1");
  #filterListElement = <JobFilterList>document.createElement("job-filter-list");
  #cardListElement = <JobCardList>document.createElement("job-card-list");

  constructor() {
    super();
    this.#containerElement.classList.add(classes["jobApp__container"]);
    this.#titleElement.classList.add(classes["jobApp__title"]);
    this.#titleElement.textContent = "Job listings with filtering";
    this.#containerElement.append(this.#titleElement, this.#cardListElement);
  }

  get jobList(): AppData.Job[] | undefined {
    return this.#jobList;
  }

  set jobList(newJobList: AppData.Job[] | undefined) {
    this.#jobList = newJobList;
    this.#cardListElement.jobList = this.#jobList;
  }

  get jobFilterList(): string[] | undefined {
    return this.#jobFilterList;
  }

  set jobFilterList(newJobFilterList: string[] | undefined) {
    this.#jobFilterList = newJobFilterList;
    this.#filterListElement.jobFilterList = this.#jobFilterList;
    if (this.#jobFilterList) {
      if (!this.#filterListElement.isConnected) this.#cardListElement.before(this.#filterListElement);
    } else {
      if (this.#filterListElement.isConnected) this.#filterListElement.remove();
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobApp"]);
      this.append(this.#containerElement);
      this.#initialMount = false;
    }
    this.upgradeProperty("jobList");
    this.upgradeProperty("jobFilterList");
    this.jobList = jobs;
  }

  upgradeProperty(prop: string) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}

export default JobApp;