export declare const useSignup: (setIsEmailVerified: (verified: boolean) => void) => {
    data: undefined;
    error: null;
    isError: false;
    isIdle: true;
    isLoading: false;
    isSuccess: false;
    status: "idle";
    mutate: import("@tanstack/react-query").UseMutateFunction<any, unknown, {
        name: string;
        email: string;
        password: string;
    }, unknown>;
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: unknown;
    isPaused: boolean;
    variables: {
        name: string;
        email: string;
        password: string;
    } | undefined;
    mutateAsync: import("@tanstack/react-query").UseMutateAsyncFunction<any, unknown, {
        name: string;
        email: string;
        password: string;
    }, unknown>;
} | {
    data: undefined;
    error: null;
    isError: false;
    isIdle: false;
    isLoading: true;
    isSuccess: false;
    status: "loading";
    mutate: import("@tanstack/react-query").UseMutateFunction<any, unknown, {
        name: string;
        email: string;
        password: string;
    }, unknown>;
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: unknown;
    isPaused: boolean;
    variables: {
        name: string;
        email: string;
        password: string;
    } | undefined;
    mutateAsync: import("@tanstack/react-query").UseMutateAsyncFunction<any, unknown, {
        name: string;
        email: string;
        password: string;
    }, unknown>;
} | {
    data: undefined;
    error: unknown;
    isError: true;
    isIdle: false;
    isLoading: false;
    isSuccess: false;
    status: "error";
    mutate: import("@tanstack/react-query").UseMutateFunction<any, unknown, {
        name: string;
        email: string;
        password: string;
    }, unknown>;
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: unknown;
    isPaused: boolean;
    variables: {
        name: string;
        email: string;
        password: string;
    } | undefined;
    mutateAsync: import("@tanstack/react-query").UseMutateAsyncFunction<any, unknown, {
        name: string;
        email: string;
        password: string;
    }, unknown>;
} | {
    data: any;
    error: null;
    isError: false;
    isIdle: false;
    isLoading: false;
    isSuccess: true;
    status: "success";
    mutate: import("@tanstack/react-query").UseMutateFunction<any, unknown, {
        name: string;
        email: string;
        password: string;
    }, unknown>;
    reset: () => void;
    context: unknown;
    failureCount: number;
    failureReason: unknown;
    isPaused: boolean;
    variables: {
        name: string;
        email: string;
        password: string;
    } | undefined;
    mutateAsync: import("@tanstack/react-query").UseMutateAsyncFunction<any, unknown, {
        name: string;
        email: string;
        password: string;
    }, unknown>;
};
