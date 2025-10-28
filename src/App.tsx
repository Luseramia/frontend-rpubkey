import {
  useRef,
  useState,
} from "react";
import "./App.css";

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<String>();
  const [file, setFile] = useState<File>();
  const [otp, setOtp] = useState<number>();
  const handleButtonClick = () => {
    fileInputRef.current?.click(); // trigger click on input
  };

  const onSubmit = async () => {
    if (!file) {
      console.log("No file selected");
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
      if (response.status == 200) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "id_rsa.pub";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      else{
        if(response.status == 403){
          alert(" ไม่มีสิทธิ์ในการใช้งาน");
        }
        else{
          alert("เกิดข้อผิดพลาด: " + response);
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


  const dowloadSSHClient = async()=>{
        try {
      const response = await fetch("/api/download/clientssh", {
        method: "GET",
      });
      if (response.status == 200) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "clientssh.exe";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      else{
        if(response.status == 403){
          alert(" ไม่มีสิทธิ์ในการใช้งาน");
        }
        else{
          alert("เกิดข้อผิดพลาด: " + response);
        }        
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("เกิดข้อผิดพลาด: " + error.message);
      } else {
        alert("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ: " + String(error));
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.endsWith(".pub")) {
      alert("กรุณาเลือกไฟล์ public key ที่ถูกต้อง");
      event.target.value = ""; // ล้างค่า input
      return;
    }
    setName(file.name);
    setFile(file);
  };

  return (
    <div className="container">
      <input
        type="file"
        id="pubkey"
        name="pubkey"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div className="button-select-file" onClick={handleButtonClick}>
        เลือกไฟล์
      </div>
      <p style={{ display: "block", color: "white", fontSize: "50px" }}>
        {name}
      </p>
      <label
        htmlFor="otp"
        style={{ height: "40px", fontSize: "30px", color: "white" }}
      >
        รหัสผ่าน:
      </label>
      <input
        id="otp"
        style={{ height: "40px", fontSize: "30px" }}
        type="number"
        value={otp}
        onChange={(event) => {
          setOtp(parseInt(event.target.value));
        }}
      ></input>
      <div className="button-select-file" onClick={onSubmit}>
        ส่งไฟล์
      </div>
        <div style={{marginTop:'5rem'}} className="button-select-file" onClick={dowloadSSHClient}>
        ดาวน์โหลดไคล์เอนต์ SSH
      </div>
    </div>
  );
}

export default App;
