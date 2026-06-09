import {
  useRef,
  useState,
} from "react";
import "./App.css";
import fileArrowUpIcon from "./assets/file-arrow-up-solid-full.svg";

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>();
  const [file, setFile] = useState<File>();
  const [otp, setOtp] = useState<number>();
  const [dragActive, setDragActive] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // trigger click on input
  };

  const onSubmit = async () => {
    if (!file) {
      alert("กรุณาเลือกไฟล์ก่อนส่ง");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify({ otp: otp }));
    try {
      const response = await fetch("/api/vault/sign/pubkey", {
        method: "POST",
        body: formData,
      });
      if (response.status === 200) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "id_rsa.pub";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        if (response.status === 403) {
          alert("ไม่มีสิทธิ์ในการใช้งาน");
        } else {
          alert("เกิดข้อผิดพลาด: " + response.statusText);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("เกิดข้อผิดพลาด: " + error.message);
      } else {
        alert("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ: " + String(error));
      }
    }
  };

  const dowloadSSHClient = async () => {
    try {
      const response = await fetch("/api/download/clientssh", {
        method: "GET",
      });
      if (response.status === 200) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "clientssh.exe";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        if (response.status === 403) {
          alert("ไม่มีสิทธิ์ในการใช้งาน");
        } else {
          alert("เกิดข้อผิดพลาด: " + response.statusText);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("เกิดข้อผิดพลาด: " + error.message);
      } else {
        alert("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ: " + String(error));
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".pub")) {
      alert("กรุณาเลือกไฟล์ public key ที่ถูกต้อง");
      event.target.value = ""; // ล้างค่า input
      return;
    }
    setName(selectedFile.name);
    setFile(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile.name.endsWith(".pub")) {
        alert("กรุณาเลือกไฟล์ public key ที่ถูกต้อง");
        return;
      }
      setName(droppedFile.name);
      setFile(droppedFile);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Background Glowing Orbs */}
      <div className="orb-container">
        <div className="orb orb-purple"></div>
        <div className="orb orb-pink"></div>
        <div className="orb orb-white"></div>
      </div>

      {/* Starfield Stars */}
      <div className="starfield"></div>

      {/* Sparkling Icons */}
      <div className="sparkle-icon sparkle-1">✦</div>
      <div className="sparkle-icon sparkle-2">✧</div>
      <div className="sparkle-icon sparkle-3">✦</div>
      <div className="sparkle-icon sparkle-4">✧</div>

      {/* Main Glassmorphic Container Card */}
      <div className="glass-card">
        <div className="card-header">
          <h1 className="card-title">SSH Key Signer</h1>
        </div>

        <input
          type="file"
          id="pubkey"
          name="pubkey"
          ref={fileInputRef}
          accept=".pub"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Drag & Drop Zone */}
        <div className="dropzone-container">
          <label className="dropzone-label">อัปโหลด Public Key</label>
          <div
            className={`dropzone-area ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            {name ? (
              <div className="file-selected-info">
                <span className="dropzone-icon" style={{ color: "#c084fc" }}>🔑</span>
                <span className="file-name-display">{name}</span>
                <span className="file-change-action">คลิกเพื่อเปลี่ยนไฟล์</span>
              </div>
            ) : (
              <>
                <img
                  src={fileArrowUpIcon}
                  className="dropzone-icon"
                  alt="Upload Icon"
                  style={{
                    width: "42px",
                    height: "42px",
                    filter: "invert(1) drop-shadow(0 0 8px rgba(192, 132, 252, 0.6))",
                  }}
                />
                <p className="dropzone-text">ลากและวางไฟล์ .pub หรือคลิกเพื่ออัปโหลด</p>
                <p className="dropzone-subtext">รองรับเฉพาะนามสกุลไฟล์ .pub เท่านั้น</p>
              </>
            )}
          </div>
        </div>

        {/* OTP Input Fields */}
        <div className="input-group">
          <label htmlFor="otp" className="input-label">
            รหัสผ่าน (OTP):
          </label>
          <div className="input-wrapper">
            <input
              id="otp"
              className="custom-input"
              type="number"
              placeholder="กรอกรหัสผ่าน OTP เพื่อลงชื่อ"
              value={otp !== undefined && !isNaN(otp) ? otp : ""}
              onChange={(event) => {
                const val = event.target.value;
                setOtp(val === "" ? undefined : parseInt(val));
              }}
            />
          </div>
        </div>

        {/* Primary Submit Button */}
        <button className="btn-primary" onClick={onSubmit}>
          <span>ส่งไฟล์และลงชื่อ</span>
          <span style={{ fontSize: "14px" }}>⚡</span>
        </button>

        {/* Divider and Secondary Section */}
        <div className="divider">เครื่องมือเพิ่มเติม</div>

        <button className="btn-secondary" onClick={dowloadSSHClient}>
          <span>ดาวน์โหลดไคล์เอนต์ SSH (.exe)</span>
          <span style={{ fontSize: "14px" }}>📥</span>
        </button>
      </div>
    </div>
  );
}

export default App;
