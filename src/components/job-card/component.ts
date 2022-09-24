import JobBadge from "@components/job-badge";
import jobTagList from "@components/job-tag-list";
import classes from "./component.module.css";

class JobCard extends HTMLElement {
  [key: string]: any;
  #initialMount = true;
  #job?: AppData.Job;
  #listItemElement = document.createElement("li");
  #logoElement = document.createElement("img");
  #jobTagListElement = <jobTagList>document.createElement("job-tag-list");
  #jobBadge = <JobBadge>document.createElement("job-badge");

  constructor() {
    super();
    this.#listItemElement.classList.add(classes["jobCard__listItem"]);
    this.#logoElement.classList.add(classes["jobCard__logo"]);
    this.#logoElement.setAttribute("draggable", "false");
    this.#listItemElement.append(this.#logoElement, this.#jobTagListElement);
  }

  get job(): AppData.Job | undefined {
    return this.#job;
  }

  set job(newJob: AppData.Job | undefined) {
    this.#job = newJob;
    if (this.#job) {
      this.#logoElement.setAttribute("src", this.#job.logo);
      this.#logoElement.setAttribute("alt", `${this.#job.company} logo`);
      if (this.#job.featured) {
        const jobBadge = <JobBadge>this.#jobBadge.cloneNode(true);
        jobBadge.jobBadge = "featured";
        this.#logoElement.after(jobBadge);
      }
      if (this.#job.new) {
        const jobBadge = <JobBadge>this.#jobBadge.cloneNode(true);
        jobBadge.jobBadge = "new!";
        this.#logoElement.after(jobBadge);
      }
      this.#jobTagListElement.jobTags = [
        this.#job.role,
        this.#job.level,
        ...this.#job.languages,
        ...this.#job.tools
      ];
    } else {
      this.#logoElement.removeAttribute("src");
      this.#logoElement.removeAttribute("alt");
      this.#jobTagListElement.jobTags = undefined;
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobCard"]);
      this.append(this.#listItemElement);
      this.#initialMount = false;
    }
    this.upgradeProperty("job");
  }

  upgradeProperty(prop: string) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}

export default JobCard;