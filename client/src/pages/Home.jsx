import { useRef, useEffect, useState } from "react";
import { Table } from "antd";
import io from "socket.io-client";

const socket = io("http://localhost:5050");

const Home = () => {
  const [importLogs, setImportLogs] = useState([]);
  const timerId = useRef();

  useEffect(() => {
    if (timerId.current === null) {
      socket.emit("get_import_logs");
    }
    timerId.current = setInterval(() => {
      socket.emit("get_import_logs");
    }, 8000);

    socket.on("import_logs_response", (data) => {
      console.log("Received import logs:", data);
      setImportLogs(data);
    });

    return () => {
      socket.off("disconnect");
      clearInterval(timerId?.current);
      timerId.current = null;
    };
  }, []);

  console.log("importLogs", importLogs);

  const columns = [
    {
      title: "Import Id",
      dataIndex: "_id",
      key: "name"
    },
    {
      title: "Import Date Time",
      key: "importDateTime",
      render: (item) => {
        return (
          <div>
            {new Date(item?.timestamp)?.toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })}
          </div>
        );
      }
    },
    {
      title: "Total Fetched",
      dataIndex: "totalFetched",
      key: "totalFetched"
    },
    {
      title: "New Jobs",
      dataIndex: "newJobs",
      key: "newJobs"
    },
    {
      title: "Updated Jobs",
      dataIndex: "updatedJobs",
      key: "updatedJobs"
    },
    {
      title: "Failed Jobs",
      key: "updatedJobs",
      render: (item) => <div>{item?.failedJobs?.length}</div>
    }
  ];

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-xl mb-4">Import Logs</h1>
      <Table columns={columns} dataSource={importLogs} />
    </div>
  );
};

export default Home;
