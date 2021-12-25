export const errorHandler = (error: any) => {
  switch (error.code) {
    case "auth/invalid-email":
      return "Email is invalid!";
    case "auth/user-not-found":
      return "User not found!";
    case "auth/email-already-in-use":
      return "Email is already in use!";
    case "auth/wrong-password":
      return "Incorrect Password!";
    default:
      return error?.code || "";
  }
};

export const convertFileUriToBlob = async (uri: string): Promise<Blob> => {
  const blob: Blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  return blob;
};

export const ratingColor = (rating: number) => {
  rating = Math.round(rating);
  switch (rating) {
    case 5:
      return "#57e32c";
    case 4:
      return "#b7dd29";
    case 3:
      return "#ffe234";
    case 2:
      return "#ffa534";
    case 1:
      return "#ff4545";
  }
};

export const roundRating = (rating: number, base: number = 10) => {
  const roundedRating = Math.round(rating * base) / base;
  return String(roundedRating).includes(".")
    ? String(roundedRating)
    : String(roundedRating) + ".0";
};
