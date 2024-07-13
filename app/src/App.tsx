import React from "react";
import "./App.css";
import { AgentEvent, listenToStream, stopListening } from "./lib/events";

import {JobPostings} from '../../extensions/schema';

type Status = "working" | "success" | "fail" | "idle";

function App() {
  // You can change the URL to any website for the objective.
  const [url] = React.useState("https://www.builtinnyc.com/company/braze/jobs");
  const [status, setStatus] = React.useState<Status>("idle");
  const [events, setEvents] = React.useState<string[]>([]);
  const [titles, setTitles] = React.useState<string[]>();

  const handleEvent = (input: AgentEvent) => {
    setEvents((prev: string[]) => {
      if (input?.["objectiveComplete"]) {
        if (input?.objectiveComplete?.titles) {
          setTitles(input.objectiveComplete.titles);
        }
      }
      if (input?.progressAssessment) {
        return [...prev, `Progress: ${input.description}`];
      }
      return prev;
    });

    if (input?.["objectiveComplete"]) {
      setStatus("success");
      setEvents((prev: string[]) => [
        ...prev,
        `Success: ${input?.objectiveComplete?.result}`,
      ]);
    } else if (input?.["objectiveFailed"]) {
      setStatus("fail");
      setEvents((prev: string[]) => [
        ...prev,
        `Fail: ${input?.objectiveFailed?.result}`,
      ]);
    }
  };

  const start = () => {
    if (status === "working") {
      stopListening();
      setStatus("idle");
      return;
    }
    setStatus("working");
    setEvents([]);
    listenToStream(url, "Get a list of job titles.", handleEvent);
  };

  const newest = events[events.length - 1];

  return (
    <div className="items-center min-h-screen justify-center space-y-4 p-8">
      <h1 className="text-4xl">This is a sample application made with <a className="border-b" href="https://nolita.ai">Nolita</a>.</h1>
      <div className="flex flex-col space-y-4 max-w-screen-md border p-4">
        <button className="bg-gray-200 p-1" onClick={() => start()}>
          {status !== "working" ? "Start" : "Stop"}
        </button>
      </div>
      <div className="flex items-center">
          <Icon status={status} />
          <p>{newest || "No events yet."}</p>
        </div>
        {titles && <p>Jobs available: {}</p>}
    </div>
  );
}

const Icon = ({
  status,
}: {
  status: "working" | "success" | "fail" | "idle";
}) => {
  if (status === "working") {
    return <div className="mr-2 blinker"></div>;
  } else if (status === "success") {
    return <div className="mr-2">✅</div>;
  } else if (status === "fail") {
    return <div className="mr-2">❌</div>;
  }
  return <div className="mr-2">❔</div>;
};

export default App;
