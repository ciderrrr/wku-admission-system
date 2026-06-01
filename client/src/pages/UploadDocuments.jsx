import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

function UploadDocuments() {
  const { applicationId } = useParams();

  const [documentType, setDocumentType] = useState("Passport");
  const [file, setFile] = useState(null);

  const uploadFile = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("application_id", applicationId);
    formData.append("document_type", documentType);
    formData.append("document", file);

    try {
      await API.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Document uploaded successfully!");
      window.location.href = "/student";
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={uploadFile} style={styles.card}>
        <h2>Upload Documents</h2>
        <p>Application ID: {applicationId}</p>

        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          style={styles.input}
        >
          <option value="Passport">Passport</option>
          <option value="Transcript">Transcript</option>
          <option value="English Test Score">English Test Score</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Upload
        </button>

        <button
          type="button"
          style={styles.back}
          onClick={() => (window.location.href = "/student")}
        >
          Back
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "420px",
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginTop: "12px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "18px",
    backgroundColor: "#003366",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  back: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    backgroundColor: "#777",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default UploadDocuments;