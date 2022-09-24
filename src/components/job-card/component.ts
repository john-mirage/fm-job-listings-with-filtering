import Job from "@interfaces/job";

class JobCard extends HTMLElement {
  _job: Job | false;
  initialCall: boolean;
  fragment: DocumentFragment;
  logoElement: HTMLImageElement;
  companyElement: HTMLAnchorElement;
  positionElement: HTMLParagraphElement;
  postedAtElement: HTMLParagraphElement;
  contractElement: HTMLParagraphElement;
  locationElement: HTMLParagraphElement;
  badgesElement: HTMLDivElement;
  tagsElement: HTMLDivElement;
  tags?: HTMLButtonElement[];

  constructor() {
    super();
    this._job = false;
    this.initialCall = true;
    const template = <HTMLTemplateElement>document.getElementById("template-card");
    this.fragment = <DocumentFragment>template.content.cloneNode(true);
    this.logoElement = <HTMLImageElement>this.fragment.querySelector('[data-name="logo"]');
    this.companyElement = <HTMLAnchorElement>this.fragment.querySelector('[data-name="company"]');
    this.positionElement = <HTMLParagraphElement>this.fragment.querySelector('[data-name="position"]');
    this.postedAtElement = <HTMLParagraphElement>this.fragment.querySelector('[data-name="posted-at"]');
    this.contractElement = <HTMLParagraphElement>this.fragment.querySelector('[data-name="contract"]');
    this.locationElement = <HTMLParagraphElement>this.fragment.querySelector('[data-name="location"]');
    this.badgesElement = <HTMLDivElement>this.fragment.querySelector('[data-name="badges"]');
    this.tagsElement = <HTMLDivElement>this.fragment.querySelector('[data-name="tags"]');
  }

  get job() {
    if (this._job) {
      return this._job;
    } else {
      throw new Error("The job is not defined");
    }
  }

  set job(job: Job) {
    this._job = job;
  }

  connectedCallback() {
    if (this.initialCall) {
      this.classList.add("card");
      this.logoElement.setAttribute("src", this.job.logo);
      this.logoElement.setAttribute("alt", "Company logo");
      this.companyElement.textContent = this.job.company;
      if (this.job.new) {
        const newBadge = this.createBadge("new");
        this.badgesElement.append(newBadge);
      }
      if (this.job.featured) {
        const featuredBadge = this.createBadge("featured");
        this.badgesElement.append(featuredBadge);
        this.classList.add("card--border");
      }
      this.positionElement.textContent = this.job.position;
      this.postedAtElement.textContent = this.job.postedAt;
      this.contractElement.textContent = this.job.contract;
      this.locationElement.textContent = this.job.location;
      this.tags = [this.job.role, this.job.level, ...this.job.languages, ...this.job.tools].map((tagName) => {
        const tag = this.createTag(tagName);
        this.tagsElement.append(tag);
        return tag;
      });
      this.append(this.fragment);
      this.initialCall = false;
    }
    this.tags?.forEach((tag) => {
      tag.addEventListener("click", this.handleTag);
    });
  }

  disconnectedCallback() {
    this.tags?.forEach((tag) => {
      tag.removeEventListener("click", this.handleTag);
    });
  }

  handleTag(event: Event) {
    const filter = (<HTMLButtonElement>event.currentTarget).dataset.name;
    const customEvent = new CustomEvent("add-job-filter", { detail: { filter }, bubbles: true });
    this.dispatchEvent(customEvent);
  }

  createBadge(name: string) {
    const badgeElement = document.createElement("button");
    badgeElement.classList.add("card__badge", `card__badge--${name}`);
    badgeElement.textContent = name === "new" ? "new!" : name;
    return badgeElement;
  }

  createTag(name: string) {
    const tagElement = document.createElement("button");
    tagElement.classList.add("card__tag");
    tagElement.textContent = name;
    tagElement.dataset.name = name;
    return tagElement;
  }
}

export default JobCard;