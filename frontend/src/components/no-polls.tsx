"use client";

import { CreatePollDialog } from "./create-poll-dialog";

export default function NoPolls() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl mt-48 mb-2 font-bold tracking-tight">
          You have no polls
        </h3>
        <div className="mb-48">
          <CreatePollDialog
            fetchPolls={async () => {
              {
                return;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
