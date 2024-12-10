"use client";
import Link from "next/link";
import { useState, startTransition, Fragment } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AutosizeTextarea } from "~/components/ui/autosize-textarea";
import {
  editMessage,
  insertFollowUp,
  insertHint,
  MessageType,
} from "../actions";
import { HUNT_END_TIME } from "@/hunt.config";
import { Button } from "~/components/ui/button";

type TableProps = {
  previousHints: PreviousHints;
  hintState?: HintState;
};

type HintState = {
  puzzleId: string;
  hintsRemaining: number;
  unansweredHint: { puzzleId: string; puzzleName: string } | null;
  isSolved: boolean;
};

type PreviousHints = {
  id: number;
  request: string;
  response: string | null;
  followUps: { id: number; message: string; canEdit: boolean }[];
}[];

type Message = {
  id: number;
  value: string;
  type: MessageType;
};

type FollowUp = {
  hintId: number;
  message: string;
};

export default function PreviousHintTable({
  previousHints,
  hintState,
}: TableProps) {
  const [optimisticHints, setOptimisticHints] = useState(previousHints);
  const [request, setRequest] = useState<string>("");
  const [followUp, setFollowUp] = useState<FollowUp | null>(null);
  const [edit, setEdit] = useState<Message | null>(null);
  const [hiddenFollowUps, setHiddenFollowUps] = useState<number[]>([]);

  const handleChangeRequest = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequest(e.target.value);
  };

  const handleSubmitRequest = async (puzzleId: string, message: string) => {
    // Optimistic update
    startTransition(() => {
      setOptimisticHints((prev) => [
        ...prev,
        {
          id: 0,
          request,
          response: null,
          followUps: [],
        },
      ]);
    });

    setRequest("");
    const id = await insertHint(puzzleId, message);
    if (!id) {
      // Revert optimistic update
      startTransition(() => {
        setOptimisticHints((prev) => prev.filter((hint) => hint.id !== 0));
      });
    } else {
      // Update followUpId
      startTransition(() => {
        setOptimisticHints((prev) =>
          prev.map((hint) =>
            hint.id === 0
              ? {
                  ...hint,
                  id,
                }
              : hint,
          ),
        );
      });
    }
  };

  const handleEdit = (id: number, value: string, type: MessageType) => {
    setEdit({ id, value, type });
  };

  const handleChangeEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!edit) return;
    setEdit({ ...edit, value: e.target.value });
  };

  const handleSubmitEdit = async (
    id: number,
    value: string,
    type: MessageType,
  ) => {
    switch (type) {
      case "request":
        // Optimistic update
        startTransition(() => {
          setOptimisticHints((prev) =>
            prev.map((hint) =>
              hint.id === id ? { ...hint, request: value } : hint,
            ),
          );
          setEdit(null);
        });
        // Insert into database
        await editMessage(id, value, type);
        break;
      case "response":
        break;
      case "follow-up":
        // Optimistic update
        startTransition(() => {
          setOptimisticHints((prev) =>
            prev.map((hint) => ({
              ...hint,
              followUps: hint.followUps.map((followUp) =>
                followUp.id === id ? { ...followUp, message: value } : followUp,
              ),
            })),
          );
        });
        setEdit(null);
        // Insert into database
        await editMessage(id, value, type);
        break;
    }
  };

  const handleHideFollowUps = (hintId: number) => {
    // TODO: hiding doesn't work reliably with the follow-up toggle
    // if (hiddenFollowUps.includes(hintId)) {
    //   setHiddenFollowUps((prev) => prev.filter((id) => id !== hintId));
    // } else {
    //   setHiddenFollowUps((prev) => prev.concat(hintId));
    // }
  };

  const handleSubmitFollowUp = async (hintId: number, message: string) => {
    // Optimistic update
    startTransition(() => {
      setOptimisticHints((prev) =>
        prev.map((hint) =>
          hint.id === hintId
            ? {
                ...hint,
                followUps: hint.followUps.concat({
                  id: 0,
                  message,
                  canEdit: false,
                }),
              }
            : hint,
        ),
      );
    });

    setFollowUp(null);
    const followUpId = await insertFollowUp(hintId, message);
    if (!followUpId) {
      // Revert optimistic update
      startTransition(() => {
        setOptimisticHints((prev) =>
          prev.map((hint) =>
            hint.id === hintId
              ? {
                  ...hint,
                  followUps: hint.followUps.filter(
                    (followUp) => followUp.id !== 0,
                  ),
                }
              : hint,
          ),
        );
      });
    } else {
      // Update followUpId
      startTransition(() => {
        setOptimisticHints((prev) =>
          prev.map((hint) =>
            hint.id === hintId
              ? {
                  ...hint,
                  followUps: hint.followUps.map((followUp) =>
                    followUp.id === 0
                      ? { ...followUp, id: followUpId, canEdit: true }
                      : followUp,
                  ),
                }
              : hint,
          ),
        );
      });
    }
  };

  const handleChangeFollowUp = (
    hintId: number,
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (followUp === null) return;
    setFollowUp({ hintId, message: e.target.value });
  };

  const currDate = new Date();
  let getFormDescription = null;

  if (hintState) {
    const { puzzleId, hintsRemaining, unansweredHint, isSolved } = hintState;
    getFormDescription = () => {
      if (currDate > HUNT_END_TIME) {
        return <>Hunt has ended and live hinting has closed.</>;
      }

      if (isSolved) {
        return <>You have already solved this puzzle.</>;
      }

      if (unansweredHint) {
        if (puzzleId === unansweredHint.puzzleId) {
          return <>You have an outstanding hint on this puzzle.</>;
        } else {
          return (
            <>
              You have an outstanding hint on the puzzle{" "}
              <Link
                href={`/puzzle/${unansweredHint.puzzleId}`}
                className="hover:text-link text-blue-500 hover:underline"
              >
                {unansweredHint.puzzleName}
              </Link>
              .
            </>
          );
        }
      }

      if (hintsRemaining === 0) {
        return <>No hints remaining.</>;
      } else if (hintsRemaining === 1) {
        return <>1 hint remaining.</>;
      } else {
        return <>{hintsRemaining} hints remaining.</>;
      }
    };
  }

  return (
    <Table className="table-fixed">
      <TableBody>
        {optimisticHints.map((hint) => (
          <Fragment key={`${hint.id}`}>
            {/* Request row */}
            <TableRow key={`${hint.id}-request`}>
              <TableCell className="break-words">
                <div className="flex justify-between pb-4">
                  <p className="inline rounded-md bg-sky-100 p-1">Request</p>
                  <div className="p-1">
                    {edit?.id !== hint.id ? (
                      <button
                        onClick={() =>
                          handleEdit(hint.id, hint.request, "request")
                        }
                        className="text-link hover:underline"
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={() =>
                            handleSubmitEdit(edit.id, edit.value, "request")
                          }
                          className="text-link hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEdit(null)}
                          className="text-link hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-1 pb-4">
                  {edit?.type === "request" && edit.id === hint.id ? (
                    <AutosizeTextarea
                      maxHeight={500}
                      className="resize-none"
                      value={edit.value}
                      onChange={handleChangeEdit}
                    />
                  ) : (
                    hint.request
                  )}
                </div>
              </TableCell>
            </TableRow>
            {/* Response row */}
            {hint.response && (
              <TableRow key={`${hint.id}-response`}>
                <TableCell
                  className="break-words"
                  onClick={() => handleHideFollowUps(hint.id)}
                >
                  <div className="flex justify-between pb-4">
                    <p className="inline rounded-md bg-orange-100 p-1">
                      Response
                    </p>
                    {hint.response && (
                      <div className="p-1">
                        {followUp === null ? (
                          <button
                            onClick={() =>
                              setFollowUp({ hintId: hint.id, message: "" })
                            }
                            className="text-link hover:underline"
                          >
                            Follow-Up
                          </button>
                        ) : (
                          <button
                            onClick={() => setFollowUp(null)}
                            className="text-link hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-1 pb-4">{hint.response}</div>
                </TableCell>
              </TableRow>
            )}
            {/* FollowUps row */}
            {!hiddenFollowUps.includes(hint.id) &&
              hint.followUps.map((followUp) => (
                <TableRow key={`${followUp.id}`}>
                  <TableCell className="break-words pl-10">
                    <div className="flex justify-between pb-4">
                      <p className="inline rounded-md bg-green-100 p-1">
                        Follow-Up
                      </p>
                      {followUp.canEdit && (
                        <div className="p-1">
                          {edit?.type === "follow-up" &&
                          edit.id === followUp.id ? (
                            <button
                              onClick={() =>
                                handleSubmitEdit(
                                  followUp.id,
                                  edit.value,
                                  "follow-up",
                                )
                              }
                              className="text-link hover:underline"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleEdit(
                                  followUp.id,
                                  followUp.message,
                                  "follow-up",
                                )
                              }
                              className="text-link hover:underline"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-1 pb-4">
                      {edit?.type === "follow-up" && edit.id === followUp.id ? (
                        <AutosizeTextarea
                          maxHeight={500}
                          className="resize-none"
                          value={edit.value}
                          onChange={handleChangeEdit}
                        />
                      ) : (
                        followUp.message
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            {/* New followup row */}
            {followUp !== null && followUp.hintId === hint.id && (
              <TableRow key={`${hint.id}-follow-up-request`}>
                <TableCell className="break-words rounded-lg bg-gray-200">
                  <p className="p-1 font-bold">Follow-Up</p>
                  <div className="p-1">
                    <AutosizeTextarea
                      maxHeight={500}
                      className="resize-none"
                      value={followUp.message}
                      onChange={(event) => handleChangeFollowUp(hint.id, event)}
                    />
                  </div>
                  <div className="flex space-x-2 p-1">
                    <Button
                      onClick={() =>
                        handleSubmitFollowUp(hint.id, followUp.message)
                      }
                    >
                      Submit
                    </Button>
                    <Button variant="outline" onClick={() => setFollowUp(null)}>
                      Cancel
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
        {hintState && (
          <TableRow>
            <TableCell className="break-words rounded-lg bg-gray-200">
              <p className="p-1 font-bold">Request</p>
              <p className="p-1 text-gray-800">
                Please provide as much detail as possible to help us understand
                where you're at and where you're stuck! Specific clues, steps,
                and hypotheses are all helpful. If you're working with any
                spreadsheets, diagrams, or external resources, you can include
                links.
              </p>
              <div className="p-1">
                <AutosizeTextarea
                  maxHeight={500}
                  className="resize-none border-black bg-white"
                  disabled={
                    hintState.isSolved ||
                    !!hintState.unansweredHint ||
                    hintState.hintsRemaining < 1 ||
                    currDate > HUNT_END_TIME
                  }
                  value={request}
                  onChange={handleChangeRequest}
                />
                {getFormDescription && (
                  <div className="p-1 text-sm text-gray-800">
                    {getFormDescription()}
                  </div>
                )}
              </div>
              <div className="p-1">
                <Button
                  onClick={() =>
                    handleSubmitRequest(hintState.puzzleId, request)
                  }
                >
                  Submit
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
