import JobCard from "@components/job-card";
import classes from "./component.module.css";

class JobCardList extends HTMLElement {
  [key: string]: any;
  #initialMount = true;
  #jobList?: AppData.Job[];
  #listElement = document.createElement("ul");
  #jobCard = <JobCard>document.createElement("job-card");

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobCardList__list"]);
  }

  get jobList(): AppData.Job[] | undefined {
    return this.#jobList;
  }

  set jobList(newJobList: AppData.Job[] | undefined) {
    this.#jobList = newJobList;
    if (this.#jobList) {
      this.#listElement.replaceChildren(
        ...this.#jobList.map((job) => {
          const jobCard = <JobCard>this.#jobCard.cloneNode(true);
          jobCard.job = job;
          return jobCard;
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
    this.upgradeProperty("jobList");
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