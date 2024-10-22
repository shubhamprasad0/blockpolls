import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useContractContext from "@/hooks/use-contract-context";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { Spinner } from "./ui/spinner";
import { useToast } from "./ui/use-toast";

export function CreatePollDialog({
  fetchPolls,
}: {
  fetchPolls: () => Promise<void>;
}) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creatingPoll, setCreatingPoll] = useState(false);
  const { contract } = useContractContext();
  const { toast } = useToast();

  const addNewOptionField = () => {
    setOptions((options) => [...options, ""]);
  };

  const reset = () => {
    setQuestion("");
    setOptions(["", ""]);
    setCreatingPoll(false);
  };

  const createPoll = async () => {
    setCreatingPoll(true);
    try {
      const txResponse = await contract.createPoll(question, options);
      await txResponse.wait();
    } catch (e: any) {
      let description = "";
      switch (e.code) {
        case "ACTION_REJECTED":
          description = "User rejected the transaction.";
          break;

        default:
          description = "Transaction failed";
          break;
      }
      toast({
        title: `Failed to create poll -- ${e.code}`,
        description: description,
        variant: "destructive",
      });
      reset();
    }

    reset();
    setDialogOpen(false);
    await fetchPolls();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-8 gap-1"
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create Poll
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-5xl md:max-w-3xl sm:max-w-lg max-h-[700px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Create Poll</DialogTitle>
          <DialogDescription>
            Add a poll question, some options and click on Create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-8 items-center gap-4">
            <Label htmlFor="question" className="text-right">
              Question
            </Label>
            <Input
              id="question"
              className="col-span-7"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
            />
          </div>
          {options.map((option, i) => {
            return (
              <div className="grid grid-cols-8 items-center gap-4" key={i}>
                <Label htmlFor={`option ${i}`} className="text-right">
                  {`Option ${i + 1}`}
                </Label>
                <Input
                  id={`option ${i}`}
                  className="col-span-7"
                  value={options[i]}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOptions((prevOptions) => {
                      const newOptions = [...prevOptions];
                      newOptions[i] = val;
                      return newOptions;
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
        <DialogFooter className="sticky">
          <div className="flex w-full justify-between">
            <div>
              {!creatingPoll && (
                <Button variant="secondary" onClick={addNewOptionField}>
                  Add Option
                </Button>
              )}
            </div>
            <div className="flex gap-4">
              {!creatingPoll && (
                <Button type="reset" variant="secondary" onClick={reset}>
                  Reset
                </Button>
              )}
              <Button
                type="submit"
                onClick={createPoll}
                disabled={
                  question.trim() === "" ||
                  options.some((option) => option === "")
                }
              >
                {!creatingPoll ? (
                  "Submit"
                ) : (
                  <Spinner size="small" className="mx-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
