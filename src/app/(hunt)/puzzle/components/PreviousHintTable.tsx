"use client";
import { useState, startTransition, Fragment } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AutosizeTextarea } from "~/components/ui/autosize-textarea";
import { editMessage, insertFollowUp, MessageType } from "../actions";

type TableProps = {
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
}: {
  previousHints: TableProps;
}) {
  const [optimisticHints, setOptimisticHints] = useState(previousHints);
  const [edit, setEdit] = useState<Message | null>(null);
  const [followUp, setFollowUp] = useState<FollowUp | null>(null);
  const [hiddenFollowUps, setHiddenFollowUps] = useState<number[]>([]);

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
    if (hiddenFollowUps.includes(hintId)) {
      setHiddenFollowUps((prev) => prev.filter((id) => id !== hintId));
    } else {
      setHiddenFollowUps((prev) => prev.concat(hintId));
    }
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

  const handleFollowUpChange = (
    hintId: number,
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (followUp === null) return;
    setFollowUp({ hintId, message: e.target.value });
  };

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
                        className="underline"
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={() =>
                            handleSubmitEdit(edit.id, edit.value, "request")
                          }
                          className="underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEdit(null)}
                          className="underline"
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
                            className="underline"
                          >
                            Follow-Up
                          </button>
                        ) : (
                          <button
                            onClick={() => setFollowUp(null)}
                            className="underline"
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
            {/* FollowUp row */}
            {!hiddenFollowUps.includes(hint.id) &&
              hint.followUps.map((followUp) => (
                <TableRow key={`${followUp.id}`}>
                  <TableCell className="break-words pl-10">
                    <div className="flex justify-between pb-4">
                      <p className="inline rounded-md bg-green-100 p-1">
                        Follow-Up
                      </p>
                      {followUp.canEdit &&
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
                              className="underline"
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
                              className="underline"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      }
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
            {followUp !== null && followUp.hintId === hint.id && (
              <TableRow key={`${hint.id}-follow-up-request`}>
                <TableCell className="break-words bg-gray-200">
                  <div className="pb-4">
                    <p className="p-1">Follow-Up</p>
                  </div>
                  <div className="p-1 pb-4">
                    <AutosizeTextarea
                      maxHeight={500}
                      className="resize-none"
                      value={followUp.message}
                      onChange={(event) => handleFollowUpChange(hint.id, event)}
                    />
                  </div>
                  <div className="flex space-x-2 p-1">
                    <button
                      onClick={() =>
                        handleSubmitFollowUp(hint.id, followUp.message)
                      }
                      className="underline"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setFollowUp(null)}
                      className="underline"
                    >
                      Cancel
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
