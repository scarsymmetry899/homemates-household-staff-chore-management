import {
  executeMutation,
  executeQuery,
  getDataConnect,
  mutationRef,
  queryRef,
} from "firebase/data-connect";
import { connectorConfig } from "@homemaker/dataconnect";

export function staffRead<T>(
  operation: string,
  variables: Record<string, string> = {},
) {
  return executeQuery(
    queryRef<T, typeof variables>(
      getDataConnect(connectorConfig),
      operation,
      variables,
    ),
    { fetchPolicy: "SERVER_ONLY" },
  );
}

export function staffWrite(
  operation: string,
  variables: Record<string, string | null>,
) {
  return executeMutation(
    mutationRef(getDataConnect(connectorConfig), operation, variables),
  );
}

export interface StaffWork {
  profiles: {
    id: string;
    name: string;
    role: string;
    household: { name: string; timezone: string };
  }[];
  tasks: {
    id: string;
    title: string;
    status: string;
    dueAt?: string;
    completedAt?: string;
    occurrenceDay?: string;
    routineRoom?: string;
    routineInstructions?: string;
  }[];
  attendance: { id: string; occurredAt: string; eventType: string }[];
  corrections: { id: string; requestedFor: string; requestedStatus: string }[];
  pay: {
    id: string;
    monthLabel: string;
    baseSalary: number;
    deductions: number;
    advances: number;
    netPay: number;
    status: string;
  }[];
}
