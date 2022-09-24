import JobBadgeList from "@components/job-badge-list";
import jobTagList from "@components/job-tag-list";
import classes from "./component.module.css";

class JobCard extends HTMLLIElement {
  [key: string]: any;
  #initialMount = true;
  #job?: AppData.Job;
  #logoElement = document.createElement("img");
  #rowElement = document.createElement("div");
  #companyElement = document.createElement("a");
  #badgeListElement = <JobBadgeList>document.createElement("job-badge-list");
  #positionElement = document.createElement("p");
  #infoElement = document.createElement("p");
  #dotElement = document.createElement("span");
  #jobTagListElement = <jobTagList>document.createElement("job-tag-list");

  constructor() {
    super();
    this.#logoElement.classList.add(classes["jobCard__logo"]);
    this.#rowElement.classList.add(classes["jobCard__row"]);
    this.#companyElement.classList.add(classes["jobCard__company"]);
    this.#positionElement.classList.add(classes["jobCard__position"]);
    this.#infoElement.classList.add(classes["jobCard__info"]);
    this.#dotElement.classList.add(classes["jobCard__infoDot"]);
    this.#companyElement.setAttribute("href", "#");
    this.#logoElement.setAttribute("draggable", "false");
    this.#rowElement.append(this.#companyElement, this.#positionElement, this.#infoElement);
  }

  get job(): AppData.Job | undefined {
    return this.#job;
  }

  set job(newJob: AppData.Job | undefined) {
    this.#job = newJob;
    if (this.#job) {
      this.#logoElement.setAttribute("src", this.#job.logo);
      this.#logoElement.setAttribute("alt", `${this.#job.company} logo`);
      this.#companyElement.textContent = this.#job.company;
      this.#positionElement.textContent = this.#job.position;
      this.#infoElement.append(
        this.#job.postedAt,
        this.#dotElement.cloneNode(true),
        this.#job.contract,
        this.#dotElement.cloneNode(true),
        this.#job.location
      );
      if (this.#job.featured) this.classList.add(classes["jobCard--featured"]);
      if (this.#job.featured || this.#job.new) {
        let jobBadges = [];
        if (this.#job.new) jobBadges.push("new!");
        if (this.#job.featured) jobBadges.push("featured");
        this.#badgeListElement.jobBadges = jobBadges;
        this.#companyElement.after(this.#badgeListElement);
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
      this.append(this.#logoElement, this.#rowElement, this.#jobTagListElement);
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