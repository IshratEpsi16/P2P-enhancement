const fetchFileService = async (
  filePath: string,
  fileName: string,
  token: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  //   console.log("file path:", `${filePath}/${fileName}`);

  try {
    setLoading(true); // Start loading before the fetch begins
    const response = await fetch(`${filePath}/${fileName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      window.open(url); // Open the file in a new tab
    } else {
      alert("Unauthorized or file not found");
    }
  } catch (error) {
    console.error("Error fetching file:", error);

    alert("An error occurred while fetching the file.");
  } finally {
    setLoading(false);
  }
};

export default fetchFileService;
