import { toast } from "sonner";

export function getErrorStatus(error: unknown): number | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status !== "string"
  ) {
    return (error as { status: number }).status;
  }
  return null;
}

export function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data: unknown }).data === "object" &&
    (error as { data: { error?: string; message?: string } }).data
  ) {
    const data = (error as { data: { error?: string; message?: string } }).data;
    if (data.error) return data.error;
    if (data.message) return data.message;
  }
  return "Something went wrong";
}

export function showErrorToast(error: unknown) {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error);

  if (status === 401) {
    toast.error("You have been signed out");
  } else if (status === 403) {
    toast.error("Forbidden");
  } else if (status === 400 || status === 422) {
    toast.error(message);
  } else if (status && status >= 500) {
    toast.error("Server error");
  } else {
    toast.error(message);
  }
}
