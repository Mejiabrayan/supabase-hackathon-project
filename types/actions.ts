export interface AuthState {
    error?: string;
    success?: boolean;
    message?: string;
    email?: string;
  }
  
  export type ServerAction<State> = (
    state: Awaited<State>,
    formData: FormData
  ) => Promise<State>;
  export type ClientAction<State> = (state: State) => State | Promise<State>;