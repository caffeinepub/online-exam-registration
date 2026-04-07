import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface ExamData {
  id: bigint;
  title: string;
  category: string;
  examDate: string;
}

export interface RegistrationRef {
  examId: bigint;
  timestamp: bigint;
}

export function useAllExams() {
  const { actor, isFetching } = useActor();
  return useQuery<ExamData[]>({
    queryKey: ["allExams"],
    queryFn: async () => {
      if (!actor) return [];
      const exams = await actor.getAllExams();
      return exams.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        examDate: e.examDate,
      }));
    },
    enabled: !!actor && !isFetching,
    placeholderData: [],
  });
}

export function useMyRegistrations() {
  const { actor, isFetching } = useActor();
  return useQuery<RegistrationRef[]>({
    queryKey: ["myRegistrations"],
    queryFn: async () => {
      if (!actor) return [];
      const regs = await actor.getMyRegistrations();
      return regs.map((r) => ({ examId: r.examId, timestamp: r.timestamp }));
    },
    enabled: !!actor && !isFetching,
    placeholderData: [],
  });
}

export function useRegisterForExam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (examId: bigint) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.registerForExam(examId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
    },
  });
}

export function useUnregisterFromExam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (examId: bigint) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.unregisterFromExam(examId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRegistrations"] });
    },
  });
}
