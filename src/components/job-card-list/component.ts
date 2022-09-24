import JobCard from "@components/job-card";
import classes from "./component.module.css";

class JobCardList extends HTMLElement {
  [key: string]: any;
  #initialMount = true;
  #jobs?: AppData.Job[];
  #listElement = document.createElement("ul");
  #jobCardElement = <JobCard>document.createElement("li", { is: "job-card" });

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobCardList__list"]);
  }

  get jobs(): AppData.Job[] {
    return this.#jobs || [];
  }

  set jobs(newJobs: AppData.Job[]) {
    this.#jobs = newJobs;
    if (this.#jobs.length > 0) {
      this.#listElement.replaceChildren(
        ...this.#jobs.map((job) => {
          const jobCardElement = <JobCard>this.#jobCardElement.cloneNode(true);
          jobCardElement.job = job;
          return jobCardElement;
        })
      );
    } else {
      this.#listElement.replaceChildren();
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobCardList"]);
      this.append(this.#listElement);
      this.#initialMount = false;
    }
    this.upgradeProperty("jobs");
  }

  upgradeProperty(prop: string) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}

export default JobCardList;