export const errorHandler = (error: any) => {
  switch (error.code) {
    case "auth/invalid-email":
      return "Email is invalid!";
    case "auth/user-not-found":
      return "User not found!";
    case "auth/email-already-in-use":
      return "Email is already in use!";
    default:
      return error?.code || "";
  }
};
