import jobs from "@data/jobs.json";

class JobApi {
  #jobs: Map<number, AppData.Job> = new Map();
  #jobFilters: Set<string> = new Set();
  #jobsSubscribers: Set<any> = new Set();
  #jobFiltersSubscribers: Set<any> = new Set();

  constructor(jobs: AppData.Job[]) {
    jobs.forEach((job) => {
      this.#jobs.set(job.id, job);
    });
  }

  get jobs() {
    return [...this.#jobs.values()];
  }

  get jobFilters() {
    return [...this.#jobFilters];
  }

  dispatch(propertyName: string) {
    switch (propertyName) {
      case "jobs":
        this.#jobsSubscribers.forEach((jobsSubscriber) => {
          jobsSubscriber.jobs = this.jobs;
        });
        break;
      case "jobFilters":
        this.#jobFiltersSubscribers.forEach((jobFiltersSubscriber) => {
          jobFiltersSubscriber.jobFilters = this.jobFilters;
        });
        break;
      default:
        throw new Error("The property name is not valid");
    }
  }

  subscribe(propertyName: string, element: any) {
    switch (propertyName) {
      case "jobs":
        this.#jobsSubscribers.add(element);
        break;
      case "jobFilters":
        this.#jobFiltersSubscribers.add(element);
        break;
      default:
        throw new Error("The property name is not valid");
    }
  }

  unsubscribe(propertyName: string, element: any) {
    switch (propertyName) {
      case "jobs":
        this.#jobsSubscribers.delete(element);
        break;
      case "jobFilters":
        this.#jobFiltersSubscribers.delete(element);
        break;
      default:
        throw new Error("The property name is not valid");
    }
  }

  addJobFilter(filter: string) {
    this.#jobFilters.add(filter);
    this.dispatch("jobFilters");
  }

  deleteJobFilter(filter: string) {
    this.#jobFilters.delete(filter);
    this.dispatch("jobFilters");
  }

  clearJobFilter() {
    this.#jobFilters.clear();
    this.dispatch("jobFilters");
  }
}

export default new JobApi(jobs);