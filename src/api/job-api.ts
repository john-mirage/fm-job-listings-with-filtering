import jobs from "@data/jobs.json";

interface HTMLElementWithJobFilters extends HTMLElement {
  jobFilters: Set<string>;
};

class JobApi {
  #jobFiltersSubscribers: Map<string, HTMLElementWithJobFilters> = new Map();
  jobs: Map<number, AppData.Job> = new Map();
  jobFilters: Set<string> = new Set();

  constructor(jobs: AppData.Job[]) {
    jobs.forEach((job) => {
      this.jobs.set(job.id, job);
    });
  }

  addJobFilter(filter: string) {
    this.jobFilters.add(filter);
    this.dispatch();
  }

  deleteJobFilter(filter: string) {
    this.jobFilters.delete(filter);
    this.dispatch();
  }

  clearJobFilter() {
    this.jobFilters.clear();
    this.dispatch();
  }

  dispatch() {
    this.#jobFiltersSubscribers.forEach((jobFilterSubscriber) => {
      jobFilterSubscriber.jobFilters = this.jobFilters;
    });
  }

  subscribe(elementName: string, element: HTMLElementWithJobFilters) {
    this.#jobFiltersSubscribers.set(elementName, element);
  }

  unsubscribe(elementName: string) {
    this.#jobFiltersSubscribers.delete(elementName);
  }
}

export default new JobApi(jobs);