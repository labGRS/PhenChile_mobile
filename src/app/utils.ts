export function parseImageFilename(filename: string): Date | undefined {
  // Regular expression to match the date and time pattern
  const regex = /(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})/;

  // Try to match the pattern in the filename
  const match = filename.match(regex);

  if (match) {
    // Extract date and time parts
    const [, datePart, timePart] = match;

    // Replace the hyphen in the time part with a colon
    const timeWithColon = timePart.replace("-", ":");

    // Combine date and time parts
    const dateTimeString = `${datePart}T${timeWithColon}:00`;

    // Create a new Date object
    const parsedDate = new Date(dateTimeString);

    // Check if the date is valid
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  // Return null if parsing fails
  return undefined;
}
