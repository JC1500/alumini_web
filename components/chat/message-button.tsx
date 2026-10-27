import { startConversation } from "@/app/actions/chat";
import { Button } from "@/components/ui/button";

export default function MessageButton({ username }: { username: string }) {
  const action = startConversation.bind(null, username);

  return (
    <form action={action}>
      <Button type="submit" size="lg" className="rounded-full">
        Message
      </Button>
    </form>
  );
}
