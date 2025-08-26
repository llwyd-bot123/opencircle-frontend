/**
 * Converts a plain object into FormData
 * Handles nested objects, arrays, and File instances
 */
export const objectToFormData = (
  obj: Record<string, unknown>,
  fileFields: string[] = [
    "logo",
    "image",
    "file",
    "avatar",
    "photo",
    "profile_picture",
  ]
): FormData => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, String(item));
        });
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    } else {
      // Check if this field is expected to be a file
      if (fileFields.includes(key)) {
        const emptyFile = new File([], "", {
          type: "application/octet-stream",
        });
        formData.append(key, emptyFile);
      } else {
        formData.append(key, "");
      }
    }
  });

  return formData;
};
