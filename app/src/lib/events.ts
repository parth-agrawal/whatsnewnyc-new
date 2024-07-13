import { JobPostings } from "../../../extensions/schema";

let eventSource: EventSource | null = null;

const baseUrl = process.env.NODE_ENV === 'development' ? `http://localhost:3040` : '';

export type AgentEvent = {
  command?: string[];
  done?: boolean;
  progressAssessment?: string;
  description?: string;
  objectiveComplete?: {
    kind: "ObjectiveComplete";
    jobPostings: JobPostings;
    result: string;
  }
  objectiveFailed: {
    kind: "ObjectiveFailed";
    result: string;
  }
};

export const listenToStream = (
  url: string,
  objective: string,
  callback: (res: AgentEvent) => void,
) => {
  eventSource = new EventSource(
    `${baseUrl}/api/browse?url=${encodeURIComponent(url)}&objective=${encodeURIComponent(objective)}&maxIterations=3`,
  );
  eventSource.onmessage = function (event) {
    let response;
    try {
      response = JSON.parse(event.data);
    } catch (e) {
      return;
    }
    console.log(response);
    if (response.done) {
      console.log("done");
      eventSource?.close();
    }
    if (!response.done) {
      callback(response);
    }
  };
  eventSource.onerror = function (error) {
    console.error("EventSource failed:", error);
    eventSource?.close();
  };
};
export const stopListening = () => {
  eventSource?.close();
};
