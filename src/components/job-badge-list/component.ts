import JobBadge from "@components/job-badge/component";
import classes from "./component.module.css";

class JobBadgeList extends HTMLElement {
  #initialMount = true;
  #jobBadges?: string[];
  #listElement = document.createElement("ul");
  #jobBadgeElement = <JobBadge>document.createElement("li", { is: "job-badge" });

  constructor() {
    super();
    this.#listElement.classList.add(classes["jobBadgeList__list"]);
  }

  get jobBadges(): string[] | undefined {
    return this.#jobBadges;
  }

  set jobBadges(newJobBadges: string[] | undefined) {
    this.#jobBadges = newJobBadges;
    if (this.#jobBadges) {
      this.#listElement.replaceChildren(
        ...this.#jobBadges.map((jobBadge) => {
          const jobBadgeElement = <JobBadge>this.#jobBadgeElement.cloneNode(true);
          jobBadgeElement.jobBadge = jobBadge;
          return jobBadgeElement;
        })
      );
    } else {
      this.#listElement.replaceChildren();
    }
  }

  connectedCallback() {
    if (this.#initialMount) {
      this.classList.add(classes["jobBadgeList"]);
      this.append(this.#listElement);
      this.#initialMount = false;
    }
  }
}

export default JobBadgeList;