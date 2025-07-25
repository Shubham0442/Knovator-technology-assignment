import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5050");

const Home = () => {
  const [importLogs, setImportLogs] = useState([]);
  const timerId = useRef();

  useEffect(() => {
    timerId.current = setInterval(() => {
      socket.emit("get_import_logs");
    }, 8000);

    socket.on("import_logs_response", (data) => {
      console.log("Received import logs:", data);
      setImportLogs(data);
    });

    return () => {
      socket.off("import_logs_response");
      clearInterval(timerId?.current);
      timerId.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full border border-black p-4">
      <h1 className="text-xl mb-4">Import Logs</h1>
      <ul className="text-sm list-disc ml-5">
        {importLogs?.map((log) => (
          <li key={log._id}>
            {new Date(log.importDateTime).toLocaleString()} | Total:{" "}
            {log.totalFetched} | New: {log.newJobs} | Updated: {log.updatedJobs}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
