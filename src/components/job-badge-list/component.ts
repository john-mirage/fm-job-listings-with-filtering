import jobApi from "@api/job-api";
import JobBadge from "@components/job-badge/component";
import classes from "./component.module.css";

class JobBadgeList extends HTMLElement {
  #initialMount = true;
  #listElement = document.createElement("ul");
  #jobBadgeElement = <JobBadge>document.createElement("li", { is: "job-badge" });
  #jobFilters?: string[];
  #jobBadges?: string[];

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobBadgeList__list"]);
  }

  get jobFilters(): string[] | undefined {
    return this.#jobFilters;
  }

  set jobFilters(newJobFilters: string[] | undefined) {
    this.#jobFilters = newJobFilters;
    this.handleJobBadgeStates();
  }

  get jobBadges(): string[] | undefined {
    return this.#jobBadges;
  }

  set jobBadges(newJobBadges: string[] | undefined) {
    this.#jobBadges = newJobBadges;
    this.handleJobBadges();
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobBadgeList"]);
      this.append(this.#listElement);
      this.#initialMount = false;
    }
    this.jobFilters = jobApi.jobFilters;
    jobApi.subscribe("jobFilters", this);
  }

  disconnectedCallback() {
    jobApi.unsubscribe("jobFilters", this);
  }

  handleJobBadgeStates() {
    const jobFilters = this.jobFilters;
    const jobBadges = this.jobBadges;
    if (jobFilters && jobBadges) {
      const jobBadgeElements = <JobBadge[]>Array.from(this.#listElement.children);
      jobBadgeElements.forEach((jobBadgeElement) => {
        if (jobBadgeElement.jobBadge && jobFilters.includes(jobBadgeElement.jobBadge)) {
          jobBadgeElement.setAttribute("disabled", "");
        } else if (jobBadgeElement.hasAttribute("disabled")) {
          jobBadgeElement.removeAttribute("disabled");
        }
      });
    }
  }

  handleJobBadges() {
    const jobBadges = this.jobBadges;
    if (jobBadges) {
      this.#listElement.replaceChildren(
        ...jobBadges.map((jobBadge) => {
          const jobBadgeElement = <JobBadge>this.#jobBadgeElement.cloneNode(true);
          jobBadgeElement.jobBadge = jobBadge;
          return jobBadgeElement;
        })
      );
    } else {
      this.#listElement.replaceChildren();
    }
  }
}

export default JobBadgeList;