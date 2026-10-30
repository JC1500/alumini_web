import SocketConnectionTest from "@/components/chat/socket-test-connection";

export default function SocketTestPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Socket.IO Testing
      </h1>

      <SocketConnectionTest />
    </main>
  );
}