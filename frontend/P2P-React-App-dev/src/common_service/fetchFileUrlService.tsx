const fetchFileUrlService = async (
  filePath: string,
  fileName: string,
  token: string
): Promise<string | null> => {
  try {
    const response = await fetch(`${filePath}/${fileName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      return url; // Return the URL to be used as an image source
    } else {
      // alert("Unauthorized or file not found");
      return null; // Return null if the file is not found or unauthorized
    }
  } catch (error) {
    console.error("Error fetching file:", error);
    // alert("An error occurred while fetching the file.");
    return null; // Return null if an error occurs
  } finally {
  }
};

export default fetchFileUrlService;
