import JobApp from "@components/job-app";
import JobCard from "@components/job-card";
import JobCardList from "@components/job-card-list";
import JobFilter from "@components/job-filter";
import JobFilterList from "@components/job-filter-list";
import "./main.css";

customElements.define("job-app", JobApp);
customElements.define("job-card-list", JobCardList);
customElements.define("job-card", JobCard);
customElements.define("job-filter-list", JobFilterList);
customElements.define("job-filter", JobFilter);

