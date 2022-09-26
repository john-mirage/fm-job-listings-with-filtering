import JobBadgeList from "@components/job-badge-list";
import jobTagList from "@components/job-tag-list";
import classes from "./component.module.css";

class JobCard extends HTMLLIElement {
  #initialMount = true;
  #job?: AppData.Job;
  #logoElement = document.createElement("img");
  #rowElement = document.createElement("div");
  #companyElement = document.createElement("a");
  #badgeListElement = <JobBadgeList>document.createElement("job-badge-list");
  #positionElement = document.createElement("div");
  #positionLinkElement = document.createElement("a");
  #infoElement = document.createElement("p");
  #dotElement = document.createElement("span");
  #jobTagListElement = <jobTagList>document.createElement("job-tag-list");

  constructor() {
    super();
    this.#logoElement.classList.add(classes["jobCard__logo"]);
    this.#rowElement.classList.add(classes["jobCard__row"]);
    this.#companyElement.classList.add(classes["jobCard__company"]);
    this.#positionElement.classList.add(classes["jobCard__position"]);
    this.#positionLinkElement.classList.add(classes["jobCard__positionLink"]);
    this.#infoElement.classList.add(classes["jobCard__info"]);
    this.#dotElement.classList.add(classes["jobCard__infoDot"]);
    this.#companyElement.setAttribute("href", "#");
    this.#positionLinkElement.setAttribute("href", "#");
    this.#logoElement.setAttribute("draggable", "false");
    this.#positionElement.append(this.#positionLinkElement);
    this.#rowElement.append(this.#companyElement, this.#positionElement, this.#infoElement);
  }

  get job(): AppData.Job {
    if (this.#job) {
      return this.#job;
    } else {
      throw new Error("The job is not defined");
    }
  }

  set job(newJob: AppData.Job) {
    this.#job = newJob;
    if (this.#job) {
      this.#logoElement.setAttribute("src", this.#job.logo);
      this.#logoElement.setAttribute("alt", `${this.#job.company} logo`);
      this.#companyElement.textContent = this.#job.company;
      this.#positionLinkElement.textContent = this.#job.position;
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
        if (this.#job.new) jobBadges.push("New");
        if (this.#job.featured) jobBadges.push("Featured");
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
  }
}

export default JobCard;