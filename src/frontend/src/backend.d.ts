import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ExamRegistration {
    user: Principal;
    timestamp: Time;
    examId: bigint;
}
export type Time = bigint;
export interface Profile {
    password: string;
    fullName: string;
    email: string;
    mobile: string;
}
export interface UserProfile {
    fullName: string;
    email: string;
    mobile: string;
}
export interface Exam {
    id: bigint;
    title: string;
    category: string;
    examDate: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllExams(): Promise<Array<Exam>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExamsByCategory(category: string): Promise<Array<Exam>>;
    getMyProfile(): Promise<Profile>;
    getMyRegistrations(): Promise<Array<ExamRegistration>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    login(email: string, password: string): Promise<Profile>;
    register(fullName: string, email: string, mobile: string, password: string): Promise<void>;
    registerForExam(examId: bigint): Promise<void>;
    saveCallerUserProfile(userProfile: UserProfile): Promise<void>;
    unregisterFromExam(examId: bigint): Promise<void>;
}
